import { planets } from "./planets.js";

const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
const speed = document.getElementById("speed");
let angle = 0;
let last;

function resize() {
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
}
addEventListener("resize", resize);
resize();

function frame(now) {
  const dt = last === undefined ? 0 : (now - last) / 1000;
  last = now;
  angle += dt * Number(speed.value);
  const { width: w, height: h } = canvas;
  const s = Math.min(w, h) / 2.4;
  ctx.fillStyle = "#0b1020";
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w / 2, h / 2 + s * 0.1);
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2);
  ctx.fill();
  for (const p of planets) {
    const r = p.orbit * s;
    ctx.strokeStyle = "rgba(255,255,255,.15)";
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    const a = angle * p.speed;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, p.size * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
