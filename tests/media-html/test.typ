// HTML animations: a path to an .html file is kind "html", its assets are
// made relative to the page, and the base64 the HTML export bundles binary
// assets with is right.
#import "/src/lib.typ": media, _assets, _b64, _relative, _html-srcdoc
#import "/tests/_sidecar.typ": check

#set page(width: 400pt, height: 240pt, margin: 20pt)

#media(path("anim/index.html"), assets: (path("anim/js/app.js"), path("anim/sprite.gif")), width: 200pt, aspect-ratio: 2)
#pagebreak()
#media(path("anim/index.html"), name: "two.html", sync: "independent", controls: false, interactive: false, duration: 4, width: 100pt)

#context {
  check("index_html", kind: "html", mime: "text/html", w: 200pt, h: 100pt)
  check("two_html", page: 2, kind: "html", mime: "text/html")
}

// Assets: relative to the page's folder, or as given in a dictionary.
#let rels = _assets(path("anim/index.html"), (path("anim/js/app.js"), path("anim/sprite.gif"))).map(a => a.rel)
#assert.eq(rels, ("js/app.js", "sprite.gif"))
#assert.eq(_assets(path("anim/index.html"), ("lib/app.js": path("anim/js/app.js"))).map(a => a.rel), ("lib/app.js",))
#assert.eq(_relative("/a/b/index.html", "/a/c/x.js"), "../c/x.js")
#assert.eq(_relative("/index.html", "/x/y.css"), "x/y.css")

#assert.eq(_b64(bytes("Man")), "TWFu")
#assert.eq(_b64(bytes("Ma")), "TWE=")
#assert.eq(_b64(bytes("M")), "TQ==")
#assert.eq(_b64(bytes("")), "")

// The frame document carries the bundle (with "<" escaped) and the runtime.
#let doc = _html-srcdoc(path("anim/index.html"), _assets(path("anim/index.html"), (path("anim/js/app.js"),)), (autoplay: true))
#assert(doc.contains("id=\"presio-bundle\""))
#assert(not doc.slice(0, doc.position("</script>")).contains("<!doctype html><script"))
#assert(doc.contains("\\u003cscript src=\\\"js/app.js\\\""))
#assert(doc.contains("Presio HTML animation runtime"))

