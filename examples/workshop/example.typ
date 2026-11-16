// presio example: a workshop (touying) where viewers play with the HTML
// animations themselves, with their own controls. Sync sends everyone the
// presenter's time and state.
//
// Compile with: typst compile --root . examples/workshop/example.typ
#import "@preview/touying:0.7.4": *
#import themes.simple: *
#import "@preview/presio:0.3.0": media, speaker-notes

#show: simple-theme.with(aspect-ratio: "16-9")

#let shared = path("anim/shared.css")
#let explore(src, ..args) = media(src, width: 100%, aspect-ratio: 16 / 9, sync: "independent", ..args)

= Workshop: you drive

== Waves: superposition
#grid(columns: (2fr, 1fr), gutter: 1em,
  explore(path("anim/waves/index.html"), name: "waves.html", assets: (path("anim/waves/waves.js"), shared)),
  text(size: 18pt)[`sync: "independent"` — every viewer gets their own copy, its controls and the sliders.\ \ Ask the room: which frequencies make a *beat*?],
)
#speaker-notes[Viewers: hover the animation for play/pause/restart, drag the sliders. The presenter's copy is separate.]

== Bézier curves
#grid(columns: (2fr, 1fr), gutter: 1em,
  explore(path("anim/bezier/index.html"), name: "bezier.html", assets: (path("anim/bezier/bezier.js"), shared)),
  text(size: 18pt)[Drag the four control points. Pointer input reaches the page (`interactive: true`, the default).\ \ The page hands its points to `presio.sync`, so *Sync* sends yours to everyone.],
)

== Game of Life
#grid(columns: (2fr, 1fr), gutter: 1em,
  explore(path("anim/life/index.html"), name: "life.html", assets: (path("anim/life/life.js"), shared)),
  text(size: 18pt)[Click cells to add your own patterns. Pause to draw, play to watch them evolve.],
)
#speaker-notes[
  Draw a pattern, then press Sync on its controls: every viewer gets your board. Or switch it back to "viewers follow you" (the people icon): everyone snaps to your board and watches you draw.
]

== Look only, no touching
#grid(columns: (2fr, 1fr), gutter: 1em,
  explore(path("anim/fourier/index.html"), name: "fourier.html", assets: (path("anim/fourier/fourier.js"), shared), duration: 10, interactive: false),
  text(size: 18pt)[`interactive: false`: viewers get play / pause / scrubber, but clicks don't reach the page.],
)
