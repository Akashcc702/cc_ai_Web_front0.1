// ===============================
// 🎬 CINEMATIC SPLASH (VIDEO)
// ===============================
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  const video  = document.getElementById("introVideo");

  let introDone = false; // ✅ Guard — endIntro ಒಂದೇ ಸಲ run ಆಗಲಿ

  const endIntro = () => {
    if (introDone) return;
    introDone = true;
    if (!splash) return;
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.style.display = "none";
      document.body.style.overflow = "auto";
    }, 1000);
  };

  if (video) {
    video.muted = true;

    // Auto-end after 4s max (safety fallback)
    const autoEnd = setTimeout(endIntro, 4000);

    // Video played fully
    video.addEventListener("ended", () => {
      clearTimeout(autoEnd);
      endIntro();
    });

    // Video can play — end after it finishes (max 4s)
    video.addEventListener("canplaythrough", () => {
      clearTimeout(autoEnd);
      const dur = (video.duration && isFinite(video.duration))
        ? Math.min(video.duration * 1000, 4000)
        : 3000;
      setTimeout(endIntro, dur);
    });

    // Video or source failed to load — hide splash immediately
    video.addEventListener("error", () => { clearTimeout(autoEnd); endIntro(); });
    video.querySelectorAll("source").forEach(s =>
      s.addEventListener("error", () => { clearTimeout(autoEnd); setTimeout(endIntro, 300); })
    );

    video.play().catch(() => { clearTimeout(autoEnd); endIntro(); });

  } else {
    setTimeout(endIntro, 500);
  }
});

// ===============================
// 💬 CHAT SYSTEM
// ===============================
const chatDiv    = document.getElementById("chat");
const input      = document.getElementById("msg");
const btn        = document.getElementById("sendBtn");
const chatList   = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChat");

// ── Safe localStorage wrappers ──────────────────────
function safeGetChats() {
  try { return JSON.parse(localStorage.getItem("chats")) || {}; }
  catch (e) { return {}; }
}
function saveChats() {
  try { localStorage.setItem("chats", JSON.stringify(chats)); }
  catch (e) { /* storage blocked — silently ignore */ }
}

// ── Marked.js: load inline to avoid CDN storage warnings ──
// (inline fallback if CDN blocked)
function parseMarkdown(text) {
  try {
    if (typeof marked !== "undefined" && marked.parse) {
      return marked.parse(text);
    }
  } catch(e) {}
  // Simple fallback: bold, code, newlines
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}

let chats         = safeGetChats();
let currentChatId = null;
let isStreaming   = false;

// ── Render sidebar chat list ─────────────────────────
function renderChats() {
  chatList.innerHTML = "";
  Object.keys(chats).reverse().forEach(id => {
    const div = document.createElement("div");
    div.className = "chat-item" + (id === currentChatId ? " active" : "");
    div.textContent = chats[id].title || "New Chat";
    div.onclick = () => {
      if (isStreaming) return; // don't switch mid-stream
      currentChatId = id;
      renderChats();
      renderMessages();
    };
    chatList.appendChild(div);
  });
}

// ── Render messages ──────────────────────────────────
function renderMessages() {
  chatDiv.innerHTML = "";
  const msgs = chats[currentChatId]?.messages || [];

  msgs.forEach((m, idx) => {
    const div = document.createElement("div");
    div.className = "msg " + m.role;

    // Glow flash only on the very last AI message
    if (m.role === "ai" && idx === msgs.length - 1) {
      div.classList.add("flash");
    }

    if (m.role === "ai") {
      if (m.content === "__THINKING__") {
        div.innerHTML = `<div class="thinking-dots">
          <span></span><span></span><span></span>
        </div>`;
      } else {
        div.innerHTML = parseMarkdown(m.content);
      }
    } else {
      div.textContent = m.content;
    }

    chatDiv.appendChild(div);
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function addMessage(role, content) {
  if (!chats[currentChatId]) return;
  chats[currentChatId].messages.push({ role, content });
  saveChats();
}

// ── New chat button ──────────────────────────────────
newChatBtn.onclick = () => {
  const id = Date.now().toString();
  chats[id] = { title: "New Chat", messages: [] };
  currentChatId = id;
  saveChats();
  renderChats();
  renderMessages();
};

// ── Send message ─────────────────────────────────────
async function send() {
  const message = input.value.trim();
  if (!message)       return;
  if (!currentChatId) { alert("Please start a new chat first!"); return; }
  if (isStreaming)    return; // ✅ Block double-send

  isStreaming   = true;
  btn.disabled  = true;
  input.value   = "";

  // 💥 Particle burst animation on send
  if (typeof window.ccAnimSendBurst === "function") {
    window.ccAnimSendBurst();
  }

  addMessage("user", message);
  addMessage("ai", "__THINKING__");
  renderMessages();

  try {
    const res = await fetch("https://cc-ai-web.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText  = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      fullText += decoder.decode(value, { stream: true });

      // Update the last (AI) message content
      const msgs = chats[currentChatId]?.messages;
      if (msgs && msgs.length > 0) {
        msgs[msgs.length - 1].content = fullText;
        saveChats();
        renderMessages();
      }
    }

    // Set chat title from first message
    if (chats[currentChatId]?.title === "New Chat") {
      chats[currentChatId].title = message.slice(0, 28);
      saveChats();
      renderChats();
    }

  } catch (err) {
    const msgs = chats[currentChatId]?.messages;
    if (msgs && msgs.length > 0) {
      msgs[msgs.length - 1].content = `❌ Error: ${err.message}`;
      saveChats();
      renderMessages();
    }
  } finally {
    isStreaming  = false;
    btn.disabled = false;
    input.focus();
  }
}

// ── Event listeners ──────────────────────────────────
btn.onclick = send;

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // ✅ Prevent form submit / extra events
    send();
  }
});

// ── Init ─────────────────────────────────────────────
if (Object.keys(chats).length === 0) {
  newChatBtn.click();
} else {
  currentChatId = Object.keys(chats)[0];
  renderChats();
  renderMessages();
}
