// Builds client.js by inlining src/skin.css into src/client.template.js.
//
// The stylesheet is inserted with JSON.stringify, never by string replacement
// of $-patterns, so the CSS cannot be mangled on the way in.
//
// Usage: node build.js

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(root, "src", "client.template.js"), "utf8");
const skin = readFileSync(join(root, "src", "skin.css"), "utf8");

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

const placeholder = "__SKIN_CSS__";
const marker = `var SKIN_CSS = ${placeholder};`;

if (!template.includes(marker)) {
  throw new Error(`build: template is missing the marker ${marker}`);
}

const client = template.replace(marker, `var SKIN_CSS = ${JSON.stringify(armedCss)};`);

writeFileSync(join(root, "client.js"), client, "utf8");

console.log(
  `build: client.js written (${client.length} bytes, ${armedCss.length} bytes of CSS, ${armed} declarations armed)`
);
