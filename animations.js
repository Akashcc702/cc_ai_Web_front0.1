// ===================================================
//  CC-AI — Background Animations + Cursor Trail
//  Cursor glow, floating particles, grid, trail
// ===================================================

(function () {

  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx    = bgCanvas.getContext('2d');
  const glow     = document.getElementById('cursor-glow');

  let W, H;
  let mouseX = -999, mouseY = -999;
  let frame  = 0;

  const bgParticles = [];
  const trailPoints = [];

  // ── Resize ──────────────────────────────────────
  function resize() {
    W = bgCanvas.width  = window.innerWidth;
    H = bgCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Mouse tracking ───────────────────────────────
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (glow) {
      glow.style.left = mouseX + 'px';
      glow.style.top  = mouseY + 'px';
    }
    trailPoints.push({ x: mouseX, y: mouseY, t: Date.now() });
    if (trailPoints.length > 55) trailPoints.shift();
  });

  document.addEventListener('mouseleave', () => { if(glow) glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { if(glow) glow.style.opacity = '1'; });

  // ── Background Particle ──────────────────────────
  class BgParticle {
    constructor(init) { this.reset(init); }
    reset(init) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.vy   = -(Math.random() * 0.5 + 0.15);
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.8 + 0.4;
      this.life = Math.random() * 0.6 + 0.2;
      this.maxLife = this.life;
      this.hue  = 220 + Math.random() * 100; // blue → purple
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.0015;
      if (this.y < -10 || this.life <= 0) this.reset(false);
    }
    draw() {
      const a = (this.life / this.maxLife) * 0.5;
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.fillStyle = `hsla(${this.hue},70%,75%,${a})`;
      bgCtx.fill();
    }
  }

  for (let i = 0; i < 90; i++) bgParticles.push(new BgParticle(true));

  // ── Cursor Trail ─────────────────────────────────
  function drawTrail() {
    const now = Date.now();
    for (let i = 1; i < trailPoints.length; i++) {
      const age   = (now - trailPoints[i].t) / 650;
      if (age > 1) continue;
      const alpha = (1 - age) * 0.4 * (i / trailPoints.length);
      const w     = (i / trailPoints.length) * 5;
      bgCtx.beginPath();
      bgCtx.moveTo(trailPoints[i-1].x, trailPoints[i-1].y);
      bgCtx.lineTo(trailPoints[i].x,   trailPoints[i].y);
      bgCtx.strokeStyle = `hsla(270,80%,75%,${alpha})`;
      bgCtx.lineWidth   = w;
      bgCtx.lineCap     = 'round';
      bgCtx.stroke();
    }
  }

  // ── Subtle tech grid ─────────────────────────────
  function drawGrid() {
    bgCtx.strokeStyle = 'rgba(100,80,220,0.04)';
    bgCtx.lineWidth   = 0.5;
    const gs = 55;
    for (let x = 0; x < W; x += gs) {
      bgCtx.beginPath(); bgCtx.moveTo(x, 0); bgCtx.lineTo(x, H); bgCtx.stroke();
    }
    for (let y = 0; y < H; y += gs) {
      bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(W, y); bgCtx.stroke();
    }
  }

  // ── Main background loop ─────────────────────────
  function bgLoop() {
    bgCtx.clearRect(0, 0, W, H);
    if (frame % 2 === 0) bgParticles.push(new BgParticle(false));
    if (bgParticles.length > 130) bgParticles.splice(0, bgParticles.length - 130);
    drawGrid();
    bgParticles.forEach(p => { p.update(); p.draw(); });
    drawTrail();
    frame++;
    requestAnimationFrame(bgLoop);
  }
  bgLoop();

  // ===================================================
  //  BURST PARTICLES — fired on message send / AI reply
  // ===================================================
  const burstCanvas = document.getElementById('burst-canvas');
  const burstCtx    = burstCanvas ? burstCanvas.getContext('2d') : null;
  let burstW = window.innerWidth, burstH = window.innerHeight;

  function resizeBurst() {
    burstW = burstCanvas.width  = window.innerWidth;
    burstH = burstCanvas.height = window.innerHeight;
  }
  if (burstCanvas) { resizeBurst(); window.addEventListener('resize', resizeBurst); }

  class BurstParticle {
    constructor(cx, cy, color) {
      const angle = Math.random() * Math.PI * 2;
      const spd   = Math.random() * 7 + 2;
      this.x  = cx; this.y  = cy;
      this.vx = Math.cos(angle) * spd;
      this.vy = Math.sin(angle) * spd - 2.5;
      this.life  = 1;
      this.decay = Math.random() * 0.022 + 0.016;
      this.size  = Math.random() * 4 + 1.5;
      this.color = color;
      this.gravity = 0.13;
      this.trail = [];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 6) this.trail.shift();
      this.vy += this.gravity;
      this.vx *= 0.97;
      this.x  += this.vx;
      this.y  += this.vy;
      this.life -= this.decay;
    }
    draw() {
      for (let i = 0; i < this.trail.length; i++) {
        const a = (i / this.trail.length) * this.life * 0.45;
        burstCtx.beginPath();
        burstCtx.arc(this.trail[i].x, this.trail[i].y, this.size * 0.5 * (i / this.trail.length), 0, Math.PI*2);
        burstCtx.fillStyle = this.color.replace('A', a.toFixed(2));
        burstCtx.fill();
      }
      burstCtx.beginPath();
      burstCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      burstCtx.fillStyle = this.color.replace('A', this.life.toFixed(2));
      burstCtx.fill();
    }
  }

  let burstParts = [];
  let burstRaf   = null;

  function burstLoop() {
    burstCtx.clearRect(0, 0, burstW, burstH);
    for (let i = burstParts.length - 1; i >= 0; i--) {
      burstParts[i].update();
      burstParts[i].draw();
      if (burstParts[i].life <= 0) burstParts.splice(i, 1);
    }
    if (burstParts.length > 0) burstRaf = requestAnimationFrame(burstLoop);
    else { burstCtx.clearRect(0, 0, burstW, burstH); burstRaf = null; }
  }

  // Public: call this to trigger send burst near the send button
  window.ccAnimSendBurst = function () {
    if (!burstCanvas || !burstCtx) return;
    const btn = document.getElementById('sendBtn');
    const rect = btn ? btn.getBoundingClientRect() : null;
    const cx = rect ? (rect.left + rect.width / 2) : burstW - 40;
    const cy = rect ? (rect.top  + rect.height / 2) : burstH - 40;

    const palette = [
      'hsla(260,90%,75%,A)', 'hsla(200,90%,75%,A)',
      'hsla(300,80%,75%,A)', 'hsla(50,95%,70%,A)',
      'hsla(180,85%,70%,A)'
    ];
    for (let i = 0; i < 40; i++) {
      burstParts.push(new BurstParticle(cx, cy,
        palette[Math.floor(Math.random() * palette.length)]));
    }
    if (!burstRaf) burstLoop();
  };

  // Public: flash the latest AI message card with glow
  window.ccAnimAIFlash = function () {
    // The flash CSS class is toggled in app.js
  };

})();
