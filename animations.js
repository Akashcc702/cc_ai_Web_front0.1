// ═══════════════════════════════════════════════════
//  CC-AI — Cursor + Micro-animations + Burst
// ═══════════════════════════════════════════════════
(function () {

  // ── Custom Cursor ────────────────────────────────
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  });

  // Smooth ring lag
  function cursorLoop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  // Hover detection — all interactive elements
  function addHoverListeners() {
    document.querySelectorAll('button, a, .chat-item, .chip, input, textarea, [role="button"]')
      .forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
  }
  addHoverListeners();

  // Re-run when chat items are added
  const observer = new MutationObserver(addHoverListeners);
  observer.observe(document.body, { childList: true, subtree: true });

  // Click effect
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  // ── GSAP micro-interactions ──────────────────────
  if (typeof gsap !== 'undefined') {

    // Header logo perpetual spin (GSAP version for smoothness)
    gsap.to('.header-mark, .sidebar-logo', {
      rotation: 360, duration: 10,
      repeat: -1, ease: 'none'
    });

    // New chat button magnetic hover
    const newChatBtn = document.getElementById('newChat');
    if (newChatBtn) {
      newChatBtn.addEventListener('mousemove', e => {
        const r  = newChatBtn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top  + r.height / 2;
        gsap.to(newChatBtn, {
          x: (e.clientX - cx) * 0.2,
          y: (e.clientY - cy) * 0.2,
          duration: 0.3, ease: 'power2.out'
        });
      });
      newChatBtn.addEventListener('mouseleave', () => {
        gsap.to(newChatBtn, { x:0, y:0, duration:0.4, ease: 'elastic.out(1,0.5)' });
      });
    }
  }

  // ── Burst canvas ─────────────────────────────────
  const bc   = document.getElementById('burst-canvas');
  const bCtx = bc ? bc.getContext('2d') : null;
  let bW = window.innerWidth, bH = window.innerHeight;

  function resizeBurst() {
    bW = bc.width  = window.innerWidth;
    bH = bc.height = window.innerHeight;
  }
  if (bc) { resizeBurst(); window.addEventListener('resize', resizeBurst); }

  class BurstParticle {
    constructor(cx, cy, color) {
      const angle = Math.random() * Math.PI * 2;
      const spd   = Math.random() * 8 + 2;
      this.x = cx; this.y = cy;
      this.vx = Math.cos(angle) * spd;
      this.vy = Math.sin(angle) * spd - 3;
      this.life  = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.size  = Math.random() * 4 + 1;
      this.color = color;
      this.gravity = 0.15;
      this.trail = [];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 5) this.trail.shift();
      this.vy += this.gravity; this.vx *= 0.97;
      this.x += this.vx; this.y += this.vy;
      this.life -= this.decay;
    }
    draw() {
      this.trail.forEach((p, i) => {
        const a = (i / this.trail.length) * this.life * 0.4;
        bCtx.beginPath();
        bCtx.arc(p.x, p.y, this.size * 0.4 * (i / this.trail.length), 0, Math.PI*2);
        bCtx.fillStyle = this.color.replace('A', a.toFixed(2));
        bCtx.fill();
      });
      bCtx.beginPath();
      bCtx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      bCtx.fillStyle = this.color.replace('A', this.life.toFixed(2));
      bCtx.fill();
    }
  }

  let parts = [], rafId = null;

  function burstLoop() {
    bCtx.clearRect(0, 0, bW, bH);
    for (let i = parts.length - 1; i >= 0; i--) {
      parts[i].update(); parts[i].draw();
      if (parts[i].life <= 0) parts.splice(i, 1);
    }
    rafId = parts.length > 0 ? requestAnimationFrame(burstLoop) : null;
    if (!rafId) bCtx.clearRect(0, 0, bW, bH);
  }

  window.ccAnimSendBurst = function () {
    if (!bCtx) return;
    const btn = document.getElementById('sendBtn');
    const r   = btn ? btn.getBoundingClientRect() : null;
    const cx  = r ? r.left + r.width  / 2 : bW - 40;
    const cy  = r ? r.top  + r.height / 2 : bH - 40;
    const palette = [
      'hsla(260,90%,75%,A)', 'hsla(195,90%,60%,A)',
      'hsla(300,80%,75%,A)', 'hsla(50,95%,70%,A)', 'hsla(160,85%,60%,A)'
    ];
    for (let i = 0; i < 45; i++) {
      parts.push(new BurstParticle(cx, cy,
        palette[Math.floor(Math.random() * palette.length)]));
    }
    if (!rafId) burstLoop();
  };

  // Auto-add textarea resize behavior
  const textarea = document.getElementById('msg');
  if (textarea) {
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px';
    });
  }

})();
