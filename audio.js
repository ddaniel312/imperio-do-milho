"use strict";
const FX = (() => {
  let ctx = null, muted = localStorage.getItem("imperio-mute") === "1";
  const ac = () => {
    if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  function tone(f, t0, d, type = "sine", vol = 0.12, slide) {
    if (muted) return;
    const c = ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.03);
  }
  function seq(notes, step, type, vol, dur) {
    notes.forEach((n, i) => tone(n, i * step, dur || step * 1.6, type, vol));
  }
  let lastClick = 0;
  return {
    isMuted: () => muted,
    setMuted(m) { muted = m; localStorage.setItem("imperio-mute", m ? "1" : "0"); if (!m) ac(); },
    click() {
      const n = performance.now(); if (n - lastClick < 40) return; lastClick = n;
      tone(420 + Math.random() * 160, 0, 0.09, "triangle", 0.12, 900);
    },
    buy() { tone(523, 0, 0.1, "square", 0.06); tone(784, 0.08, 0.16, "square", 0.06); },
    upgrade() { seq([523, 659, 784, 1047], 0.07, "triangle", 0.1); },
    deny() { tone(160, 0, 0.15, "square", 0.06, 110); },
    coin() { tone(988, 0, 0.1, "square", 0.07); tone(1319, 0.08, 0.25, "square", 0.07); },
    bad() { tone(200, 0, 0.45, "sawtooth", 0.09, 80); tone(150, 0.2, 0.45, "sawtooth", 0.08, 70); },
    good() { seq([440, 554, 659, 880], 0.09, "sine", 0.12); },
    ach() { seq([784, 988, 1175, 1568], 0.1, "triangle", 0.12, 0.25); },
    level() { seq([392, 523, 659, 784, 1047], 0.12, "triangle", 0.13, 0.3); },
    unlock() { seq([523, 659, 784, 1047, 1319, 1568], 0.1, "triangle", 0.13, 0.35); tone(2093, 0.65, 0.5, "sine", 0.06); },
    prestige() { tone(220, 0, 1.2, "sawtooth", 0.05, 880); seq([523, 659, 784, 1047, 1319], 0.13, "triangle", 0.12, 0.4); },
  };
})();
