/* ============================================================
   CC-AI — UPGRADED STYLES
   Includes: base UI + cursor animations + tour + micro-anim
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: 'Poppins', system-ui, sans-serif;
  background: #0f172a;
  color: white;
  overflow: hidden;
}

/* ===================================================
   🌌 BACKGROUND CANVAS
   =================================================== */
#bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* ===================================================
   ✨ CURSOR GLOW
   =================================================== */
#cursor-glow {
  position: fixed;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 70%);
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  filter: blur(4px);
}

/* ===================================================
   🎬 SPLASH / VIDEO INTRO
   =================================================== */
#splash {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
  overflow: hidden;
}

#introVideo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: breathe 3s ease-in-out infinite, zoom 3s ease forwards;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent, #020617);
}

@keyframes breathe {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.03); }
  100% { transform: scale(1); }
}
@keyframes zoom {
  from { transform: scale(1); }
  to   { transform: scale(1.1); }
}

.fade-out { animation: fadeOut 1s forwards; }
@keyframes fadeOut {
  to { opacity: 0; visibility: hidden; }
}

/* ===================================================
   🗂️ APP LAYOUT
   =================================================== */
#app {
  display: flex;
  height: 100vh;
  position: relative;
  z-index: 10;
}

/* ===================================================
   📂 SIDEBAR
   =================================================== */
#sidebar {
  width: 260px;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 14px;
  border-right: 1px solid rgba(139,92,246,0.15);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

#newChat {
  width: 100%;
  padding: 11px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 15px rgba(37,99,235,0.3);
}
#newChat:hover  { opacity: 0.88; transform: scale(1.01); }
#newChat:active { transform: scale(0.97); }

.chat-item {
  padding: 10px 12px;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(139,92,246,0.08);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: rgba(200,200,220,0.85);
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chat-item:hover {
  background: rgba(37,99,235,0.2);
  border-color: rgba(139,92,246,0.3);
  transform: translateX(2px);
}
.chat-item.active {
  background: linear-gradient(135deg, rgba(37,99,235,0.5), rgba(79,70,229,0.4));
  border-color: rgba(139,92,246,0.5);
  color: white;
}

/* ===================================================
   💬 MAIN CHAT AREA
   =================================================== */
#main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

header {
  padding: 14px 20px;
  background: rgba(2, 6, 23, 0.8);
  border-bottom: 1px solid rgba(139,92,246,0.15);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
}

.header-logo {
  color: #8b5cf6;
  font-size: 20px;
  animation: spin-slow 8s linear infinite;
}
@keyframes spin-slow {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.header-tagline {
  font-size: 11px;
  font-weight: 400;
  color: rgba(139,92,246,0.7);
  letter-spacing: 1px;
  margin-left: auto;
  text-transform: uppercase;
}

#chat {
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(139,92,246,0.3) transparent;
}
#chat::-webkit-scrollbar { width: 5px; }
#chat::-webkit-scrollbar-track { background: transparent; }
#chat::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 3px; }

.msg {
  max-width: 75%;
  padding: 13px 16px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  animation: msgSlide 0.3s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes msgSlide {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.user {
  background: linear-gradient(135deg, #16a34a, #059669);
  align-self: flex-end;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 15px rgba(22,163,74,0.3);
}

.ai {
  background: rgba(30, 41, 59, 0.9);
  align-self: flex-start;
  border: 1px solid rgba(139,92,246,0.15);
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

/* AI message flash on arrival */
.ai.flash {
  animation: msgSlide 0.3s cubic-bezier(.34,1.56,.64,1) both,
             aiGlow 0.7s ease both;
}
@keyframes aiGlow {
  0%   { box-shadow: 0 0 0 0 rgba(139,92,246,0); border-color: rgba(139,92,246,0.15); }
  40%  { box-shadow: 0 0 25px 4px rgba(139,92,246,0.45); border-color: rgba(139,92,246,0.7); }
  100% { box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-color: rgba(139,92,246,0.15); }
}

/* Thinking dots animation */
.thinking-dots {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 2px 0;
}
.thinking-dots span {
  width: 7px;
  height: 7px;
  background: rgba(139,92,246,0.8);
  border-radius: 50%;
  animation: dot-bounce 1.2s infinite ease-in-out;
}
.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40%            { transform: translateY(-6px); opacity: 1; }
}

/* ===================================================
   ⌨️ INPUT AREA
   =================================================== */
#input-area {
  display: flex;
  padding: 14px 16px;
  background: rgba(2, 6, 23, 0.85);
  border-top: 1px solid rgba(139,92,246,0.15);
  gap: 10px;
}

#msg {
  flex: 1;
  padding: 12px 16px;
  border: 1.5px solid rgba(139,92,246,0.2);
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.8);
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
#msg:focus {
  border-color: rgba(139,92,246,0.55);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}
#msg::placeholder { color: rgba(148,163,184,0.5); }

#sendBtn {
  width: 46px;
  height: 46px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(79,70,229,0.4);
  position: relative;
  overflow: visible;
}
#sendBtn:hover  { opacity: 0.9; transform: scale(1.05); box-shadow: 0 6px 20px rgba(79,70,229,0.55); }
#sendBtn:active { transform: scale(0.95); }
#sendBtn:disabled { opacity: 0.4; transform: none; cursor: not-allowed; }

/* Send burst overlay */
#burst-canvas {
  position: fixed;
  pointer-events: none;
  z-index: 200;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* ===================================================
   🎯 ONBOARDING TOUR
   =================================================== */
#tour-backdrop {
  position: fixed;
  inset: 0;
  z-index: 5000;
  pointer-events: none;
}
#tour-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

#tour-tooltip {
  position: fixed;
  z-index: 5100;
  background: linear-gradient(160deg, #1a1060, #0f0b3a);
  border: 1.5px solid rgba(140,100,255,0.55);
  border-radius: 18px;
  padding: 18px 20px;
  max-width: 285px;
  width: calc(100vw - 40px);
  box-shadow: 0 8px 40px rgba(79,70,229,0.45);
  pointer-events: all;
  transition: top .35s cubic-bezier(.34,1.56,.64,1),
              left .35s cubic-bezier(.34,1.56,.64,1),
              opacity .25s ease;
  font-family: 'Poppins', sans-serif;
}

.tour-step-badge {
  display: inline-block;
  background: rgba(140,100,255,0.25);
  color: rgba(180,160,255,0.9);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 9px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.tour-emoji { font-size: 28px; margin-bottom: 6px; display: block; }

.tour-title {
  font-size: 15px; font-weight: 700;
  color: #fff; margin-bottom: 5px;
}

.tour-desc {
  font-size: 12.5px;
  color: rgba(200,190,255,0.8);
  line-height: 1.65; margin-bottom: 14px;
}

.tour-btn-row { display: flex; gap: 8px; align-items: center; }

.tour-next-btn {
  flex: 1;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff; border: none; border-radius: 10px;
  padding: 9px 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: opacity .2s, transform .15s;
}
.tour-next-btn:hover  { opacity: .88; transform: scale(1.02); }
.tour-next-btn:active { transform: scale(.97); }

.tour-skip-btn {
  background: none;
  border: 1.5px solid rgba(140,100,255,0.3);
  color: rgba(180,160,255,0.6);
  border-radius: 10px; padding: 9px 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 12px; cursor: pointer;
  transition: border-color .2s, color .2s;
}
.tour-skip-btn:hover { border-color: rgba(140,100,255,.7); color: rgba(200,180,255,.9); }

.tour-dots {
  display: flex; gap: 5px;
  align-items: center; justify-content: center;
  margin-top: 12px;
}
.tour-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(140,100,255,0.3);
  transition: background .3s, width .3s;
}
.tour-dot.active {
  background: rgba(140,100,255,1);
  width: 18px; border-radius: 3px;
}

.tour-pulse {
  position: fixed;
  border-radius: 10px;
  border: 2px solid rgba(140,100,255,0.85);
  pointer-events: none;
  z-index: 4999;
  animation: tour-pulse-anim 1.4s ease-out infinite;
}
@keyframes tour-pulse-anim {
  0%   { box-shadow: 0 0 0 0   rgba(140,100,255,.7); }
  70%  { box-shadow: 0 0 0 14px rgba(140,100,255,0); }
  100% { box-shadow: 0 0 0 0   rgba(140,100,255,0); }
}

#tour-backdrop { animation: tour-fade-in .4s ease both; }
#tour-tooltip  { animation: tour-fade-in .4s ease both; }
@keyframes tour-fade-in {
  from { opacity: 0; } to { opacity: 1; }
}

.tour-confetti-dot {
  position: fixed; width: 8px; height: 8px;
  border-radius: 2px; pointer-events: none; z-index: 6000;
  animation: confetti-fall var(--dur) ease-out forwards;
}
@keyframes confetti-fall {
  0%   { transform: translate(0,0) rotate(0deg);   opacity: 1; }
  100% { transform: translate(var(--tx),var(--ty)) rotate(720deg); opacity: 0; }
}

/* ===================================================
   📱 RESPONSIVE
   =================================================== */
@media (max-width: 640px) {
  #sidebar { width: 200px; }
  .header-tagline { display: none; }
}
@media (max-width: 480px) {
  #sidebar { display: none; }
}
