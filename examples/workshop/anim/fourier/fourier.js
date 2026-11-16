// Draws a heart with a chain of rotating circles (a discrete Fourier
// transform of the outline). Purely a function of time, so it seeks exactly.
const PERIOD = 10; // seconds per full drawing
const N = 256, TERMS = 40;
const pts = [];
for (let i = 0; i < N; i++) {
  const t = (i / N) * Math.PI * 2;
  pts.push([16 * Math.sin(t) ** 3, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]);
}
const coeffs = [];
for (let k = -N / 2; k < N / 2; k++) {
  let re = 0, im = 0;
  for (let n = 0; n < N; n++) {
    const a = (-2 * Math.PI * k * n) / N;
    re += pts[n][0] * Math.cos(a) - pts[n][1] * Math.sin(a);
    im += pts[n][0] * Math.sin(a) + pts[n][1] * Math.cos(a);
  }
  coeffs.push({ k, re: re / N, im: im / N, amp: Math.hypot(re, im) / N });
}
coeffs.sort((a, b) => b.amp - a.amp);
const terms = coeffs.slice(0, TERMS);

const c = document.getElementById("c"), ctx = c.getContext("2d");
let start;
function frame(now) {
  if (start === undefined) start = now;
  const w = (c.width = c.clientWidth * devicePixelRatio), h = (c.height = c.clientHeight * devicePixelRatio);
  const s = Math.min(w, h) / 40, cx = w / 2, cy = h / 2 + s;
  const phase = (((now - start) / 1000) % PERIOD) / PERIOD;
  ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, w, h);
  // The traced part of the outline so far.
  ctx.strokeStyle = "#f43f5e"; ctx.lineWidth = 3 * devicePixelRatio; ctx.beginPath();
  const steps = Math.floor(phase * 400);
  for (let i = 0; i <= steps; i++) {
    const p = at(i / 400);
    i ? ctx.lineTo(cx + p[0] * s, cy + p[1] * s) : ctx.moveTo(cx + p[0] * s, cy + p[1] * s);
  }
  ctx.stroke();
  // The circles.
  let x = 0, y = 0;
  ctx.lineWidth = devicePixelRatio;
  for (const t of terms) {
    const a = 2 * Math.PI * t.k * phase;
    const nx = x + t.re * Math.cos(a) - t.im * Math.sin(a), ny = y + t.re * Math.sin(a) + t.im * Math.cos(a);
    ctx.strokeStyle = "rgba(148,163,184,.25)"; ctx.beginPath(); ctx.arc(cx + x * s, cy + y * s, t.amp * s, 0, 7); ctx.stroke();
    ctx.strokeStyle = "rgba(226,232,240,.7)"; ctx.beginPath(); ctx.moveTo(cx + x * s, cy + y * s); ctx.lineTo(cx + nx * s, cy + ny * s); ctx.stroke();
    x = nx; y = ny;
  }
  requestAnimationFrame(frame);
}
function at(phase) {
  let x = 0, y = 0;
  for (const t of terms) {
    const a = 2 * Math.PI * t.k * phase;
    x += t.re * Math.cos(a) - t.im * Math.sin(a); y += t.re * Math.sin(a) + t.im * Math.cos(a);
  }
  return [x, y];
}
requestAnimationFrame(frame);
