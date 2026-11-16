// Conway's Game of Life, a generation every 120 ms (setInterval — on the
// clock, so pause holds it). Starts from a Gosper glider gun. Click to
// toggle cells.
(function () {
  var W = 64, H = 36, grid = new Uint8Array(W * H), gen = 0;
  var gun = [[24,0],[22,1],[24,1],[12,2],[13,2],[20,2],[21,2],[34,2],[35,2],[11,3],[15,3],[20,3],[21,3],[34,3],[35,3],[0,4],[1,4],[10,4],[16,4],[20,4],[21,4],[0,5],[1,5],[10,5],[14,5],[16,5],[17,5],[22,5],[24,5],[10,6],[16,6],[24,6],[11,7],[15,7],[12,8],[13,8]];
  gun.forEach(function (p) { grid[(p[1] + 3) * W + p[0] + 2] = 1; });
  var c = document.getElementById("c"), ctx = c.getContext("2d"), label = document.getElementById("gen");
  function step() {
    var next = new Uint8Array(W * H);
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var n = 0;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        if (dx || dy) { var xx = x + dx, yy = y + dy; if (xx >= 0 && xx < W && yy >= 0 && yy < H) n += grid[yy * W + xx]; }
      }
      var alive = grid[y * W + x];
      next[y * W + x] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
    }
    grid = next; gen++;
  }
  function draw() {
    var w = (c.width = c.clientWidth * devicePixelRatio), h = (c.height = c.clientHeight * devicePixelRatio);
    var s = Math.min(w / W, h / H), ox = (w - s * W) / 2, oy = (h - s * H) / 2;
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#4ade80";
    for (var i = 0; i < W * H; i++) if (grid[i]) ctx.fillRect(ox + (i % W) * s + 1, oy + Math.floor(i / W) * s + 1, s - 2, s - 2);
    label.textContent = "generation " + gen;
    return { s: s / devicePixelRatio, ox: ox / devicePixelRatio, oy: oy / devicePixelRatio };
  }
  var geo = draw();
  setInterval(function () { step(); geo = draw(); }, 120);
  c.addEventListener("pointerdown", function (e) {
    var x = Math.floor((e.offsetX - geo.ox) / geo.s), y = Math.floor((e.offsetY - geo.oy) / geo.s);
    if (x >= 0 && x < W && y >= 0 && y < H) { grid[y * W + x] ^= 1; geo = draw(); }
  });
  // In Presio: the presenter's board, for viewers following (and "Sync").
  if (window.presio) presio.sync({
    get: function () { return { gen: gen, cells: Array.prototype.join.call(grid, "") }; },
    set: function (s) {
      if (!s || typeof s.cells !== "string" || s.cells.length !== W * H) return;
      for (var i = 0; i < W * H; i++) grid[i] = s.cells.charCodeAt(i) === 49 ? 1 : 0;
      gen = s.gen | 0; geo = draw();
    },
  });
})();
