// ===============================
// 🎬 CINEMATIC SPLASH (VIDEO)
// ===============================
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  const video  = document.getElementById("introVideo");

  const endIntro = () => {
    if (!splash) return;
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.style.display = "none";
      document.body.style.overflow = "auto";
    }, 1000);
  };

  if (video) {
    video.muted = true;

    // ✅ If video fails to load (404 etc), hide splash anyway
    video.addEventListener("error", () => endIntro());

    // ✅ All <source> failed
    const sources = video.querySelectorAll("source");
    sources.forEach(s => s.addEventListener("error", () => {
      setTimeout(endIntro, 500);
    }));

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => endIntro());
    }

    // ✅ Auto-end after 4s max (covers slow connections)
    const autoEnd = setTimeout(endIntro, 4000);

    video.addEventListener("ended", () => {
      clearTimeout(autoEnd);
      endIntro();
    });

    // ✅ If video loads fine, end after it plays
    video.addEventListener("canplay", () => {
      clearTimeout(autoEnd);
      setTimeout(endIntro, Math.min(video.duration * 1000 || 3000, 4000));
    });

  } else {
    // No video element at all
    setTimeout(endIntro, 500);
  }
});

// ===============================
// 💬 CHAT SYSTEM
// ===============================
const chatDiv  = document.getElementById("chat");
const input    = document.getElementById("msg");
const btn      = document.getElementById("sendBtn");
const chatList = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChat");

function safeGetChats() {
  try { return JSON.parse(localStorage.getItem("chats")) || {}; }
  catch (e) { return {}; }
}

function saveChats() {
  try { localStorage.setItem("chats", JSON.stringify(chats)); }
  catch (e) { console.warn("Storage blocked:", e); }
}

let chats         = safeGetChats();
let currentChatId = null;
let isStreaming   = false;

function renderChats() {
  chatList.innerHTML = "";
  Object.keys(chats).forEach(id => {
    const div = document.createElement("div");
    div.className = "chat-item" + (id === currentChatId ? " active" : "");
    div.textContent = chats[id].title || "New Chat";
    div.onclick = () => {
      currentChatId = id;
      renderChats();
      renderMessages();
    };
    chatList.appendChild(div);
  });
}

function renderMessages() {
  chatDiv.innerHTML = "";
  const msgs = chats[currentChatId]?.messages || [];
  msgs.forEach((m, idx) => {
    const div = document.createElement("div");
    div.className = "msg " + m.role;

    // ✨ Flash class on the latest AI message
    if (m.role === "ai" && idx === msgs.length - 1) {
      div.classList.add("flash");
    }

    if (m.role === "ai") {
      // Check if this is the "thinking" placeholder
      if (m.content === "__THINKING__") {
        div.innerHTML = `
          <div class="thinking-dots">
            <span></span><span></span><span></span>
          </div>`;
      } else {
        try {
          div.innerHTML = typeof marked !== "undefined"
            ? marked.parse(m.content)
            : m.content;
        } catch (e) {
          div.textContent = m.content;
        }
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

newChatBtn.onclick = () => {
  const id = Date.now().toString();
  chats[id] = { title: "New Chat", messages: [] };
  currentChatId = id;
  saveChats();
  renderChats();
  renderMessages();
};

async function send() {
  const message = input.value.trim();
  if (!message) return;
  if (!currentChatId) { alert("Please start a new chat first!"); return; }
  if (isStreaming) return;

  isStreaming    = true;
  btn.disabled  = true;

  // 💥 MICRO-ANIMATION: send button burst
  if (typeof window.ccAnimSendBurst === "function") {
    window.ccAnimSendBurst();
  }

  addMessage("user", message);
  input.value = "";
  renderMessages();

  // Add thinking placeholder
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

      const msgs = chats[currentChatId].messages;
      msgs[msgs.length - 1].content = fullText;
      saveChats();
      renderMessages();
    }

    // Chat title update
    if (chats[currentChatId].title === "New Chat") {
      chats[currentChatId].title = message.slice(0, 25);
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
    isStreaming   = false;
    btn.disabled = false;
  }
}

btn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) send();
});

// ✅ Init
if (Object.keys(chats).length === 0) {
  newChatBtn.click();
} else {
  currentChatId = Object.keys(chats)[0];
  renderChats();
  renderMessages();
}
