/* Regenerates the palette editions of the DSH skin from the PI-Desktop theme.
 *
 * Usage: node scripts/sync-pi.mjs "<path to local.nebula-spectrum-x.y.z.piplug or its content dir>"
 *
 * The DSH skin keeps two hand-tuned editions (`nebula`, `light`) whose tokens
 * were mapped by hand; this script only derives the *palette* editions that PI
 * ships as data. It reads the manifest for ids, bases and labels, parses each
 * theme CSS for its token block and its surface rules, and writes
 *
 *   src/editions.generated.css   one block per generated edition
 *   src/editions.json            metadata for every edition, curated ones kept
 *
 * so that a PI release can be picked up with one command and no hand editing.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const CURATED = new Set(["nebula", "nebula-light"]);

/* ---------------------------------------------------------------- utilities */

const hexToRgb = (hex) => {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
};

const isHex = (value) => /^#[0-9a-f]{3,8}$/i.test(value.trim());
const isRgba = (value) => /^rgba?\(/i.test(value.trim());

/** `mix` in plain sRGB — close enough for ramp steps nobody compares side by side. */
function mix(a, b, t) {
  const [r1, g1, b1] = isHex(a) ? hexToRgb(a) : hexToRgb("#000000");
  const [r2, g2, b2] = isHex(b) ? hexToRgb(b) : hexToRgb("#ffffff");
  const channel = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return "#" + channel(r1, r2) + channel(g1, g2) + channel(b1, b2);
}

/** Re-alpha any colour the source uses, so derived tints keep a sane hue. */
function withAlpha(color, alpha) {
  const value = color.trim();
  if (isHex(value)) {
    const [r, g, b] = hexToRgb(value);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  }
  const numbers = value.match(/[\d.]+/g);
  if (numbers && numbers.length >= 3) {
    return `rgba(${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${alpha.toFixed(2)})`;
  }
  return value;
}

/** Splits a comma-separated shorthand on the top level (not inside parens). */
function splitTopLevel(value) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const char of value) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/** `1px solid rgba(...)` → `rgba(...)`; a plain colour is returned as is. */
function colorOfBorder(value) {
  const match = /(?:^|\s)((?:#[0-9a-f]{3,8})|(?:rgba?\([^)]*\)))/i.exec(value);
  return match ? match[1] : value.trim();
}

/** The first colour inside a box-shadow shorthand. */
function colorOfShadow(value) {
  const match = /((?:#[0-9a-f]{3,8})|(?:rgba?\([^)]*\)))/i.exec(value);
  return match ? match[1] : "";
}

/* ------------------------------------------------------------------ parsing */

function parseTheme(source) {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const prefix = /^.*?:root\[data-theme\]\[data-plugin-theme="[^"]+"\]\s*/;

  const rules = new Map();
  const leftovers = [];
  for (const match of withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1]
      .split(",")
      .map((part) => part.trim().replace(/^:root\[data-theme\]\[data-plugin-theme="[^"]+"\]\s*/, "").trim())
      .filter(Boolean)
      .join(", ");
    const declarations = new Map();
    for (const declaration of match[2].split(";")) {
      const separator = declaration.indexOf(":");
      if (separator < 0) continue;
      const property = declaration.slice(0, separator).trim();
      const value = declaration.slice(separator + 1).trim();
      if (property && value) declarations.set(property, value);
    }
    if (!rules.has(selector)) rules.set(selector, declarations);
    else for (const [property, value] of declarations) rules.get(selector).set(property, value);
  }

  const tokens = {};
  for (const [selector, declarations] of rules) {
    if (selector !== "") continue;
    for (const [property, value] of declarations) {
      if (property.startsWith("--")) tokens[property] = value;
    }
  }

  const get = (selector, property) => {
    const declarations = rules.get(selector);
    return declarations ? declarations.get(property) : undefined;
  };

  const titlebarShadow = get(".main-titlebar, .conversation-topbar", "box-shadow") || "";

  return {
    tokens,
    canvas: get(".app-shell", "background-color") || "",
    aurora: get(".app-shell", "background-image") || "",
    edge: get(".app-shell::before", "background") || "",
    edgeOpacity: get(".app-shell::before", "opacity") || "0.7",
    sheet: get(".main-pane", "background-color") || "",
    sheetWash: get(".main-pane", "background-image") || "",
    titlebarLine: colorOfShadow(titlebarShadow),
    sideTint: get(".sidebar-surface", "background-color") || "",
    sideGlow: get(".sidebar-surface", "background-image") || "",
    sideHairline: colorOfBorder(get(".sidebar-surface", "border-inline-end") || ""),
    composer: splitTopLevel(get(".composer-shell", "background-image") || ""),
    composerFocus: splitTopLevel(get(".composer-shell:focus-within", "background-image") || ""),
    composerShadow: get(".composer-shell", "box-shadow") || "",
    composerShadowFocus: get(".composer-shell:focus-within", "box-shadow") || "",
    bubble: get(".message-row.user .message-bubble", "background") || "",
    bubbleInk: get(".message-row.user .message-bubble", "color") || get(".message-row.user .message-user-text", "color") || "",
    bubbleShadow: get(".message-row.user .message-bubble", "box-shadow") || "",
    send: get(".send-btn", "background") || "",
    sendInk: get(".send-btn", "color") || "",
    sendShadow: get(".send-btn", "box-shadow") || "",
    sendShadowHover: get(".send-btn:hover", "box-shadow") || "",
    codeBg: get(".code-block", "background") || "",
    codeShadow: get(".code-block", "box-shadow") || "",
    codeBand: get(".code-block-head", "background-image") || "",
    selectBg: get("::selection", "background") || "",
    selectInk: get("::selection", "color") || "",
    background: { leftovers },
  };
}

/* ------------------------------------------------------------------ mapping */

function mapTheme(parsed, base) {
  const token = (name) => parsed.tokens["--" + name] || "";
  const gray = (step) => token("gray-" + step);

  const canvas = parsed.canvas || token("ds-bg-primary");
  const sheet = parsed.sheet || token("ds-bg-primary");
  const accent = token("ds-accent");
  const accentHover = token("ds-accent-hover");
  const accentSoft = token("ds-accent-soft");
  const info = token("ds-info");
  const success = token("ds-success");
  const warning = token("ds-warning");
  const error = token("ds-error");
  const purple = token("ds-purple");
  const ink = token("ds-text-primary");
  const white = "#ffffff";
  const black = "#000000";

  /* The PI ramp has 13 steps; the DSH ramps use more, so the in-between steps
     are interpolated from their neighbours. */
  const ramp = {
    0: gray(0),
    50: gray(50),
    55: mix(gray(50), gray(75), 0.35),
    60: mix(gray(50), gray(75), 0.6),
    75: gray(75),
    90: mix(gray(75), gray(100), 0.55),
    100: gray(100),
    150: mix(gray(100), gray(300), 0.25),
    200: mix(gray(100), gray(300), 0.5),
    300: gray(300),
    310: mix(gray(300), gray(500), 0.05),
    400: mix(gray(300), gray(500), 0.45),
    500: gray(500),
    600: gray(600),
    700: gray(700),
    750: gray(750),
    800: gray(800),
    850: mix(gray(800), gray(900), 0.35),
    875: mix(gray(800), gray(900), 0.55),
    900: gray(900),
    950: mix(gray(900), gray(1000), 0.4),
    1000: gray(1000),
  };

  const neutral = {
    0: ramp[0],
    50: ramp[50],
    100: ramp[100],
    150: ramp[150],
    200: ramp[200],
    250: mix(ramp[200], ramp[300], 0.55),
    300: ramp[300],
    400: ramp[400],
    500: ramp[500],
    550: mix(ramp[500], ramp[600], 0.45),
    600: ramp[600],
    700: ramp[700],
    800: ramp[800],
    850: ramp[850],
    900: ramp[900],
    1000: ramp[1000],
  };

  const accentRing = {
    50: token("accent-50"),
    100: token("accent-100"),
    200: mix(token("accent-100"), token("accent-300"), 0.5),
    300: token("accent-300"),
    400: accentHover,
    450: accent,
    500: accent,
    600: accentSoft,
    800: token("accent-900"),
    900: token("accent-900"),
  };

  const blue = {
    50: mix(info, canvas, 0.9),
    75: mix(info, canvas, 0.78),
    "50p": mix(info, canvas, 0.88),
    100: mix(info, canvas, 0.68),
    300: mix(info, base === "light" ? white : canvas, 0.35),
    400: info,
    450: info,
    500: info,
    600: mix(info, black, 0.12),
    800: mix(info, black, 0.55),
    900: mix(info, black, 0.65),
    950: mix(info, black, 0.75),
  };

  const green = {
    100: mix(success, base === "light" ? white : canvas, 0.78),
    400: success,
    500: success,
    900: mix(success, black, 0.72),
  };
  const amber = {
    100: mix(warning, base === "light" ? white : canvas, 0.78),
    400: warning,
    500: warning,
    600: mix(warning, black, 0.12),
    900: mix(warning, black, 0.78),
  };
  const red = {
    50: mix(error, base === "light" ? white : canvas, 0.9),
    100: mix(error, base === "light" ? white : canvas, 0.8),
    400: error,
    500: mix(error, black, 0.1),
    600: mix(error, black, 0.22),
    900: mix(error, black, 0.78),
  };
  const violet = { 400: purple, 600: mix(purple, black, 0.22) };

  const lines = [];
  const push = (name, value) => {
    if (value !== undefined && value !== null && value !== "") lines.push([name, value]);
  };

  /* the frame's ::before strip is sampled for the native caption buttons, so it
     must be opaque: the PI sidebar colour already is. */
  const caption = token("ds-bg-sidebar");

  const surfaces = {
    "--nb-canvas": canvas,
    "--nb-aurora": parsed.aurora,
    "--nb-side-tint": parsed.sideTint,
    "--nb-side-glow": parsed.sideGlow,
    "--nb-side-hairline": parsed.sideHairline,
    "--nb-titlebar": caption,
    "--nb-titlebar-line": parsed.titlebarLine,
    "--nb-sheet": sheet,
    "--nb-sheet-wash": parsed.sheetWash,
    "--nb-card-fill": parsed.composer[0] || "",
    "--nb-card-rim": parsed.composer[1] || parsed.composer[0] || "",
    "--nb-card-fill-focus": parsed.composerFocus[0] || parsed.composer[0] || "",
    "--nb-card-rim-focus": parsed.composerFocus[1] || parsed.composer[1] || "",
    "--nb-card-shadow": parsed.composerShadow,
    "--nb-card-shadow-focus": parsed.composerShadowFocus,
    "--nb-send": parsed.send,
    "--nb-send-ink": parsed.sendInk,
    "--nb-send-shadow": parsed.sendShadow,
    "--nb-send-shadow-hover": parsed.sendShadowHover,
    "--nb-bubble": parsed.bubble,
    "--nb-bubble-ink": parsed.bubbleInk,
    "--nb-bubble-shadow": parsed.bubbleShadow,
    "--nb-code-bg": parsed.codeBg,
    "--nb-code-shadow": parsed.codeShadow,
    "--nb-code-band": parsed.codeBand,
    "--nb-edge": parsed.edge,
    "--nb-edge-opacity": parsed.edgeOpacity,
    "--nb-select-bg": parsed.selectBg,
    "--nb-select-ink": parsed.selectInk,
  };
  for (const [name, value] of Object.entries(surfaces)) push(name, value);

  /* the host spells its lightest steps `-00`, not `-0` */
  const stepName = (step) => (step === "0" ? "00" : step);
  for (const [step, value] of Object.entries(ramp)) push(`--dsw-static-neutral-bluish-${stepName(step)}`, value);
  for (const [step, value] of Object.entries(neutral)) push(`--dsw-static-neutral-${stepName(step)}`, value);
  for (const [step, value] of Object.entries(accentRing)) push(`--dsw-static-deepseek-${step}`, value);
  for (const [step, value] of Object.entries(blue)) push(`--dsw-static-blue-${step}`, value);
  for (const [step, value] of Object.entries(green)) push(`--dsw-static-green-${step}`, value);
  for (const [step, value] of Object.entries(amber)) push(`--dsw-static-amber-${step}`, value);
  for (const [step, value] of Object.entries(red)) push(`--dsw-static-red-${step}`, value);
  for (const [step, value] of Object.entries(violet)) push(`--dsw-static-violet-${step}`, value);

  const aliases = {
    "--dsw-alias-bg-base": token("ds-bg-primary"),
    "--dsw-alias-bg-layer-1": token("ds-bg-secondary"),
    "--dsw-alias-bg-layer-2": token("ds-bg-tertiary"),
    "--dsw-alias-bg-layer-3": token("ds-bg-elevated-opaque"),
    "--dsw-alias-bg-overlay": token("ds-bg-elevated-primary"),
    "--dsw-alias-bg-module-platform": token("ds-bg-active"),
    "--dsw-alias-bg-skeleton": token("ds-tile"),
    "--dsw-alias-bg-multi-select": token("ds-bg-chip"),
    "--dsw-alias-border-l1": token("ds-border-subtle"),
    "--dsw-alias-border-l2": token("ds-border-default"),
    "--dsw-alias-border-l3": token("ds-border-strong"),
    "--dsw-alias-border-l4": token("ds-border-strong"),
    "--dsw-alias-border-selected": accent,
    "--dsw-alias-card-fill": token("ds-tile"),
    "--dsw-alias-card-fill-hover": token("ds-tile-hover"),
    "--dsw-alias-card-tile-fill": token("ds-tile"),
    "--dsw-alias-hovercard-bg": token("ds-raised"),
    "--dsw-alias-label-primary": ink,
    "--dsw-alias-label-primary-bluish": ink,
    "--dsw-alias-label-secondary": token("ds-text-secondary"),
    "--dsw-alias-label-tertiary": token("ds-text-muted"),
    "--dsw-alias-label-caption": token("ds-text-muted"),
    "--dsw-alias-label-dimmed": token("ds-text-faint"),
    "--dsw-alias-label-primary-dimmed": ramp[300],
    "--dsw-alias-brand-primary": accent,
    "--dsw-alias-brand-text": accent,
    "--dsw-alias-link": info,
    "--dsw-alias-state-success-primary": success,
    "--dsw-alias-state-success-secondary": withAlpha(success, 0.18),
    "--dsw-alias-state-success-tertiary": withAlpha(success, 0.1),
    "--dsw-alias-state-warn-primary": warning,
    "--dsw-alias-state-warn-secondary": withAlpha(warning, 0.18),
    "--dsw-alias-state-warn-tertiary": withAlpha(warning, 0.1),
    "--dsw-alias-state-warn-label": warning,
    "--dsw-alias-state-error-primary": error,
    "--dsw-alias-state-error-secondary": withAlpha(error, 0.18),
    "--dsw-alias-state-idle-primary": ramp[500],
    "--dsw-alias-state-done-primary": purple,
    "--dsw-alias-state-business-primary": accent,
    "--dsw-alias-state-business-tertiary": token("ds-bg-active"),
    "--dsw-alias-button-info-fill": accent,
    "--dsw-alias-button-info-hover": accentHover,
    "--dsw-alias-button-primary-fill": accent,
    "--dsw-alias-button-primary-hover": accentHover,
    "--dsw-alias-button-elevated-fill": token("ds-raised"),
    "--dsw-alias-button-floating-fill": token("ds-bg-elevated"),
    "--dsw-alias-button-floating-hover": token("ds-bg-elevated-opaque"),
    "--dsw-alias-interactive-bg-hover": token("ds-bg-hover"),
    "--dsw-alias-interactive-bg-active": token("ds-bg-active"),
    "--dsw-alias-interactive-bg-hover-solid": token("ds-raised"),
    "--dsw-alias-switch-thumb": token("ds-switch-knob-off"),
    "--dsw-alias-scrollbar-bg-l1": token("ds-tile-hover"),
    "--dsw-alias-scrollbar-bg-l2": ramp[600],
    "--dsw-alias-scrollbar-hover-l1": token("ds-bg-active"),
    "--dsw-alias-scrollbar-hover-l2": ramp[500],
    "--dsw-alias-markdown-code-block": token("ds-mermaid-canvas"),
    "--dsw-alias-markdown-code-block-banner": token("ds-code-head-bg"),
    "--dsw-alias-markdown-inline-code": token("ds-tile"),
    "--dsw-alias-markdown-tag": token("ds-tile-hover"),
    "--dsw-alias-markdown-citation": ramp[300],
    "--dsw-alias-markdown-placeholder": ramp[600],
    "--dsw-alias-markdown-code-segment-selected": token("ds-raised"),
    "--dsw-alias-markdown-code-segment-unselected": token("ds-mermaid-canvas"),
    "--dsw-alias-tooltip-bg": ramp[750],
    "--dsw-alias-tooltip-label": ink,
    "--dsw-alias-toast-bg": token("ds-raised"),
    "--dsw-alias-toast-label": ink,
    "--dsw-alias-trajectory-accent": info,
    "--dsw-alias-turn-trigger-bg": token("ds-tile"),
    "--dsw-alias-turn-trigger-bg-hover": token("ds-tile-hover"),
    "--dsw-alias-menu-group-header-fill": token("ds-tile"),
    "--dsw-alias-menu-icon": ramp[300],
    "--dsw-alias-code-diff-added": withAlpha(success, 0.16),
    "--dsw-alias-code-diff-deleted": withAlpha(error, 0.16),
    "--dsw-alias-chart-messages": accent,
    "--dsw-alias-chart-system": ramp[300],
    "--dsw-alias-chart-tools": purple,
    "--dsw-specific-sidebar-fill": caption,
    "--dsw-specific-sidebar-nav-item-active": token("ds-settings-nav-active"),
    "--dsw-specific-sidebar-nav-item-active-accent": accent,
    "--dsw-specific-bubble": token("ds-raised"),
    "--dsw-specific-bubble-highlight": token("ds-bg-tertiary"),
    "--dsw-specific-input-major": token("ds-bg-composer"),
    "--dsw-specific-menu": token("ds-bg-elevated-primary"),
    "--dsw-menu-surface-fill": token("ds-bg-elevated-primary"),
    "--dsw-specific-selector": token("ds-bg-elevated"),
    "--dsw-specific-tip": token("ds-bg-elevated"),
    "--dsw-specific-file-upload-track": token("ds-border-subtle"),
  };
  for (const [name, value] of Object.entries(aliases)) push(name, value);

  return lines;
}

/* ------------------------------------------------------------------- output */

function emitBlock(id, base, name, parsed) {
  const lines = mapTheme(parsed, base);
  const declaration = lines
    .map(([property, value]) => `  ${property}: ${String(value).replace(/\s*\n\s*/g, " ").trim()};`)
    .join("\n");
  /* the colour scheme is not repeated here: the client sets
     `data-nebula-scheme` from `editions.json`, and the scaffolding keys
     `color-scheme` off that attribute for every edition alike. */
  return `/* ---------- edition: ${id} (${name}) — generated from a PI palette ---------- */
html[data-nebula-edition="${id}"] body {
${declaration}
}

`;
}

function swatchFor(parsed, base) {
  const canvas = parsed.canvas || parsed.tokens["--ds-bg-primary"] || "#111111";
  const accent = parsed.tokens["--ds-accent"] || "#888888";
  const mid = mix(canvas, accent, 0.35);
  return `linear-gradient(135deg, ${canvas}, ${mid} 58%, ${accent})`;
}

/* --------------------------------------------------------------------- main */

const argument = process.argv[2];
if (!argument) {
  console.error("usage: node scripts/sync-pi.mjs <piplug file or extracted theme dir>");
  process.exit(2);
}

let sourceDir = argument;
if (statSync(sourceDir).isFile()) {
  const scratch = join(ROOT, "node_modules", ".cache", "nebula-piplug");
  rmSync(scratch, { recursive: true, force: true });
  mkdirSync(scratch, { recursive: true });
  const copied = join(scratch, "plugin.zip");
  writeFileSync(copied, readFileSync(sourceDir));
  const { execFileSync } = await import("node:child_process");
  execFileSync("tar", ["-xf", copied, "-C", scratch], { stdio: "inherit" });
  sourceDir = scratch;
}

const manifestPath = join(sourceDir, "manifest.json");
if (!existsSync(manifestPath)) {
  console.error("no manifest.json in " + sourceDir);
  process.exit(2);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const themes = manifest.contributes && manifest.contributes.themes ? manifest.contributes.themes : [];

const labels = {
  nebula: { zh: "光谱·青蓝", en: "Indigo" },
  "nebula-light": { zh: "光谱·彩虹", en: "Rainbow" },
  "nebula-sunrise": { zh: "光谱·暖阳", en: "Sunrise" },
  "nebula-glacier": { zh: "光谱·冰蓝", en: "Glacier" },
  "nebula-rose": { zh: "光谱·玫瑰", en: "Rose" },
  "nebula-ember": { zh: "光谱·余烬", en: "Ember" },
  "nebula-crimson": { zh: "光谱·朱红", en: "Crimson" },
  "nebula-neon": { zh: "光谱·霓虹", en: "Neon" },
};

const editionsPath = join(ROOT, "src", "editions.json");
const previous = existsSync(editionsPath) ? JSON.parse(readFileSync(editionsPath, "utf8")) : [];
const previousById = new Map(previous.map((entry) => [entry.id, entry]));

const blocks = [];
const meta = [];
for (const theme of themes) {
  const file = join(sourceDir, theme.path);
  if (!existsSync(file)) {
    console.warn("skip (missing) " + theme.id);
    continue;
  }
  const parsed = parseTheme(readFileSync(file, "utf8"));
  const base = theme.base === "light" ? "light" : "dark";
  const curated = CURATED.has(theme.id);
  const names = labels[theme.id] || { zh: theme.label, en: theme.label };
  const swatch = swatchFor(parsed, base);

  if (!curated) blocks.push(emitBlock(theme.id, base, names.en, parsed));

  const before = previousById.get(theme.id) || {};
  meta.push({
    id: theme.id,
    zh: names.zh,
    en: names.en,
    base,
    group: base === "light" ? "light" : "dark",
    curated,
    swatch: curated && before.swatch ? before.swatch : swatch,
  });
  console.log(`${curated ? "curated " : "generated"} ${theme.id} (${base}) ${parsed.aurora ? "aurora ok" : "AURORA MISSING"}`);
}

writeFileSync(join(ROOT, "src", "editions.generated.css"), blocks.join(""), "utf8");
writeFileSync(editionsPath, JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log(`\nwrote ${blocks.length} generated edition(s) and ${meta.length} metadata entr(ies); source ${manifest.version}`);
