// de Casteljau's construction, animated along t; the control points can be
// dragged (pointer events reach the page when it's interactive).
(function () {
  var P = [[120, 360], [220, 80], [580, 80], [680, 360]];
  var svg = document.getElementById("s"), NS = "http://www.w3.org/2000/svg";
  var pts = document.getElementById("pts"), lerp = document.getElementById("lerp");
  var handles = P.map(function (p, i) {
    var c = document.createElementNS(NS, "circle");
    c.setAttribute("r", 13); c.setAttribute("class", "pt"); c.setAttribute("fill", i === 0 || i === 3 ? "#f43f5e" : "#a78bfa");
    pts.appendChild(c);
    c.addEventListener("pointerdown", function (e) { c.setPointerCapture(e.pointerId); drag = i; });
    return c;
  });
  var drag = -1;
  svg.addEventListener("pointermove", function (e) {
    if (drag < 0) return;
    var m = svg.getScreenCTM().inverse(), q = svg.createSVGPoint(); q.x = e.clientX; q.y = e.clientY; q = q.matrixTransform(m);
    P[drag] = [Math.max(10, Math.min(790, q.x)), Math.max(10, Math.min(440, q.y))];
  });
  svg.addEventListener("pointerup", function () { drag = -1; });
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function line(a, b, color) {
    var l = document.createElementNS(NS, "line");
    l.setAttribute("x1", a[0]); l.setAttribute("y1", a[1]); l.setAttribute("x2", b[0]); l.setAttribute("y2", b[1]);
    l.setAttribute("stroke", color); l.setAttribute("stroke-width", 2); lerp.appendChild(l);
  }
  function frame(now) {
    var t = (Math.sin(now / 1600) + 1) / 2;
    handles.forEach(function (c, i) { c.setAttribute("cx", P[i][0]); c.setAttribute("cy", P[i][1]); });
    document.getElementById("hull").setAttribute("d", "M" + P.map(function (p) { return p.join(" "); }).join(" L"));
    document.getElementById("curve").setAttribute("d", "M" + P[0].join(" ") + " C" + P.slice(1).map(function (p) { return p.join(" "); }).join(" "));
    lerp.textContent = "";
    var a = mix(P[0], P[1], t), b = mix(P[1], P[2], t), c = mix(P[2], P[3], t), d = mix(a, b, t), e = mix(b, c, t), f = mix(d, e, t);
    line(a, b, "#64748b"); line(b, c, "#64748b"); line(d, e, "#22c55e");
    var dot = document.getElementById("dot"); dot.setAttribute("cx", f[0]); dot.setAttribute("cy", f[1]);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  // In Presio, viewers following the presenter (and the presenter's "Sync")
  // get the points where the presenter dragged them.
  if (window.presio) presio.sync({
    get: function () { return { points: P }; },
    set: function (s) { if (s && Array.isArray(s.points) && s.points.length === 4) P = s.points; },
  });
})();
