// presio example: HTML animations.
//
// Compile with: typst compile --root . examples/html-animation/example.typ
// Or as a web page: typst compile --root . --features html --format html examples/html-animation/example.typ
#import "@preview/presio:0.3.0": media, speaker-notes

#set page(width: 960pt, height: 540pt, margin: 40pt)
#set text(size: 20pt)

= HTML animations

A canvas animation with its scripts and stylesheet. Viewers follow you; switch
it to "viewers control it" from its controls when presenting.

// No `align` around media meant for HTML export too: Typst's HTML export
// leaves out whatever `align` wraps.
#media(
  path("orbit/index.html"),
  name: "orbit.html",
  assets: (path("orbit/js/main.js"), path("orbit/js/planets.js"), path("orbit/css/style.css")),
  width: 70%,
  aspect-ratio: 16 / 9,
)

#speaker-notes[Drag the speed slider in the animation: it's interactive.]

#pagebreak()

= Each viewer plays it themselves

#media(
  path("bars.html"),
  sync: "independent",
  width: 70%,
  aspect-ratio: 16 / 9,
)
