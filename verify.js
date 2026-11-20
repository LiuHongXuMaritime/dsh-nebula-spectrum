// Syntax-checks client.js without executing it, and reports a few build facts.

import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));
const clientPath = join(root, "client.js");
const source = readFileSync(clientPath, "utf8");

new vm.Script(source, { filename: clientPath });

const facts = {
  bytes: statSync(clientPath).size,
  parses: true,
  hasLoader: source.includes("window.__ModuleLoader__.load"),
  hasSkin: source.includes("--nb-canvas"),
  leftoverMarker: source.includes("__SKIN_CSS__"),
  dswVars: (source.match(/--dsw-[a-zA-Z0-9-]+/g) || []).length,
  important: (source.match(/!important/g) || []).length,
  editionGates: (source.match(/data-nebula-edition/g) || []).length,
};

console.log(JSON.stringify(facts, null, 2));
