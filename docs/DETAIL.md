# Nebula Spectrum theme

A theme for the DeepSeek Harness Web UI, ported from the PI-Desktop plugin
"Nebula Spectrum" (`local.nebula-spectrum` 0.6.0) so that both applications
share one look: a deep aurora canvas, a glass sidebar, a spectrum-rimmed
composer and a gradient send button.

## Editions

| Edition | Look | Built for |
| --- | --- | --- |
| Deep ocean | Midnight blue-green panes over an aurora of amber, rose, cyan, teal, indigo and lime | Dark appearance |
| Onyx | The same spectrum pressed down to near-black | Dark appearance, OLED-friendly |
| Light | Warm white panes on a pastel spectrum wash, magenta accent | Light appearance |
| Follow appearance | Deep ocean on a dark appearance, Light on a light one | Default |

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

- Deep ocean and Onyx are dark editions; they force the document colour scheme
  to dark, so they look best when the built-in appearance row is also set to
  dark. Light is meant for the light appearance. "Follow appearance" keeps the
  two in step automatically.
- The palette is complete enough to survive the light / dark branch of the host
  styles, but a few host rules hard-code a hairline for one scheme. If a border
  looks slightly off in a mixed pairing, matching the appearance row to the
  edition is the fix.
- The edition attribute lives on `<html>` and is removed when the plugin
  unmounts, so disabling the plugin restores the stock appearance immediately.
- The stylesheet is mounted into `<head>` by the plugin and removed again on
  unmount, so disabling the plugin restores the stock appearance and the stock
  caption buttons; nothing is written to disk and no host file is patched.
- `build.js` produces `client.js` from `src/client.template.js` and
  `src/skin.css`. Edit those, then run `node build.js`.
