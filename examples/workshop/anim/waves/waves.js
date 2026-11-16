const c = document.getElementById("c"), ctx = c.getContext("2d");
const inputs = ["f1", "f2", "a2", "v"].map((id) => document.getElementById(id));
let phase = 0, last;
function frame(now) {
  const dt = last === undefined ? 0 : (now - last) / 1000; last = now;
  const [f1, f2, a2, v] = inputs.map((i) => Number(i.value));
  for (const i of inputs) document.getElementById("o-" + i.id).textContent = Number(i.value).toFixed(2);
  phase += dt * v * Math.PI * 2;
  const w = (c.width = c.clientWidth * devicePixelRatio), h = (c.height = c.clientHeight * devicePixelRatio);
  ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, w, h);
  const mid = h * 0.58, amp = h * 0.16;
  const wave = (fn, color, width) => {
    ctx.strokeStyle = color; ctx.lineWidth = width * devicePixelRatio; ctx.beginPath();
    for (let x = 0; x <= w; x += 2) { const t = (x / w) * Math.PI * 4; const y = mid - fn(t) * amp; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  };
  wave((t) => Math.sin(f1 * t - phase), "rgba(56,189,248,.45)", 1.5);
  wave((t) => a2 * Math.sin(f2 * t - phase * 1.3), "rgba(244,114,182,.45)", 1.5);
  wave((t) => Math.sin(f1 * t - phase) + a2 * Math.sin(f2 * t - phase * 1.3), "#facc15", 3);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
