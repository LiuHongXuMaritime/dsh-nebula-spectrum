# Nebula Spectrum theme

A theme for the DeepSeek Harness Web UI, ported from the PI-Desktop plugin
"Nebula Spectrum" (`local.nebula-spectrum` 0.9.0) so that both applications
share one look: an aurora canvas, a glass sidebar, a spectrum-rimmed composer
and a gradient send button.

## Editions

Eight editions, four dark and four light, matching the PI plugin one for one.

| Edition | Look | Built for |
| --- | --- | --- |
| 光谱·青蓝 · Indigo | Midnight blue-green panes over an aurora of amber, rose, cyan, teal, indigo and lime | Dark appearance |
| 光谱·余烬 · Ember | Warm ash and ember over a black canvas | Dark appearance |
| 光谱·朱红 · Crimson | Red-black glass with an orange-to-magenta spectrum | Dark appearance |
| 光谱·霓虹 · Neon | Cyan and violet neon on near-black | Dark appearance |
| 光谱·彩虹 · Rainbow | Warm white panes on a pastel spectrum wash, magenta accent | Light appearance |
| 光谱·暖阳 · Sunrise | Cream panes under amber and rose light | Light appearance |
| 光谱·冰蓝 · Glacier | Cool white panes with an ice-blue accent | Light appearance |
| 光谱·玫瑰 · Rose | Porcelain panes with a rose accent | Light appearance |

"Follow appearance" picks Indigo on a dark appearance and Rainbow on a light one.

Pick an edition in **Settings → General → Nebula Spectrum**. The choice is kept
in `localStorage`, and it never rewrites the preference the built-in appearance
row owns.

## How it is built

DSH applies its theme tokens as inline styles on `<body>`, and the public theme
API only accepts fourteen aliases as `{ light, dark }` pairs. That is not enough
surface for a full skin, so this plugin does not register a DSH theme at all.
Instead it injects one stylesheet that:

1. re-points the whole `--dsw-*` vocabulary — surfaces, ink, borders, states,
   controls, markdown and the sidebar pieces — in a rule scoped to
   `html[data-nebula-edition="…"] body`, with every declaration armed as
   `!important` so it outranks the inline token writes;
2. styles the handful of elements that paint themselves directly: the window
   frame and its Windows drag strip, the two columns, the composer card and its
   spectrum rim, the send button, the user bubble and the code-block banner;
3. adds one frame-wide 2px spectrum hairline in the overlay layer, which is what
   `shell.overlay` exists for.

Surfaces are matched by CSS module class *suffixes* where one is unambiguous
(`[class$="_sidebarCol"]`, `[class$="_centerCol"]`, `[class$="_composerSeat"]`),
by the exact readable half where the host ships something stable
(`[class*="GRgSLq_card"]`, `[class*="wtg9ga_root"]`), by attributes the host
already renders (`div:has(> [data-shell-overlay])` for the frame,
`[data-code-block-banner]` for the code-block header) and never by a build hash.
A rebuild of the host keeps the theme attached. If a future release renames one
of those hooks, the palette stays intact and only that surface falls back to its
stock look.

## Syncing with a PI release

The two editions the PI plugin started with (Indigo and Rainbow) are mapped by
hand in `src/skin.css`; the other six are derived from the PI CSS by a script,
which is what keeps a new PI palette one command away:

```sh
node scripts/sync-pi.mjs "path/to/local.nebula-spectrum-0.9.0.piplug"
```

It reads `manifest.json` for ids, bases and labels, parses each `theme/*.css`
for its token block and its surface rules, then rewrites

- `src/editions.generated.css` — one block per generated edition, and
- `src/editions.json` — the id, both labels, the base scheme and a preview
  swatch for every edition, curated ones included.

`node build.js` then concatenates the generated blocks at the `@@GENERATED@@`
marker and inlines both files into `client.js`. The colour scheme of each
edition is expressed as `data-nebula-scheme` on `<html>`, so a dark edition
forces dark native controls even when the host appearance is light.

## The window caption buttons

The minimise / maximise / close buttons on Windows are drawn by Electron, not by
the page, so no stylesheet can reach them. The desktop app does expose a bridge
though: its preload samples `--dsw-specific-sidebar-fill` (band) and
`--dsw-alias-label-primary` (glyph ink) from a hidden probe, and re-sends both to
the main process whenever `document.body`'s `style` attribute or `document.head`
mutates. The plugin therefore

1. keeps `--dsw-specific-sidebar-fill` **opaque** and
2. mounts its stylesheet into `document.head`, then writes a private
   `--dsh-nebula-caption` property onto `document.body.style` on every edition
   change,

which is what makes `mainWindow.setTitleBarOverlay({ color, symbolColor })` run
with the edition's colours. The drag strip behind those buttons uses the same
opaque colour (`--nb-titlebar`), so the OS band and the app's own bar read as one
piece.

The bridge only exists in the desktop app; in a plain browser the caption
buttons are the browser's own and stay untouched.

## Notes

- Every edition declares whether it is dark or light, and forces the document
  colour scheme to match, so the palette reads correctly even when the built-in
  appearance row is set the other way. Mixed pairings can still leave a host
  hairline slightly off; matching the row to the edition is the cosmetic fix.
- The edition and scheme attributes live on `<html>` and are removed when the
  plugin unmounts, so disabling the plugin restores the stock appearance
  immediately.
- The stylesheet is mounted into `<head>` by the plugin and removed again on
  unmount; nothing is written to disk and no host file is patched.
- `build.js` produces `client.js` from `src/client.template.js`, `src/skin.css`,
  `src/editions.generated.css` and `src/editions.json`. Edit the sources, then
  run `node build.js`.
