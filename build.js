// Builds client.js by inlining the stylesheet and the edition metadata into
// src/client.template.js.
//
// The CSS is inserted with JSON.stringify, never by string replacement of
// $-patterns, so it cannot be mangled on the way in.
//
// Usage: node build.js

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(root, "src", "client.template.js"), "utf8");

let skin = readFileSync(join(root, "src", "skin.css"), "utf8");

// The palette editions are generated from the PI plugin by scripts/sync-pi.mjs
// and concatenated here, so a PI release is one command away from a DSH skin.
const generatedPath = join(root, "src", "editions.generated.css");
if (!skin.includes("/* @@GENERATED@@") || !existsSync(generatedPath)) {
  throw new Error("build: run `node scripts/sync-pi.mjs <piplug>` to generate src/editions.generated.css");
}
skin = skin.replace(/\/\* @@GENERATED@@[^\n]*\n/, readFileSync(generatedPath, "utf8"));

// The host applies its theme tokens as inline styles on <body>, and an inline
// declaration outranks any normal author declaration. An `!important` author
// declaration outranks that inline style, so every custom property in the
// edition blocks is armed here instead of in the source, where 600 repetitions
// of `!important` would bury the palette.
const DECLARATION = /(^|\n)([ \t]*)(--[A-Za-z0-9_-]+)[ \t]*:[ \t]*([^;]*?)[ \t]*;/g;

let armed = 0;
const armedCss = skin.replace(DECLARATION, (match, lead, indent, name, value) => {
  if (value.includes("!important")) return match;
  armed += 1;
  return `${lead}${indent}${name}: ${value} !important;`;
});

const editionsPath = join(root, "src", "editions.json");
if (!existsSync(editionsPath)) {
  throw new Error("build: src/editions.json is missing (regenerate it with scripts/sync-pi.mjs)");
}
const editions = JSON.parse(readFileSync(editionsPath, "utf8"));

const cssMarker = `var SKIN_CSS = __SKIN_CSS__;`;
const editionsMarker = `var EDITIONS = __EDITIONS_JSON__;`;

for (const marker of [cssMarker, editionsMarker]) {
  if (!template.includes(marker)) throw new Error(`build: template is missing the marker ${marker}`);
}

const client = template
  .replace(cssMarker, `var SKIN_CSS = ${JSON.stringify(armedCss)};`)
  .replace(editionsMarker, `var EDITIONS = ${JSON.stringify(editions)};`);

writeFileSync(join(root, "client.js"), client, "utf8");

console.log(
  `build: client.js written (${client.length} bytes, ${armedCss.length} bytes of CSS, ${editions.length} editions, ${armed} declarations armed)`
);
