window.__ModuleLoader__.load({
  id: "@local/dsh-nebula-spectrum",
  factory: function (require) {
    "use strict";

    var module = { exports: {} };
    var exports = module.exports;
    var react = require("react");
    var h = react.createElement;

    var NS = "nebula-spectrum";
    var SKIN_CSS = "/* ==========================================================================\n   Nebula Spectrum for DeepSeek Harness\n   Ported from the PI-Desktop plugin \"Nebula Spectrum\" (local.nebula-spectrum\n   0.6.0): deep-ocean, onyx and light editions that keep the full spectrum at\n   the window edges.\n\n   Two rules of engagement, because the host owns its own skin:\n   1. Every palette value is written as a custom-property declaration, and\n      `build.js` arms each one with `!important` on the way into `client.js`.\n      That is mandatory: the host applies its theme tokens as inline styles on\n      <body>, so only an important author declaration can outrank them.\n   2. Surfaces are addressed through stable hooks only: theme tokens, the\n      readable half of the host's CSS module classes (`[class$=\"_sidebarCol\"]`,\n      pinned exactly where a suffix is shared), the attribute hooks the host\n      already ships (`[data-code-block-banner]`) and one frame-wide overlay of\n      our own. Nothing here depends on a build hash alone.\n   ========================================================================== */\n\n/* ---------- shared scaffolding ---------- */\n\nhtml[data-nebula-edition] { color-scheme: dark; }\nhtml[data-nebula-edition=\"light\"] { color-scheme: light !important; }\nhtml[data-nebula-edition=\"nebula\"],\nhtml[data-nebula-edition=\"onyx\"] { color-scheme: dark !important; }\n\n/* The aurora canvas: one fixed painting behind every panel, exactly like the\n   PI theme's `.app-shell` background. Panels above it are translucent. */\nhtml[data-nebula-edition] body {\n  background-color: var(--nb-canvas) !important;\n  background-image: var(--nb-aurora) !important;\n  background-repeat: no-repeat !important;\n  background-attachment: fixed !important;\n  background-size: cover !important;\n}\n\n/* Host classes are CSS-module names of the form `hash_readable`: the hash moves\n   on a rebuild, the readable half does not. Each surface therefore gets two\n   anchors — the exact class this build uses, and a hash-free fallback kept\n   narrow, because several suffixes are not unique in the host (`_frame` is\n   shared by nine panels, `_card` by forty, `_primary` by six). */\n\n/* The window frame becomes a window: the aurora shows through it, and the\n   columns paint their own glass on top. The shell's overlay layer is a direct\n   child of the frame, which makes `:has(> [data-shell-overlay])` a hash-free\n   way to name the frame. */\nhtml[data-nebula-edition] [class*=\"mP3x-q_frame\"],\nhtml[data-nebula-edition] div:has(> [data-shell-overlay]) {\n  background: transparent !important;\n}\n\n/* The Windows drag strip is the frame's ::before; the host only creates it on\n   Windows, so styling it unconditionally is safe. It is deliberately OPAQUE and\n   equal to `--dsw-specific-sidebar-fill`: the desktop preload paints the native\n   caption buttons (minimise / maximise / close) with exactly that colour and\n   with `--dsw-alias-label-primary` as the glyph ink, so the OS-drawn control\n   band and this strip merge into one bar. */\nhtml[data-nebula-edition] [class*=\"mP3x-q_frame\"]::before,\nhtml[data-nebula-edition] div:has(> [data-shell-overlay])::before {\n  background: var(--nb-titlebar) !important;\n  box-shadow: 0 1px 0 var(--nb-titlebar-line) !important;\n}\n\n/* The sidebar's scroll fade would otherwise end in the opaque caption colour;\n   fade into the glass tint instead. */\nhtml[data-nebula-edition] [class*=\"wtg9ga_scrollFade\"] {\n  background: linear-gradient(to bottom, transparent, var(--nb-side-tint)) !important;\n}\n\n/* Sidebar column: tinted glass, three colour lobes and a hairline seam. */\nhtml[data-nebula-edition] [class$=\"_sidebarCol\"] {\n  background-color: var(--nb-side-tint) !important;\n  background-image: var(--nb-side-glow) !important;\n  background-repeat: no-repeat !important;\n  border-right: 1px solid var(--nb-side-hairline) !important;\n  -webkit-backdrop-filter: blur(24px) saturate(160%);\n  backdrop-filter: blur(24px) saturate(160%);\n}\n/* The sidebar's own root is one of forty `_root` classes, so it is matched as\n   the column's child rather than by suffix alone. */\nhtml[data-nebula-edition] [class*=\"wtg9ga_root\"],\nhtml[data-nebula-edition] [class$=\"_sidebarCol\"] > [class$=\"_root\"] {\n  background: transparent !important;\n}\n\n/* The conversation sheet: a solid pane with a wash of light along its top\n   edge, and the host's own conversation root left transparent above it. */\nhtml[data-nebula-edition] [class$=\"_centerCol\"],\nhtml[data-nebula-edition] [class$=\"_mainPanel\"] {\n  background-color: var(--nb-sheet) !important;\n  background-image: var(--nb-sheet-wash) !important;\n  background-repeat: no-repeat !important;\n}\nhtml[data-nebula-edition] [class$=\"_root\"]:has([class$=\"_composerSeat\"]) {\n  background-color: transparent !important;\n}\n\n/* Composer card: the theme's signature. A near-opaque pane inside a one-pixel\n   spectrum rim, drawn with the two-layer padding-box / border-box trick. The\n   composer stack is unique, which is what makes the `_card` fallback safe. */\nhtml[data-nebula-edition] [class*=\"GRgSLq_card\"],\nhtml[data-nebula-edition] [class$=\"_composerStack\"] [class$=\"_card\"] {\n  border: 1px solid transparent !important;\n  background-color: transparent !important;\n  background-image: var(--nb-card-fill), var(--nb-card-rim) !important;\n  background-origin: padding-box, border-box !important;\n  background-clip: padding-box, border-box !important;\n  box-shadow: var(--nb-card-shadow) !important;\n}\nhtml[data-nebula-edition] [class*=\"GRgSLq_card\"]:focus-within,\nhtml[data-nebula-edition] [class$=\"_composerStack\"] [class$=\"_card\"]:focus-within {\n  background-image: var(--nb-card-fill-focus), var(--nb-card-rim-focus) !important;\n  box-shadow: var(--nb-card-shadow-focus) !important;\n}\n\n/* Send button: the full spectrum, dark ink, a soft coloured halo. */\nhtml[data-nebula-edition] [class*=\"GRgSLq_primary\"],\nhtml[data-nebula-edition] [class$=\"_composerStack\"] [class$=\"_primary\"] {\n  background-color: transparent !important;\n  background-image: var(--nb-send) !important;\n  color: var(--nb-send-ink) !important;\n  box-shadow: var(--nb-send-shadow) !important;\n}\nhtml[data-nebula-edition] [class*=\"GRgSLq_primary\"]:hover:not(:disabled),\nhtml[data-nebula-edition] [class$=\"_composerStack\"] [class$=\"_primary\"]:hover:not(:disabled) {\n  box-shadow: var(--nb-send-shadow-hover) !important;\n  filter: brightness(1.06) saturate(112%);\n}\n\n/* The user's own turn: a raised, rim-lit block rather than a flat fill. */\nhtml[data-nebula-edition] [class*=\"_bubble_\"]:not([class*=\"gm1ra\"]) {\n  background-color: var(--nb-bubble) !important;\n  color: var(--nb-bubble-ink) !important;\n  box-shadow: var(--nb-bubble-shadow) !important;\n}\n\n/* Code blocks: a deep well with a spectrum band across its header. */\nhtml[data-nebula-edition] .md-code-block {\n  background-color: var(--nb-code-bg) !important;\n  box-shadow: var(--nb-code-shadow) !important;\n}\nhtml[data-nebula-edition] .md-code-block [data-code-block-banner] {\n  background-color: transparent !important;\n  background-image: var(--nb-code-band) !important;\n}\n\n/* Text selection takes the accent, as in the source theme. */\nhtml[data-nebula-edition] ::selection {\n  background-color: var(--nb-select-bg) !important;\n  color: var(--nb-select-ink) !important;\n}\n\n/* The frame-wide 2px hairline the source theme hangs off `.app-shell::before`. */\nhtml[data-nebula-edition] [data-nebula-edge] {\n  position: fixed;\n  inset: 0 0 auto 0;\n  height: 2px;\n  z-index: 2147483000;\n  pointer-events: none;\n  background-image: var(--nb-edge);\n  opacity: var(--nb-edge-opacity, 0.7);\n}\n\n/* ---------- editions ---------- */\n/* ---------- edition: nebula (deep ocean) ----------\n   Neutral ramps are re-pointed as well as the aliases, because a handful of\n   components read `--dsw-static-*` directly for icon tints and hairlines. */\n\nhtml[data-nebula-edition=\"nebula\"] body {\n  --nb-canvas: #071320 !important;\n  --nb-aurora: \n    radial-gradient(1200px 680px at 4% -12%, rgba(251, 146, 60, 0.30), transparent 64%),\n    radial-gradient(980px 560px at 98% -8%, rgba(236, 72, 153, 0.28), transparent 66%),\n    radial-gradient(900px 600px at 88% 112%, rgba(34, 211, 238, 0.30), transparent 68%),\n    radial-gradient(760px 460px at 10% 114%, rgba(45, 212, 191, 0.24), transparent 70%),\n    radial-gradient(1000px 620px at 48% 46%, rgba(99, 102, 241, 0.22), transparent 72%),\n    radial-gradient(700px 420px at 62% 106%, rgba(163, 230, 53, 0.12), transparent 74%) !important;\n  --nb-side-tint: rgba(9, 21, 31, 0.66) !important;\n  --nb-side-glow: \n    radial-gradient(460px 300px at 0% 0%, rgba(236, 72, 153, 0.26), transparent 66%),\n    radial-gradient(420px 300px at 100% 46%, rgba(251, 191, 36, 0.18), transparent 70%),\n    radial-gradient(440px 340px at 60% 104%, rgba(45, 212, 191, 0.24), transparent 70%),\n    linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 240px) !important;\n  --nb-side-hairline: rgba(236, 72, 153, 0.16) !important;\n  --nb-titlebar: #0a1620 !important;\n  --nb-titlebar-line: rgba(56, 189, 248, 0.14) !important;\n  --nb-sheet: #0a171f !important;\n  --nb-sheet-wash: \n    radial-gradient(1100px 340px at 50% -18%, rgba(251, 146, 60, 0.13), transparent 70%),\n    radial-gradient(820px 300px at 100% -10%, rgba(236, 72, 153, 0.12), transparent 72%),\n    radial-gradient(820px 300px at 0% -10%, rgba(59, 130, 246, 0.12), transparent 72%),\n    radial-gradient(900px 320px at 82% 112%, rgba(45, 212, 191, 0.10), transparent 74%) !important;\n  --nb-card-fill: linear-gradient(152deg, rgba(18, 38, 50, 0.95), rgba(8, 20, 30, 0.97)) !important;\n  --nb-card-rim: linear-gradient(135deg, rgba(245, 158, 11, 0.80), rgba(244, 63, 94, 0.75) 24%, rgba(219, 39, 119, 0.75) 44%, rgba(99, 102, 241, 0.70) 66%, rgba(6, 182, 212, 0.85)) !important;\n  --nb-card-fill-focus: linear-gradient(152deg, rgba(20, 44, 58, 0.96), rgba(9, 23, 34, 0.97)) !important;\n  --nb-card-rim-focus: linear-gradient(135deg, rgba(217, 119, 6, 0.95), rgba(225, 29, 72, 0.90) 24%, rgba(219, 39, 119, 0.90) 44%, rgba(79, 70, 229, 0.90) 66%, rgba(8, 145, 178, 0.95)) !important;\n  --nb-card-shadow: 0 12px 34px rgba(0, 8, 14, 0.60), 0 0 26px rgba(6, 182, 212, 0.22) !important;\n  --nb-card-shadow-focus: 0 14px 40px rgba(0, 8, 14, 0.66), 0 0 34px rgba(6, 182, 212, 0.36), 0 0 22px rgba(45, 212, 191, 0.20) !important;\n  --nb-send: linear-gradient(135deg, #fbbf24, #fb7185 36%, #f472b6 58%, #60a5fa 80%, #67e8f9) !important;\n  --nb-send-ink: #08131d !important;\n  --nb-send-shadow: 0 2px 10px rgba(236, 72, 153, 0.40) !important;\n  --nb-send-shadow-hover: 0 3px 16px rgba(236, 72, 153, 0.50), 0 0 18px rgba(6, 182, 212, 0.35) !important;\n  --nb-bubble: #14262f !important;\n  --nb-bubble-ink: #eaf9fd !important;\n  --nb-bubble-shadow: inset 0 0 0 1px rgba(125, 211, 252, 0.16), 0 2px 6px rgba(0, 8, 14, 0.50) !important;\n  --nb-code-bg: #0f1e27 !important;\n  --nb-code-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.14), 0 1px 2px rgba(0, 8, 14, 0.45) !important;\n  --nb-code-band: linear-gradient(90deg, rgba(251, 146, 60, 0.16), rgba(236, 72, 153, 0.14) 34%, rgba(99, 102, 241, 0.12) 66%, rgba(45, 212, 191, 0.12)) !important;\n  --nb-edge: linear-gradient(90deg, #f59e0b, #f43f5e 20%, #ec4899 40%, #6366f1 60%, #06b6d4 80%, #10b981) !important;\n  --nb-edge-opacity: 0.7 !important;\n  --nb-select-bg: rgba(34, 211, 238, 0.36) !important;\n  --nb-select-ink: #f4fbfd !important;\n\n  /* gray ramp: cool slate-blue */\n  --dsw-static-neutral-bluish-00: #f4fbfd !important;\n  --dsw-static-neutral-bluish-50: #eaf6f9 !important;\n  --dsw-static-neutral-bluish-55: #e4f4f8 !important;\n  --dsw-static-neutral-bluish-60: #dfeff4 !important;\n  --dsw-static-neutral-bluish-75: #d8ebf1 !important;\n  --dsw-static-neutral-bluish-90: #cfe4ea !important;\n  --dsw-static-neutral-bluish-100: #c5dde5 !important;\n  --dsw-static-neutral-bluish-150: #b0ccd6 !important;\n  --dsw-static-neutral-bluish-200: #a2c1cc !important;\n  --dsw-static-neutral-bluish-300: #93b3bd !important;\n  --dsw-static-neutral-bluish-310: #8cabba !important;\n  --dsw-static-neutral-bluish-400: #7b97a3 !important;\n  --dsw-static-neutral-bluish-500: #5c7a86 !important;\n  --dsw-static-neutral-bluish-600: #3d5763 !important;\n  --dsw-static-neutral-bluish-700: #2c414b !important;\n  --dsw-static-neutral-bluish-750: #22333c !important;\n  --dsw-static-neutral-bluish-800: #18262e !important;\n  --dsw-static-neutral-bluish-850: #14212a !important;\n  --dsw-static-neutral-bluish-875: #101c24 !important;\n  --dsw-static-neutral-bluish-900: #0f1b22 !important;\n  --dsw-static-neutral-bluish-950: #0a161e !important;\n  --dsw-static-neutral-bluish-1000: #08121a !important;\n\n  --dsw-static-neutral-00: #f4fbfd !important;\n  --dsw-static-neutral-50: #eef7fa !important;\n  --dsw-static-neutral-100: #dfeff4 !important;\n  --dsw-static-neutral-150: #cfe4ea !important;\n  --dsw-static-neutral-200: #b9d1da !important;\n  --dsw-static-neutral-250: #aac4ce !important;\n  --dsw-static-neutral-300: #93b3bd !important;\n  --dsw-static-neutral-400: #7b97a3 !important;\n  --dsw-static-neutral-500: #5c7a86 !important;\n  --dsw-static-neutral-550: #4c6874 !important;\n  --dsw-static-neutral-600: #3d5763 !important;\n  --dsw-static-neutral-700: #2c414b !important;\n  --dsw-static-neutral-800: #18262e !important;\n  --dsw-static-neutral-850: #14212a !important;\n  --dsw-static-neutral-900: #0f1b22 !important;\n  --dsw-static-neutral-1000: #08121a !important;\n\n  /* accents */\n  --dsw-static-deepseek-50: #effdfd !important;\n  --dsw-static-deepseek-100: #d9f7fb !important;\n  --dsw-static-deepseek-200: #a7eef7 !important;\n  --dsw-static-deepseek-300: #7ce0ef !important;\n  --dsw-static-deepseek-400: #67e8f9 !important;\n  --dsw-static-deepseek-450: #22d3ee !important;\n  --dsw-static-deepseek-500: #22d3ee !important;\n  --dsw-static-deepseek-600: #06b6d4 !important;\n  --dsw-static-deepseek-800: #123039 !important;\n  --dsw-static-deepseek-900: #123039 !important;\n  --dsw-static-blue-50: #eff7ff !important;\n  --dsw-static-blue-75: #dbeafe !important;\n  --dsw-static-blue-50p: #e6f4ff !important;\n  --dsw-static-blue-100: #c7e5fb !important;\n  --dsw-static-blue-300: #7dd3fc !important;\n  --dsw-static-blue-400: #38bdf8 !important;\n  --dsw-static-blue-450: #38bdf8 !important;\n  --dsw-static-blue-500: #38bdf8 !important;\n  --dsw-static-blue-600: #0ea5e9 !important;\n  --dsw-static-blue-800: #0c4a6e !important;\n  --dsw-static-blue-900: #0a3d5c !important;\n  --dsw-static-blue-950: #062a3d !important;\n  --dsw-static-green-100: #d1fae5 !important;\n  --dsw-static-green-400: #34d399 !important;\n  --dsw-static-green-500: #34d399 !important;\n  --dsw-static-green-900: #064e3b !important;\n  --dsw-static-amber-100: #fef3c7 !important;\n  --dsw-static-amber-400: #fbbf24 !important;\n  --dsw-static-amber-500: #fbbf24 !important;\n  --dsw-static-amber-600: #f59e0b !important;\n  --dsw-static-amber-900: #4a2c05 !important;\n  --dsw-static-red-50: #fff1f2 !important;\n  --dsw-static-red-100: #ffe4e6 !important;\n  --dsw-static-red-400: #fb7185 !important;\n  --dsw-static-red-500: #f43f5e !important;\n  --dsw-static-red-600: #e11d48 !important;\n  --dsw-static-red-900: #4c0519 !important;\n  --dsw-static-violet-400: #2dd4bf !important;\n  --dsw-static-violet-600: #14b8a6 !important;\n\n  /* surfaces */\n  --dsw-alias-bg-base: #0a171f !important;\n  --dsw-alias-bg-layer-1: #0e1d28 !important;\n  --dsw-alias-bg-layer-2: #14262f !important;\n  --dsw-alias-bg-layer-3: #18262e !important;\n  --dsw-alias-bg-overlay: rgba(14, 28, 38, 0.94) !important;\n  --dsw-alias-bg-module-platform: rgba(34, 211, 238, 0.16) !important;\n  --dsw-alias-bg-skeleton: rgba(103, 232, 249, 0.06) !important;\n  --dsw-alias-bg-multi-select: rgba(34, 211, 238, 0.10) !important;\n  --dsw-alias-border-l1: rgba(56, 189, 248, 0.10) !important;\n  --dsw-alias-border-l2: rgba(56, 189, 248, 0.18) !important;\n  --dsw-alias-border-l3: rgba(56, 189, 248, 0.22) !important;\n  --dsw-alias-border-l4: rgba(125, 211, 252, 0.30) !important;\n  --dsw-alias-border-selected: #22d3ee !important;\n  --dsw-alias-card-fill: rgba(103, 232, 249, 0.055) !important;\n  --dsw-alias-card-fill-hover: rgba(103, 232, 249, 0.10) !important;\n  --dsw-alias-card-tile-fill: rgba(103, 232, 249, 0.055) !important;\n  --dsw-alias-hovercard-bg: #162b36 !important;\n\n  /* ink */\n  --dsw-alias-label-primary: #eaf9fd !important;\n  --dsw-alias-label-primary-bluish: #eaf9fd !important;\n  --dsw-alias-label-secondary: rgba(206, 235, 243, 0.76) !important;\n  --dsw-alias-label-tertiary: rgba(178, 214, 224, 0.56) !important;\n  --dsw-alias-label-caption: rgba(178, 214, 224, 0.56) !important;\n  --dsw-alias-label-dimmed: rgba(160, 198, 210, 0.42) !important;\n  --dsw-alias-label-primary-dimmed: #93b3bd !important;\n  --dsw-alias-brand-primary: #22d3ee !important;\n  --dsw-alias-brand-text: #22d3ee !important;\n  --dsw-alias-link: #38bdf8 !important;\n\n  /* states */\n  --dsw-alias-state-success-primary: #34d399 !important;\n  --dsw-alias-state-success-secondary: rgba(52, 211, 153, 0.18) !important;\n  --dsw-alias-state-success-tertiary: rgba(52, 211, 153, 0.10) !important;\n  --dsw-alias-state-warn-primary: #fbbf24 !important;\n  --dsw-alias-state-warn-secondary: rgba(251, 191, 36, 0.18) !important;\n  --dsw-alias-state-warn-tertiary: rgba(251, 191, 36, 0.10) !important;\n  --dsw-alias-state-warn-label: #fbbf24 !important;\n  --dsw-alias-state-error-primary: #fb7185 !important;\n  --dsw-alias-state-error-secondary: rgba(251, 113, 133, 0.18) !important;\n  --dsw-alias-state-idle-primary: #5c7a86 !important;\n  --dsw-alias-state-done-primary: #2dd4bf !important;\n  --dsw-alias-state-business-primary: #22d3ee !important;\n  --dsw-alias-state-business-tertiary: rgba(34, 211, 238, 0.16) !important;\n\n  /* controls */\n  --dsw-alias-button-info-fill: #22d3ee !important;\n  --dsw-alias-button-info-hover: #67e8f9 !important;\n  --dsw-alias-button-primary-fill: #22d3ee !important;\n  --dsw-alias-button-primary-hover: #67e8f9 !important;\n  --dsw-alias-button-elevated-fill: #162b36 !important;\n  --dsw-alias-button-floating-fill: rgba(20, 38, 48, 0.86) !important;\n  --dsw-alias-button-floating-hover: rgba(22, 43, 54, 0.94) !important;\n  --dsw-alias-interactive-bg-hover: rgba(103, 232, 249, 0.08) !important;\n  --dsw-alias-interactive-bg-active: rgba(34, 211, 238, 0.16) !important;\n  --dsw-alias-interactive-bg-hover-solid: #162b36 !important;\n  --dsw-alias-switch-thumb: #93b3bd !important;\n  --dsw-alias-scrollbar-bg-l1: rgba(56, 189, 248, 0.12) !important;\n  --dsw-alias-scrollbar-bg-l2: #3d5763 !important;\n  --dsw-alias-scrollbar-hover-l1: rgba(56, 189, 248, 0.22) !important;\n  --dsw-alias-scrollbar-hover-l2: #5c7a86 !important;\n\n  /* markdown */\n  --dsw-alias-markdown-code-block: #0f1e27 !important;\n  --dsw-alias-markdown-code-block-banner: rgba(56, 189, 248, 0.08) !important;\n  --dsw-alias-markdown-inline-code: rgba(103, 232, 249, 0.10) !important;\n  --dsw-alias-markdown-tag: rgba(56, 189, 248, 0.14) !important;\n  --dsw-alias-markdown-citation: #93b3bd !important;\n  --dsw-alias-markdown-placeholder: #3d5763 !important;\n  --dsw-alias-markdown-code-segment-selected: #162b36 !important;\n  --dsw-alias-markdown-code-segment-unselected: #0f1e27 !important;\n\n  /* floating surfaces */\n  --dsw-alias-tooltip-bg: #22333c !important;\n  --dsw-alias-tooltip-label: #eaf9fd !important;\n  --dsw-alias-toast-bg: #162b36 !important;\n  --dsw-alias-toast-label: #eaf9fd !important;\n  --dsw-alias-trajectory-accent: #38bdf8 !important;\n  --dsw-alias-turn-trigger-bg: rgba(103, 232, 249, 0.05) !important;\n  --dsw-alias-turn-trigger-bg-hover: rgba(103, 232, 249, 0.10) !important;\n  --dsw-alias-menu-group-header-fill: rgba(56, 189, 248, 0.08) !important;\n  --dsw-alias-menu-icon: #93b3bd !important;\n  --dsw-alias-code-diff-added: rgba(52, 211, 153, 0.16) !important;\n  --dsw-alias-code-diff-deleted: rgba(251, 113, 133, 0.16) !important;\n  --dsw-alias-chart-messages: #22d3ee !important;\n  --dsw-alias-chart-system: #93b3bd !important;\n  --dsw-alias-chart-tools: #2dd4bf !important;\n\n  /* pieces the columns read by their own token names. `sidebar-fill` is opaque\n     on purpose: the desktop preload samples it to paint the native caption\n     buttons, and an alpha channel would be dropped there. */\n  --dsw-specific-sidebar-fill: #0a1620 !important;\n  --dsw-specific-sidebar-nav-item-active: rgba(34, 211, 238, 0.16) !important;\n  --dsw-specific-sidebar-nav-item-active-accent: #22d3ee !important;\n  --dsw-specific-bubble: #14262f !important;\n  --dsw-specific-bubble-highlight: #162b36 !important;\n  --dsw-specific-input-major: rgba(14, 28, 38, 0.90) !important;\n  --dsw-specific-menu: rgba(10, 22, 32, 0.92) !important;\n  --dsw-menu-surface-fill: rgba(10, 22, 32, 0.92) !important;\n  --dsw-specific-selector: rgba(20, 38, 48, 0.92) !important;\n  --dsw-specific-tip: rgba(20, 38, 48, 0.92) !important;\n  --dsw-specific-file-upload-track: rgba(56, 189, 248, 0.14) !important;\n}\n\n/* ---------- edition: onyx (near-black) ----------\n   The same spectrum, pressed down to black: lobes drop to a whisper and every\n   pane is a shade of ink. */\n\nhtml[data-nebula-edition=\"onyx\"] body {\n  --nb-canvas: #000000 !important;\n  --nb-aurora: \n    radial-gradient(1200px 680px at 4% -12%, rgba(251, 146, 60, 0.24), transparent 64%),\n    radial-gradient(980px 560px at 98% -8%, rgba(236, 72, 153, 0.24), transparent 66%),\n    radial-gradient(900px 600px at 88% 112%, rgba(34, 211, 238, 0.26), transparent 68%),\n    radial-gradient(760px 460px at 10% 114%, rgba(45, 212, 191, 0.20), transparent 70%),\n    radial-gradient(1000px 620px at 48% 46%, rgba(99, 102, 241, 0.16), transparent 72%),\n    radial-gradient(700px 420px at 62% 106%, rgba(163, 230, 53, 0.10), transparent 74%) !important;\n  --nb-side-tint: rgba(3, 6, 9, 0.70) !important;\n  --nb-side-glow: \n    radial-gradient(460px 300px at 0% 0%, rgba(236, 72, 153, 0.22), transparent 66%),\n    radial-gradient(420px 300px at 100% 46%, rgba(251, 191, 36, 0.15), transparent 70%),\n    radial-gradient(440px 340px at 60% 104%, rgba(45, 212, 191, 0.20), transparent 70%),\n    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 240px) !important;\n  --nb-side-hairline: rgba(236, 72, 153, 0.14) !important;\n  --nb-titlebar: #04080c !important;\n  --nb-titlebar-line: rgba(148, 190, 210, 0.10) !important;\n  --nb-sheet: #04070b !important;\n  --nb-sheet-wash: \n    radial-gradient(1100px 340px at 50% -18%, rgba(251, 146, 60, 0.10), transparent 70%),\n    radial-gradient(820px 300px at 100% -10%, rgba(236, 72, 153, 0.09), transparent 72%),\n    radial-gradient(820px 300px at 0% -10%, rgba(59, 130, 246, 0.09), transparent 72%),\n    radial-gradient(900px 320px at 82% 112%, rgba(45, 212, 191, 0.08), transparent 74%) !important;\n  --nb-card-fill: linear-gradient(152deg, rgba(10, 17, 22, 0.96), rgba(3, 7, 10, 0.98)) !important;\n  --nb-card-rim: linear-gradient(135deg, rgba(245, 158, 11, 0.80), rgba(244, 63, 94, 0.75) 24%, rgba(219, 39, 119, 0.75) 44%, rgba(99, 102, 241, 0.70) 66%, rgba(6, 182, 212, 0.85)) !important;\n  --nb-card-fill-focus: linear-gradient(152deg, rgba(13, 22, 28, 0.97), rgba(4, 9, 12, 0.98)) !important;\n  --nb-card-rim-focus: linear-gradient(135deg, rgba(217, 119, 6, 0.95), rgba(225, 29, 72, 0.90) 24%, rgba(219, 39, 119, 0.90) 44%, rgba(79, 70, 229, 0.90) 66%, rgba(8, 145, 178, 0.95)) !important;\n  --nb-card-shadow: 0 12px 34px rgba(0, 0, 0, 0.70), 0 0 26px rgba(6, 182, 212, 0.16) !important;\n  --nb-card-shadow-focus: 0 14px 40px rgba(0, 0, 0, 0.75), 0 0 34px rgba(6, 182, 212, 0.28), 0 0 22px rgba(236, 72, 153, 0.20) !important;\n  --nb-send: linear-gradient(135deg, #fbbf24, #fb7185 36%, #f472b6 58%, #60a5fa 80%, #67e8f9) !important;\n  --nb-send-ink: #04070b !important;\n  --nb-send-shadow: 0 2px 10px rgba(236, 72, 153, 0.35) !important;\n  --nb-send-shadow-hover: 0 3px 16px rgba(236, 72, 153, 0.45), 0 0 18px rgba(6, 182, 212, 0.30) !important;\n  --nb-bubble: #0b1218 !important;\n  --nb-bubble-ink: #e9f4f8 !important;\n  --nb-bubble-shadow: inset 0 0 0 1px rgba(148, 190, 210, 0.14), 0 2px 8px rgba(0, 0, 0, 0.60) !important;\n  --nb-code-bg: #080d11 !important;\n  --nb-code-shadow: inset 0 0 0 1px rgba(148, 190, 210, 0.12), 0 1px 2px rgba(0, 0, 0, 0.55) !important;\n  --nb-code-band: linear-gradient(90deg, rgba(251, 146, 60, 0.16), rgba(236, 72, 153, 0.14) 34%, rgba(99, 102, 241, 0.12) 66%, rgba(45, 212, 191, 0.12)) !important;\n  --nb-edge: linear-gradient(90deg, #f59e0b, #f43f5e 20%, #ec4899 40%, #6366f1 60%, #06b6d4 80%, #10b981) !important;\n  --nb-edge-opacity: 0.75 !important;\n  --nb-select-bg: rgba(34, 211, 238, 0.34) !important;\n  --nb-select-ink: #f2fafd !important;\n\n  --dsw-static-neutral-bluish-00: #f2fafd !important;\n  --dsw-static-neutral-bluish-50: #e6f2f6 !important;\n  --dsw-static-neutral-bluish-55: #dfeef3 !important;\n  --dsw-static-neutral-bluish-60: #d8e7ec !important;\n  --dsw-static-neutral-bluish-75: #cddfe5 !important;\n  --dsw-static-neutral-bluish-90: #c3d6dc !important;\n  --dsw-static-neutral-bluish-100: #b6cbd2 !important;\n  --dsw-static-neutral-bluish-150: #a2bac3 !important;\n  --dsw-static-neutral-bluish-200: #94adb7 !important;\n  --dsw-static-neutral-bluish-300: #7f949d !important;\n  --dsw-static-neutral-bluish-310: #778c95 !important;\n  --dsw-static-neutral-bluish-400: #5d6f77 !important;\n  --dsw-static-neutral-bluish-500: #46545c !important;\n  --dsw-static-neutral-bluish-600: #2d383e !important;\n  --dsw-static-neutral-bluish-700: #202a30 !important;\n  --dsw-static-neutral-bluish-750: #172026 !important;\n  --dsw-static-neutral-bluish-800: #101820 !important;\n  --dsw-static-neutral-bluish-850: #0b1218 !important;\n  --dsw-static-neutral-bluish-875: #0a1117 !important;\n  --dsw-static-neutral-bluish-900: #080e13 !important;\n  --dsw-static-neutral-bluish-950: #04080c !important;\n  --dsw-static-neutral-bluish-1000: #030608 !important;\n\n  --dsw-static-neutral-00: #f2fafd !important;\n  --dsw-static-neutral-50: #e9f4f8 !important;\n  --dsw-static-neutral-100: #c3d6dc !important;\n  --dsw-static-neutral-150: #a2bac3 !important;\n  --dsw-static-neutral-200: #94adb7 !important;\n  --dsw-static-neutral-250: #869fa9 !important;\n  --dsw-static-neutral-300: #7f949d !important;\n  --dsw-static-neutral-400: #5d6f77 !important;\n  --dsw-static-neutral-500: #46545c !important;\n  --dsw-static-neutral-550: #39464d !important;\n  --dsw-static-neutral-600: #2d383e !important;\n  --dsw-static-neutral-700: #202a30 !important;\n  --dsw-static-neutral-800: #101820 !important;\n  --dsw-static-neutral-850: #0b1218 !important;\n  --dsw-static-neutral-900: #080e13 !important;\n  --dsw-static-neutral-1000: #030608 !important;\n\n  --dsw-static-deepseek-50: #eafcff !important;\n  --dsw-static-deepseek-100: #ccf5fb !important;\n  --dsw-static-deepseek-200: #9beaf5 !important;\n  --dsw-static-deepseek-300: #6fdcf0 !important;\n  --dsw-static-deepseek-400: #67e8f9 !important;\n  --dsw-static-deepseek-450: #22d3ee !important;\n  --dsw-static-deepseek-500: #22d3ee !important;\n  --dsw-static-deepseek-600: #06b6d4 !important;\n  --dsw-static-deepseek-800: #0a2730 !important;\n  --dsw-static-deepseek-900: #0a2730 !important;\n  --dsw-static-blue-50: #eaf4ff !important;\n  --dsw-static-blue-75: #d6ecff !important;\n  --dsw-static-blue-100: #c2e3fc !important;\n  --dsw-static-blue-300: #7dd3fc !important;\n  --dsw-static-blue-400: #38bdf8 !important;\n  --dsw-static-blue-450: #38bdf8 !important;\n  --dsw-static-blue-500: #38bdf8 !important;\n  --dsw-static-blue-600: #0ea5e9 !important;\n  --dsw-static-blue-800: #06304a !important;\n  --dsw-static-blue-900: #052738 !important;\n  --dsw-static-blue-950: #031a26 !important;\n  --dsw-static-green-100: #c8f5e0 !important;\n  --dsw-static-green-400: #34d399 !important;\n  --dsw-static-green-500: #34d399 !important;\n  --dsw-static-green-900: #053b2b !important;\n  --dsw-static-amber-100: #fdf0c9 !important;\n  --dsw-static-amber-400: #fbbf24 !important;\n  --dsw-static-amber-500: #fbbf24 !important;\n  --dsw-static-amber-600: #f59e0b !important;\n  --dsw-static-amber-900: #3d2404 !important;\n  --dsw-static-red-50: #ffeff1 !important;\n  --dsw-static-red-100: #ffdfe3 !important;\n  --dsw-static-red-400: #fb7185 !important;\n  --dsw-static-red-500: #f43f5e !important;\n  --dsw-static-red-600: #e11d48 !important;\n  --dsw-static-red-900: #40040f !important;\n  --dsw-static-violet-400: #2dd4bf !important;\n  --dsw-static-violet-600: #14b8a6 !important;\n\n  --dsw-alias-bg-base: #04070b !important;\n  --dsw-alias-bg-layer-1: #070c11 !important;\n  --dsw-alias-bg-layer-2: #0b1218 !important;\n  --dsw-alias-bg-layer-3: #101820 !important;\n  --dsw-alias-bg-overlay: rgba(7, 12, 17, 0.95) !important;\n  --dsw-alias-bg-module-platform: rgba(34, 211, 238, 0.14) !important;\n  --dsw-alias-bg-skeleton: rgba(148, 190, 210, 0.05) !important;\n  --dsw-alias-bg-multi-select: rgba(34, 211, 238, 0.09) !important;\n  --dsw-alias-border-l1: rgba(148, 190, 210, 0.09) !important;\n  --dsw-alias-border-l2: rgba(148, 190, 210, 0.14) !important;\n  --dsw-alias-border-l3: rgba(148, 190, 210, 0.18) !important;\n  --dsw-alias-border-l4: rgba(148, 190, 210, 0.22) !important;\n  --dsw-alias-border-selected: #22d3ee !important;\n  --dsw-alias-card-fill: rgba(148, 190, 210, 0.05) !important;\n  --dsw-alias-card-fill-hover: rgba(148, 190, 210, 0.09) !important;\n  --dsw-alias-card-tile-fill: rgba(148, 190, 210, 0.05) !important;\n  --dsw-alias-hovercard-bg: #0d151c !important;\n\n  --dsw-alias-label-primary: #e9f4f8 !important;\n  --dsw-alias-label-primary-bluish: #e9f4f8 !important;\n  --dsw-alias-label-secondary: rgba(206, 226, 234, 0.74) !important;\n  --dsw-alias-label-tertiary: rgba(176, 200, 210, 0.54) !important;\n  --dsw-alias-label-caption: rgba(176, 200, 210, 0.54) !important;\n  --dsw-alias-label-dimmed: rgba(158, 184, 196, 0.40) !important;\n  --dsw-alias-label-primary-dimmed: #7f949d !important;\n  --dsw-alias-brand-primary: #22d3ee !important;\n  --dsw-alias-brand-text: #22d3ee !important;\n  --dsw-alias-link: #38bdf8 !important;\n\n  --dsw-alias-state-success-primary: #34d399 !important;\n  --dsw-alias-state-success-secondary: rgba(52, 211, 153, 0.16) !important;\n  --dsw-alias-state-success-tertiary: rgba(52, 211, 153, 0.09) !important;\n  --dsw-alias-state-warn-primary: #fbbf24 !important;\n  --dsw-alias-state-warn-secondary: rgba(251, 191, 36, 0.16) !important;\n  --dsw-alias-state-warn-tertiary: rgba(251, 191, 36, 0.09) !important;\n  --dsw-alias-state-warn-label: #fbbf24 !important;\n  --dsw-alias-state-error-primary: #fb7185 !important;\n  --dsw-alias-state-error-secondary: rgba(251, 113, 133, 0.16) !important;\n  --dsw-alias-state-idle-primary: #46545c !important;\n  --dsw-alias-state-done-primary: #2dd4bf !important;\n  --dsw-alias-state-business-primary: #22d3ee !important;\n  --dsw-alias-state-business-tertiary: rgba(34, 211, 238, 0.14) !important;\n\n  --dsw-alias-button-info-fill: #22d3ee !important;\n  --dsw-alias-button-info-hover: #67e8f9 !important;\n  --dsw-alias-button-primary-fill: #22d3ee !important;\n  --dsw-alias-button-primary-hover: #67e8f9 !important;\n  --dsw-alias-button-elevated-fill: #0d151c !important;\n  --dsw-alias-button-floating-fill: rgba(10, 16, 22, 0.88) !important;\n  --dsw-alias-button-floating-hover: rgba(13, 21, 28, 0.94) !important;\n  --dsw-alias-interactive-bg-hover: rgba(148, 190, 210, 0.08) !important;\n  --dsw-alias-interactive-bg-active: rgba(148, 190, 210, 0.14) !important;\n  --dsw-alias-interactive-bg-hover-solid: #0d151c !important;\n  --dsw-alias-switch-thumb: #7f949d !important;\n  --dsw-alias-scrollbar-bg-l1: rgba(148, 190, 210, 0.12) !important;\n  --dsw-alias-scrollbar-bg-l2: #2d383e !important;\n  --dsw-alias-scrollbar-hover-l1: rgba(148, 190, 210, 0.20) !important;\n  --dsw-alias-scrollbar-hover-l2: #46545c !important;\n\n  --dsw-alias-markdown-code-block: #080d11 !important;\n  --dsw-alias-markdown-code-block-banner: rgba(148, 190, 210, 0.07) !important;\n  --dsw-alias-markdown-inline-code: rgba(148, 190, 210, 0.09) !important;\n  --dsw-alias-markdown-tag: rgba(148, 190, 210, 0.12) !important;\n  --dsw-alias-markdown-citation: #7f949d !important;\n  --dsw-alias-markdown-placeholder: #2d383e !important;\n  --dsw-alias-markdown-code-segment-selected: #0d151c !important;\n  --dsw-alias-markdown-code-segment-unselected: #080d11 !important;\n\n  --dsw-alias-tooltip-bg: #0d151c !important;\n  --dsw-alias-tooltip-label: #e9f4f8 !important;\n  --dsw-alias-toast-bg: #0d151c !important;\n  --dsw-alias-toast-label: #e9f4f8 !important;\n  --dsw-alias-trajectory-accent: #38bdf8 !important;\n  --dsw-alias-turn-trigger-bg: rgba(148, 190, 210, 0.045) !important;\n  --dsw-alias-turn-trigger-bg-hover: rgba(148, 190, 210, 0.09) !important;\n  --dsw-alias-menu-group-header-fill: rgba(148, 190, 210, 0.07) !important;\n  --dsw-alias-menu-icon: #7f949d !important;\n  --dsw-alias-code-diff-added: rgba(52, 211, 153, 0.14) !important;\n  --dsw-alias-code-diff-deleted: rgba(251, 113, 133, 0.14) !important;\n  --dsw-alias-chart-messages: #22d3ee !important;\n  --dsw-alias-chart-system: #7f949d !important;\n  --dsw-alias-chart-tools: #2dd4bf !important;\n\n  --dsw-specific-sidebar-fill: #04080c !important;\n  --dsw-specific-sidebar-nav-item-active: rgba(34, 211, 238, 0.14) !important;\n  --dsw-specific-sidebar-nav-item-active-accent: #22d3ee !important;\n  --dsw-specific-bubble: #0b1218 !important;\n  --dsw-specific-bubble-highlight: #0d151c !important;\n  --dsw-specific-input-major: rgba(6, 11, 15, 0.94) !important;\n  --dsw-specific-menu: rgba(4, 8, 12, 0.94) !important;\n  --dsw-menu-surface-fill: rgba(4, 8, 12, 0.94) !important;\n  --dsw-specific-selector: rgba(10, 16, 22, 0.92) !important;\n  --dsw-specific-tip: rgba(10, 16, 22, 0.92) !important;\n  --dsw-specific-file-upload-track: rgba(148, 190, 210, 0.14) !important;\n}\n\n/* ---------- edition: light ----------\n   Warm white panes on a pastel spectrum wash. The composer keeps its spectrum\n   rim, so the light edition still reads as the same family. */\n\nhtml[data-nebula-edition=\"light\"] body {\n  --nb-canvas: #fcfbfd !important;\n  --nb-aurora: \n    linear-gradient(118deg, rgba(255, 186, 120, 0.26), rgba(255, 133, 192, 0.24) 28%, rgba(139, 176, 255, 0.20) 55%, rgba(125, 235, 220, 0.22) 80%, rgba(186, 246, 160, 0.20)),\n    radial-gradient(1100px 620px at 4% -12%, rgba(251, 146, 60, 0.30), transparent 62%),\n    radial-gradient(980px 560px at 98% -6%, rgba(244, 114, 182, 0.28), transparent 64%),\n    radial-gradient(900px 620px at 86% 108%, rgba(45, 212, 191, 0.24), transparent 66%),\n    radial-gradient(820px 520px at 8% 110%, rgba(96, 165, 250, 0.24), transparent 66%),\n    radial-gradient(760px 460px at 50% 48%, rgba(163, 230, 53, 0.14), transparent 68%) !important;\n  --nb-side-tint: rgba(252, 251, 254, 0.74) !important;\n  --nb-side-glow: \n    radial-gradient(460px 300px at 0% 0%, rgba(244, 114, 182, 0.16), transparent 66%),\n    radial-gradient(420px 300px at 100% 46%, rgba(251, 191, 36, 0.12), transparent 70%),\n    radial-gradient(440px 340px at 60% 104%, rgba(45, 212, 191, 0.16), transparent 70%),\n    linear-gradient(180deg, rgba(255, 255, 255, 0.92), transparent 240px) !important;\n  --nb-side-hairline: rgba(30, 32, 50, 0.10) !important;\n  --nb-titlebar: #faf9fc !important;\n  --nb-titlebar-line: rgba(30, 32, 50, 0.08) !important;\n  --nb-sheet: #ffffff !important;\n  --nb-sheet-wash: \n    radial-gradient(1100px 340px at 50% -18%, rgba(251, 146, 60, 0.12), transparent 70%),\n    radial-gradient(820px 300px at 100% -10%, rgba(236, 72, 153, 0.10), transparent 72%),\n    radial-gradient(820px 300px at 0% -10%, rgba(96, 165, 250, 0.10), transparent 72%),\n    radial-gradient(900px 320px at 82% 112%, rgba(45, 212, 191, 0.08), transparent 74%) !important;\n  --nb-card-fill: linear-gradient(152deg, #ffffff, #fdfcff) !important;\n  --nb-card-rim: linear-gradient(135deg, rgba(245, 158, 11, 0.85), rgba(244, 63, 94, 0.80) 24%, rgba(236, 72, 153, 0.80) 44%, rgba(99, 102, 241, 0.75) 66%, rgba(6, 182, 212, 0.85)) !important;\n  --nb-card-fill-focus: linear-gradient(152deg, #ffffff, #fefdff) !important;\n  --nb-card-rim-focus: linear-gradient(135deg, rgba(217, 119, 6, 0.95), rgba(225, 29, 72, 0.90) 24%, rgba(219, 39, 119, 0.90) 44%, rgba(79, 70, 229, 0.90) 66%, rgba(8, 145, 178, 0.95)) !important;\n  --nb-card-shadow: 0 10px 28px rgba(30, 26, 50, 0.12), 0 0 22px rgba(236, 72, 153, 0.10) !important;\n  --nb-card-shadow-focus: 0 14px 36px rgba(30, 26, 50, 0.16), 0 0 30px rgba(236, 72, 153, 0.20), 0 0 18px rgba(34, 211, 238, 0.16) !important;\n  --nb-send: linear-gradient(135deg, #fbbf24, #fb7185 38%, #60a5fa 72%, #67e8f9) !important;\n  --nb-send-ink: #1b1424 !important;\n  --nb-send-shadow: 0 2px 10px rgba(236, 72, 153, 0.30) !important;\n  --nb-send-shadow-hover: 0 3px 16px rgba(99, 102, 241, 0.35), 0 0 14px rgba(236, 72, 153, 0.25) !important;\n  --nb-bubble: #ffffff !important;\n  --nb-bubble-ink: #1a1a26 !important;\n  --nb-bubble-shadow: inset 0 0 0 1px rgba(30, 32, 50, 0.09), 0 2px 6px rgba(30, 32, 50, 0.06) !important;\n  --nb-code-bg: #ffffff !important;\n  --nb-code-shadow: inset 0 0 0 1px rgba(30, 32, 50, 0.09), 0 1px 2px rgba(30, 32, 50, 0.04) !important;\n  --nb-code-band: linear-gradient(90deg, rgba(251, 146, 60, 0.14), rgba(244, 114, 182, 0.12) 36%, rgba(99, 102, 241, 0.10) 66%, rgba(45, 212, 191, 0.12)) !important;\n  --nb-edge: linear-gradient(90deg, #f59e0b, #f43f5e 20%, #ec4899 40%, #6366f1 60%, #06b6d4 80%, #10b981) !important;\n  --nb-edge-opacity: 0.8 !important;\n  --nb-select-bg: rgba(236, 72, 153, 0.22) !important;\n  --nb-select-ink: #1c1424 !important;\n\n  --dsw-static-neutral-bluish-00: #ffffff !important;\n  --dsw-static-neutral-bluish-50: #fcfbfd !important;\n  --dsw-static-neutral-bluish-55: #faf9fc !important;\n  --dsw-static-neutral-bluish-60: #f7f6fa !important;\n  --dsw-static-neutral-bluish-75: #f6f5fa !important;\n  --dsw-static-neutral-bluish-90: #f2f1f6 !important;\n  --dsw-static-neutral-bluish-100: #eeedf3 !important;\n  --dsw-static-neutral-bluish-150: #e2e1e9 !important;\n  --dsw-static-neutral-bluish-200: #d5d4de !important;\n  --dsw-static-neutral-bluish-300: #b7b6c4 !important;\n  --dsw-static-neutral-bluish-310: #b0afbd !important;\n  --dsw-static-neutral-bluish-400: #9a99a9 !important;\n  --dsw-static-neutral-bluish-500: #6e6d7f !important;\n  --dsw-static-neutral-bluish-600: #4c4b5c !important;\n  --dsw-static-neutral-bluish-700: #3a3947 !important;\n  --dsw-static-neutral-bluish-750: #2e2d3a !important;\n  --dsw-static-neutral-bluish-800: #232230 !important;\n  --dsw-static-neutral-bluish-850: #1f1e2a !important;\n  --dsw-static-neutral-bluish-875: #1b1a26 !important;\n  --dsw-static-neutral-bluish-900: #17161f !important;\n  --dsw-static-neutral-bluish-950: #0f0e16 !important;\n  --dsw-static-neutral-bluish-1000: #0c0b12 !important;\n\n  --dsw-static-neutral-00: #ffffff !important;\n  --dsw-static-neutral-50: #f7f6fa !important;\n  --dsw-static-neutral-100: #eeedf3 !important;\n  --dsw-static-neutral-150: #e6e5ee !important;\n  --dsw-static-neutral-200: #d5d4de !important;\n  --dsw-static-neutral-250: #c8c7d3 !important;\n  --dsw-static-neutral-300: #b7b6c4 !important;\n  --dsw-static-neutral-400: #9a99a9 !important;\n  --dsw-static-neutral-500: #6e6d7f !important;\n  --dsw-static-neutral-550: #5e5d6f !important;\n  --dsw-static-neutral-600: #4c4b5c !important;\n  --dsw-static-neutral-700: #3a3947 !important;\n  --dsw-static-neutral-800: #232230 !important;\n  --dsw-static-neutral-850: #1f1e2a !important;\n  --dsw-static-neutral-900: #17161f !important;\n  --dsw-static-neutral-1000: #0c0b12 !important;\n\n  --dsw-static-deepseek-50: #fdf2f8 !important;\n  --dsw-static-deepseek-100: #fce7f3 !important;\n  --dsw-static-deepseek-200: #fbcfe8 !important;\n  --dsw-static-deepseek-300: #f472b6 !important;\n  --dsw-static-deepseek-400: #db2777 !important;\n  --dsw-static-deepseek-450: #be185d !important;\n  --dsw-static-deepseek-500: #be185d !important;\n  --dsw-static-deepseek-600: #9d174d !important;\n  --dsw-static-deepseek-800: #f5d0e0 !important;\n  --dsw-static-deepseek-900: #4a1130 !important;\n  --dsw-static-blue-50: #eff6ff !important;\n  --dsw-static-blue-75: #dbeafe !important;\n  --dsw-static-blue-100: #dbeafe !important;\n  --dsw-static-blue-300: #93c5fd !important;\n  --dsw-static-blue-400: #60a5fa !important;\n  --dsw-static-blue-450: #3b82f6 !important;\n  --dsw-static-blue-500: #3b82f6 !important;\n  --dsw-static-blue-600: #2563eb !important;\n  --dsw-static-blue-800: #bfdbfe !important;\n  --dsw-static-blue-900: #1e3a8a !important;\n  --dsw-static-blue-950: #172554 !important;\n  --dsw-static-green-100: #dcfce7 !important;\n  --dsw-static-green-400: #22c55e !important;\n  --dsw-static-green-500: #15803d !important;\n  --dsw-static-green-900: #14532d !important;\n  --dsw-static-amber-100: #fef3c7 !important;\n  --dsw-static-amber-400: #fbbf24 !important;\n  --dsw-static-amber-500: #b45309 !important;\n  --dsw-static-amber-600: #92400e !important;\n  --dsw-static-amber-900: #451a03 !important;\n  --dsw-static-red-50: #fff1f2 !important;\n  --dsw-static-red-100: #fee2e2 !important;\n  --dsw-static-red-400: #f43f5e !important;\n  --dsw-static-red-500: #be123c !important;\n  --dsw-static-red-600: #9f1239 !important;\n  --dsw-static-red-900: #4c0519 !important;\n  --dsw-static-violet-400: #c026d3 !important;\n  --dsw-static-violet-600: #a21caf !important;\n\n  --dsw-alias-bg-base: #ffffff !important;\n  --dsw-alias-bg-layer-1: #fdfcff !important;\n  --dsw-alias-bg-layer-2: #f6f5fa !important;\n  --dsw-alias-bg-layer-3: #eeedf3 !important;\n  --dsw-alias-bg-overlay: rgba(255, 255, 255, 0.95) !important;\n  --dsw-alias-bg-module-platform: rgba(30, 32, 50, 0.08) !important;\n  --dsw-alias-bg-skeleton: rgba(30, 32, 50, 0.04) !important;\n  --dsw-alias-bg-multi-select: rgba(30, 32, 50, 0.06) !important;\n  --dsw-alias-border-l1: rgba(30, 32, 50, 0.09) !important;\n  --dsw-alias-border-l2: rgba(30, 32, 50, 0.14) !important;\n  --dsw-alias-border-l3: rgba(30, 32, 50, 0.16) !important;\n  --dsw-alias-border-l4: rgba(30, 32, 50, 0.24) !important;\n  --dsw-alias-border-selected: #be185d !important;\n  --dsw-alias-card-fill: rgba(30, 32, 50, 0.04) !important;\n  --dsw-alias-card-fill-hover: rgba(30, 32, 50, 0.07) !important;\n  --dsw-alias-card-tile-fill: rgba(30, 32, 50, 0.04) !important;\n  --dsw-alias-hovercard-bg: #ffffff !important;\n\n  --dsw-alias-label-primary: #1a1a26 !important;\n  --dsw-alias-label-primary-bluish: #1a1a26 !important;\n  --dsw-alias-label-secondary: rgba(28, 28, 40, 0.75) !important;\n  --dsw-alias-label-tertiary: rgba(34, 34, 50, 0.56) !important;\n  --dsw-alias-label-caption: rgba(34, 34, 50, 0.56) !important;\n  --dsw-alias-label-dimmed: rgba(40, 40, 58, 0.42) !important;\n  --dsw-alias-label-primary-dimmed: #b7b6c4 !important;\n  --dsw-alias-brand-primary: #be185d !important;\n  --dsw-alias-brand-text: #be185d !important;\n  --dsw-alias-link: #2563eb !important;\n\n  --dsw-alias-state-success-primary: #15803d !important;\n  --dsw-alias-state-success-secondary: rgba(21, 128, 61, 0.14) !important;\n  --dsw-alias-state-success-tertiary: rgba(21, 128, 61, 0.08) !important;\n  --dsw-alias-state-warn-primary: #b45309 !important;\n  --dsw-alias-state-warn-secondary: rgba(180, 83, 9, 0.14) !important;\n  --dsw-alias-state-warn-tertiary: rgba(180, 83, 9, 0.08) !important;\n  --dsw-alias-state-warn-label: #b45309 !important;\n  --dsw-alias-state-error-primary: #be123c !important;\n  --dsw-alias-state-error-secondary: rgba(190, 18, 60, 0.12) !important;\n  --dsw-alias-state-idle-primary: #b7b6c4 !important;\n  --dsw-alias-state-done-primary: #c026d3 !important;\n  --dsw-alias-state-business-primary: #0369a1 !important;\n  --dsw-alias-state-business-tertiary: rgba(3, 105, 161, 0.12) !important;\n\n  --dsw-alias-button-info-fill: #1a1a26 !important;\n  --dsw-alias-button-info-hover: #2e2d3a !important;\n  --dsw-alias-button-primary-fill: #1a1a26 !important;\n  --dsw-alias-button-primary-hover: #2e2d3a !important;\n  --dsw-alias-button-elevated-fill: #ffffff !important;\n  --dsw-alias-button-floating-fill: rgba(255, 255, 255, 0.88) !important;\n  --dsw-alias-button-floating-hover: rgba(255, 255, 255, 0.96) !important;\n  --dsw-alias-interactive-bg-hover: rgba(30, 32, 50, 0.05) !important;\n  --dsw-alias-interactive-bg-active: rgba(30, 32, 50, 0.08) !important;\n  --dsw-alias-interactive-bg-hover-solid: #eeedf3 !important;\n  --dsw-alias-switch-thumb: #ffffff !important;\n  --dsw-alias-scrollbar-bg-l1: rgba(30, 32, 50, 0.10) !important;\n  --dsw-alias-scrollbar-bg-l2: #d5d4de !important;\n  --dsw-alias-scrollbar-hover-l1: rgba(30, 32, 50, 0.18) !important;\n  --dsw-alias-scrollbar-hover-l2: #b7b6c4 !important;\n\n  --dsw-alias-markdown-code-block: #ffffff !important;\n  --dsw-alias-markdown-code-block-banner: rgba(30, 32, 50, 0.06) !important;\n  --dsw-alias-markdown-inline-code: rgba(30, 32, 50, 0.07) !important;\n  --dsw-alias-markdown-tag: rgba(30, 32, 50, 0.08) !important;\n  --dsw-alias-markdown-citation: #6e6d7f !important;\n  --dsw-alias-markdown-placeholder: #d5d4de !important;\n  --dsw-alias-markdown-code-segment-selected: #eeedf3 !important;\n  --dsw-alias-markdown-code-segment-unselected: #f6f5fa !important;\n\n  --dsw-alias-tooltip-bg: #1a1a26 !important;\n  --dsw-alias-tooltip-label: #fcfbfd !important;\n  --dsw-alias-toast-bg: #ffffff !important;\n  --dsw-alias-toast-label: #1a1a26 !important;\n  --dsw-alias-trajectory-accent: #2563eb !important;\n  --dsw-alias-turn-trigger-bg: rgba(30, 32, 50, 0.04) !important;\n  --dsw-alias-turn-trigger-bg-hover: rgba(30, 32, 50, 0.07) !important;\n  --dsw-alias-menu-group-header-fill: rgba(30, 32, 50, 0.05) !important;\n  --dsw-alias-menu-icon: #6e6d7f !important;\n  --dsw-alias-code-diff-added: rgba(21, 128, 61, 0.10) !important;\n  --dsw-alias-code-diff-deleted: rgba(190, 18, 60, 0.10) !important;\n  --dsw-alias-chart-messages: #be185d !important;\n  --dsw-alias-chart-system: #9a99a9 !important;\n  --dsw-alias-chart-tools: #2563eb !important;\n\n  --dsw-specific-sidebar-fill: #faf9fc !important;\n  --dsw-specific-sidebar-nav-item-active: rgba(30, 32, 50, 0.08) !important;\n  --dsw-specific-sidebar-nav-item-active-accent: #be185d !important;\n  --dsw-specific-bubble: #ffffff !important;\n  --dsw-specific-bubble-highlight: #f6f5fa !important;\n  --dsw-specific-input-major: rgba(255, 255, 255, 0.94) !important;\n  --dsw-specific-menu: rgba(255, 255, 255, 0.92) !important;\n  --dsw-menu-surface-fill: rgba(255, 255, 255, 0.92) !important;\n  --dsw-specific-selector: rgba(255, 255, 255, 0.94) !important;\n  --dsw-specific-tip: rgba(255, 255, 255, 0.94) !important;\n  --dsw-specific-file-upload-track: rgba(30, 32, 50, 0.12) !important;\n}\n\n";
    var STORAGE_KEY = "dsh.nebula-spectrum.v1";
    var EDITIONS = ["auto", "nebula", "onyx", "light"];
    var EDITION_ATTR = "data-nebula-edition";

    /* ---------- dictionaries ---------- */

    var en = {
      title: "Nebula Spectrum",
      hint: "An aurora canvas, a glass sidebar and a spectrum-rimmed composer.",
      nebula: "Deep ocean",
      onyx: "Onyx",
      light: "Light",
      auto: "Follow appearance",
      autoHint: "The dark appearance uses Deep ocean.",
    };

    var zh = {
      title: "星云光谱",
      hint: "极光画布、玻璃侧边栏与光谱描边的输入框。",
      nebula: "深海",
      onyx: "玄黑",
      light: "浅色",
      auto: "跟随外观",
      autoHint: "深色外观使用深海版本。",
    };

    /* ---------- the edition store ----------
       A preference this plugin owns. It never registers a DSH theme, because
       only the light / dark / system preferences persist through the host and
       only those three appear in the built-in appearance row. */

    var SWATCH = {
      nebula:
        "radial-gradient(circle at 22% 18%, #fb923c, transparent 55%)," +
        "radial-gradient(circle at 84% 10%, #ec4899, transparent 55%)," +
        "radial-gradient(circle at 76% 92%, #22d3ee, transparent 58%)," +
        "radial-gradient(circle at 16% 86%, #2dd4bf, transparent 55%),#0a171f",
      onyx:
        "radial-gradient(circle at 22% 18%, #c2711f, transparent 52%)," +
        "radial-gradient(circle at 84% 10%, #a8285c, transparent 52%)," +
        "radial-gradient(circle at 76% 92%, #128fa0, transparent 55%)," +
        "radial-gradient(circle at 16% 86%, #1d8f84, transparent 52%),#04070b",
      light:
        "linear-gradient(118deg, #ffd9b8, #ffc7de 40%, #cfe0ff 70%, #c6f2ea),#fcfbfd",
      auto: "linear-gradient(90deg, #0a171f 0 50%, #fcfbfd 50% 100%)",
    };

    function readEdition() {
      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return "auto";
        var parsed = JSON.parse(raw);
        var edition = parsed && parsed.edition;
        return EDITIONS.indexOf(edition) === -1 ? "auto" : edition;
      } catch (error) {
        return "auto";
      }
    }

    function writeEdition(edition) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ edition: edition }));
      } catch (error) {
        /* a private-mode window may refuse storage; in-memory choice still works */
      }
    }

    var store = {
      edition: readEdition(),
      scheme: "dark",
      listeners: new Set(),
    };

    function schemeOf(ctx) {
      try {
        var theme = ctx.theme.getTheme();
        var scheme = theme && theme.active && theme.active.colorScheme;
        return scheme === "light" ? "light" : "dark";
      } catch (error) {
        return "dark";
      }
    }

    function resolvedEdition() {
      if (store.edition !== "auto") return store.edition;
      return store.scheme === "light" ? "light" : "nebula";
    }

    function applyEdition() {
      var root = document.documentElement;
      var edition = resolvedEdition();
      if (root.getAttribute(EDITION_ATTR) !== edition) {
        root.setAttribute(EDITION_ATTR, edition);
      }
      nudgeCaption(edition);
    }

    /* The desktop preload paints the native caption buttons (minimise, maximise,
       close) with `--dsw-specific-sidebar-fill` and their glyphs with
       `--dsw-alias-label-primary`. It re-reads both whenever `document.body`'s
       `style` attribute mutates, so writing a private custom property there is
       what makes the OS-drawn band follow the skin instead of staying at the
       desktop fallback (#1b1b1c / #f9fafb). */
    function nudgeCaption(edition) {
      try {
        if (document.body) {
          document.body.style.setProperty("--dsh-nebula-caption", edition);
        }
      } catch (error) {
        /* the preload also watches <head>, so this is only the quick path */
      }
    }

    function notify() {
      store.listeners.forEach(function (listener) {
        try {
          listener();
        } catch (error) {
          console.error("[nebula-spectrum] a settings row failed to refresh.", error);
        }
      });
    }

    function chooseEdition(edition) {
      if (EDITIONS.indexOf(edition) === -1) return;
      store.edition = edition;
      writeEdition(edition);
      applyEdition();
      notify();
    }

    function useStore() {
      var state = react.useState(0);
      var bump = state[1];
      react.useEffect(function () {
        var listener = function () {
          bump(function (value) {
            return value + 1;
          });
        };
        store.listeners.add(listener);
        return function () {
          store.listeners.delete(listener);
        };
      }, []);
      return store;
    }

    /* ---------- the edition picker ---------- */

    var ROW_CSS =
      ".nbx-group{display:flex;flex-direction:column;gap:8px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}" +
      ".nbx-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}" +
      ".nbx-hint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}" +
      ".nbx-row{display:flex;flex-wrap:wrap;align-items:stretch;gap:8px}" +
      ".nbx-cube{box-sizing:border-box;flex:1 1 132px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:14px 10px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-xl);background:0 0;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;transition:background-color .16s ease,border-color .16s ease}" +
      ".nbx-cube:hover{background:var(--dsw-alias-interactive-bg-hover)}" +
      ".nbx-cube[aria-pressed=true]{border-color:var(--dsw-alias-border-selected);background:var(--dsw-alias-bg-module-platform)}" +
      ".nbx-dot{width:34px;height:34px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18),0 1px 2px rgba(0,0,0,.18)}";

    function EditionRow(props) {
      var t = props.t;
      var state = useStore();
      var edition = state.edition;

      return h(
        "div",
        { className: "nbx-group" },
        h("style", { key: "css", dangerouslySetInnerHTML: { __html: ROW_CSS } }),
        h("div", { className: "nbx-title", key: "title" }, t("title")),
        h(
          "div",
          { className: "nbx-row", key: "row" },
          EDITIONS.map(function (id) {
            var pressed = edition === id;
            return h(
              "button",
              {
                key: id,
                type: "button",
                className: "nbx-cube",
                "aria-pressed": pressed ? "true" : "false",
                title: id === "auto" ? t("autoHint") : t(id),
                onClick: function () {
                  chooseEdition(id);
                },
              },
              h("span", {
                key: "dot",
                className: "nbx-dot",
                style: { backgroundImage: SWATCH[id] },
              }),
              h("span", { key: "label" }, t(id))
            );
          })
        ),
        h("div", { className: "nbx-hint", key: "hint" }, t("hint"))
      );
    }

    /* ---------- the skin layer ---------- */

    /* The stylesheet is mounted straight into <head>, not through a slot: the
       desktop preload watches `document.head` for child mutations, and that is
       the event that makes it repaint the native caption buttons. */
    function mountSkin() {
      if (typeof document === "undefined") return function () {};

      var previous = document.querySelector('style[data-nebula-style="true"]');
      if (previous) return function () { previous.remove(); };

      var element = document.createElement("style");
      element.setAttribute("data-nebula-style", "true");
      element.textContent = SKIN_CSS;
      document.head.appendChild(element);

      return function () {
        if (element.parentNode) element.parentNode.removeChild(element);
      };
    }

    function SkinLayer() {
      return h("div", { "data-nebula-edge": "true" });
    }

    /* ---------- mount ---------- */

    function apply(ctx) {
      try {
        ctx.effect(function () {
          return ctx.locale.register(NS, { zh: zh, en: en });
        }, "nebula-spectrum: dictionaries");

        var t = ctx.locale.bind(NS);

        ctx.effect(function () {
          var disposeSkin = mountSkin();
          store.scheme = schemeOf(ctx);
          applyEdition();

          var dispose = null;
          try {
            dispose = ctx.on("theme/change", function () {
              store.scheme = schemeOf(ctx);
              applyEdition();
              notify();
            });
          } catch (error) {
            console.error("[nebula-spectrum] could not follow the appearance setting.", error);
          }

          return function () {
            if (typeof dispose === "function") dispose();
            if (typeof disposeSkin === "function") disposeSkin();
            document.documentElement.removeAttribute(EDITION_ATTR);
          };
        }, "nebula-spectrum: edition");

        ctx.slots.inject("shell.overlay", function () {
          return ctx.slots.register(
            {
              name: "shell.overlay",
              id: "nebula-spectrum.skin",
              order: -30,
              label: function () {
                return t("title");
              },
            },
            function () {
              return h(SkinLayer, null);
            }
          );
        });

        ctx.slots.inject("settings.general.item", function () {
          return ctx.slots.register(
            {
              name: "settings.general.item",
              id: "nebula-spectrum.edition",
              order: 10.5,
            },
            function () {
              return h(EditionRow, { t: t });
            }
          );
        });
      } catch (error) {
        console.error(
          "[nebula-spectrum] mounting failed; the rest of the UI is unaffected.",
          error
        );
      }
    }

    exports.name = "nebula-spectrum";
    exports.inject = ["slots", "locale", "theme"];
    exports.apply = apply;

    return module.exports;
  },
});
