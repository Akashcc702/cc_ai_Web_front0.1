// ===================================================
//  CC-AI — Onboarding Tour  (Starting Trip)
//  Guides new users through all features on first visit
// ===================================================
(function () {

  // ── Tour Steps — customised for CC-AI ─────────────
  const STEPS = [
    {
      target: '#app-header',
      emoji: '👋',
      title: 'Welcome to CC-AI!',
      desc: 'This is your AI-powered chat assistant. Let me take you on a quick tour so you know everything!',
      pos: 'bottom',
    },
    {
      target: '#newChat',
      emoji: '➕',
      title: 'Start a New Chat',
      desc: 'Click here to start a fresh conversation. Each chat is saved separately with its own history.',
      pos: 'bottom',
    },
    {
      target: '#chatList',
      emoji: '📂',
      title: 'Your Chat History',
      desc: 'All your previous conversations appear here. Click any chat to resume it anytime — they\'re saved locally!',
      pos: 'bottom',
    },
    {
      target: '#chat',
      emoji: '💬',
      title: 'Conversation Area',
      desc: 'Your messages appear here in green, and CC-AI replies in blue. Markdown formatting like **bold** and `code` is supported!',
      pos: 'bottom',
    },
    {
      target: '#msg',
      emoji: '⌨️',
      title: 'Type Your Message',
      desc: 'Type anything here — questions, code, creative writing, or analysis. Press Enter or click the send button!',
      pos: 'top',
    },
    {
      target: '#sendBtn',
      emoji: '🚀',
      title: 'Send & Watch the Magic',
      desc: 'Hit this to send your message. Watch the particle burst animation! CC-AI will stream its reply in real-time.',
      pos: 'top',
      last: true,
    },
  ];

  // ── State ──────────────────────────────────────────
  let stepIdx = 0;
  let backdrop, tooltip, pulse;

  // ── Wait for splash to be gone ─────────────────────
  function waitForSplashGone() {
    const check = setInterval(() => {
      const splash = document.getElementById('splash');
      if (!splash || splash.style.display === 'none' || splash.style.opacity === '0') {
        clearInterval(check);
        setTimeout(startTour, 700);
      }
    }, 200);
    // Fallback: just wait 4s
    setTimeout(() => { clearInterval(check); setTimeout(startTour, 500); }, 4500);
  }

  // ── Build DOM ──────────────────────────────────────
  function buildDOM() {
    backdrop = document.createElement('div');
    backdrop.id = 'tour-backdrop';
    backdrop.innerHTML = `<svg id="tour-svg" xmlns="http://www.w3.org/2000/svg"></svg>`;
    document.body.appendChild(backdrop);

    pulse = document.createElement('div');
    pulse.className = 'tour-pulse';
    document.body.appendChild(pulse);

    tooltip = document.createElement('div');
    tooltip.id = 'tour-tooltip';
    document.body.appendChild(tooltip);
  }

  // ── Backdrop hole around target ────────────────────
  function renderBackdrop(rect) {
    const W = window.innerWidth, H = window.innerHeight;
    const pad = 10;
    const x = Math.max(0, rect.left   - pad);
    const y = Math.max(0, rect.top    - pad);
    const w = Math.min(W, rect.width  + pad * 2);
    const h = Math.min(H, rect.height + pad * 2);
    const r = 12;

    const svg = document.getElementById('tour-svg');
    svg.setAttribute('width',  W);
    svg.setAttribute('height', H);
    svg.innerHTML = `
      <defs>
        <mask id="tour-mask">
          <rect width="100%" height="100%" fill="white"/>
          <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="black"/>
        </mask>
      </defs>
      <rect width="100%" height="100%"
            fill="rgba(0,0,0,0.72)"
            mask="url(#tour-mask)"/>
    `;

    pulse.style.cssText = `
      left: ${x}px; top: ${y}px;
      width: ${w}px; height: ${h}px;
      border-radius: ${r}px;
    `;
  }

  // ── Position tooltip ───────────────────────────────
  function positionTooltip(rect, pos) {
    const TW  = 285, gap = 18;
    const vpW = window.innerWidth, vpH = window.innerHeight;
    let top, left;

    if (pos === 'bottom') {
      top  = rect.bottom + gap;
      left = rect.left + rect.width / 2 - TW / 2;
    } else {
      top  = rect.top - gap - tooltip.offsetHeight;
      left = rect.left + rect.width / 2 - TW / 2;
    }

    left = Math.max(12, Math.min(left, vpW - TW - 12));
    top  = Math.max(12, Math.min(top,  vpH - 220));

    tooltip.style.left = left + 'px';
    tooltip.style.top  = top  + 'px';
  }

  // ── Render tooltip ─────────────────────────────────
  function renderTooltip(step) {
    const isLast = step.last;
    tooltip.innerHTML = `
      <div class="tour-step-badge">Step ${stepIdx + 1} of ${STEPS.length}</div>
      <span class="tour-emoji">${step.emoji}</span>
      <div class="tour-title">${step.title}</div>
      <div class="tour-desc">${step.desc}</div>
      <div class="tour-btn-row">
        <button class="tour-skip-btn" id="tour-skip">Skip tour</button>
        <button class="tour-next-btn" id="tour-next">
          ${isLast ? "🎉 Let's go!" : 'Next →'}
        </button>
      </div>
      <div class="tour-dots">
        ${STEPS.map((_, i) =>
          `<div class="tour-dot ${i === stepIdx ? 'active' : ''}"></div>`
        ).join('')}
      </div>
    `;
    document.getElementById('tour-next').onclick = isLast ? endTour : nextStep;
    document.getElementById('tour-skip').onclick = endTour;
  }

  // ── Show a step ────────────────────────────────────
  function showStep(idx) {
    const step = STEPS[idx];
    const el   = document.querySelector(step.target);
    if (!el) { nextStep(); return; }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      renderBackdrop(rect);
      renderTooltip(step);

      tooltip.style.top  = '-9999px';
      tooltip.style.left = '-9999px';
      requestAnimationFrame(() => positionTooltip(rect, step.pos));
    }, 320);
  }

  function nextStep() {
    stepIdx++;
    if (stepIdx >= STEPS.length) { endTour(); return; }
    showStep(stepIdx);
  }

  // ── Confetti burst on end ──────────────────────────
  function burstConfetti() {
    const colors = ['#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#fff','#a78bfa'];
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 60; i++) {
      const dot   = document.createElement('div');
      dot.className = 'tour-confetti-dot';
      const angle = Math.random() * Math.PI * 2;
      const dist  = 100 + Math.random() * 220;
      dot.style.cssText = `
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${cx}px; top: ${cy}px;
        --tx: ${Math.cos(angle) * dist}px;
        --ty: ${Math.sin(angle) * dist - 80}px;
        --dur: ${0.6 + Math.random() * 0.9}s;
      `;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 1600);
    }
  }

  // ── End tour ───────────────────────────────────────
  function endTour() {
    burstConfetti();
    if (backdrop) {
      backdrop.style.animation = 'tour-fade-in .35s ease reverse forwards';
      setTimeout(() => backdrop.remove(), 380);
    }
    if (tooltip) {
      tooltip.style.animation = 'tour-fade-in .35s ease reverse forwards';
      setTimeout(() => tooltip.remove(), 380);
    }
    if (pulse) {
      pulse.style.animation = 'tour-fade-in .35s ease reverse forwards';
      setTimeout(() => pulse.remove(), 380);
    }
    try { localStorage.setItem('cc_ai_tour_done', '1'); } catch(e) {}
  }

  // ── Start ──────────────────────────────────────────
  function startTour() {
    try {
      if (localStorage.getItem('cc_ai_tour_done') === '1') return;
    } catch(e) {}
    buildDOM();
    showStep(0);
  }

  waitForSplashGone();

})();
