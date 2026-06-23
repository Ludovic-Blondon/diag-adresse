// One-shot generator for lib/communes-index.json.
//
// Downloads commune names from geo.api.gouv.fr, keeps only the curated set of
// codes (population >= 5000), and writes [[code, nom], ...] sorted by code.
// communes-index.json is the single source of truth for the commune list: the
// code set is read back from it on every run (annual COG update, name fixes).
//
//   node scripts/build-communes-index.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { slugifyCommune } from "../lib/slugify-commune.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(root, "lib/communes-index.json");

if (!existsSync(indexPath)) {
  throw new Error(
    "lib/communes-index.json manquant — restaurez-le depuis git avant de regenerer.",
  );
}
const codes = JSON.parse(readFileSync(indexPath, "utf8")).map(([code]) => code);
const wanted = new Set(codes);

const res = await fetch(
  "https://geo.api.gouv.fr/communes?fields=code,nom&format=json",
);
if (!res.ok) throw new Error(`geo.api.gouv.fr ${res.status}`);
const all = await res.json();

const index = all
  .filter((c) => wanted.has(c.code))
  .map((c) => [c.code, c.nom])
  .sort((a, b) => a[0].localeCompare(b[0]));

if (index.length !== wanted.size) {
  const found = new Set(index.map(([code]) => code));
  const missing = [...wanted].filter((c) => !found.has(c));
  console.warn(
    `⚠️  ${index.length}/${wanted.size} communes resolues. Manquants: ${missing.join(", ")}`,
  );
}

// Guard: the shared slugifyCommune must keep producing these canonical forms.
for (const [input, expected] of [
  ["L'Haÿ-les-Roses", "l-hay-les-roses"],
  ["Œuilly", "oeuilly"],
  ["Ajaccio", "ajaccio"],
]) {
  const got = slugifyCommune(input);
  if (got !== expected) {
    throw new Error(
      `slug assertion: "${input}" -> "${got}" (attendu "${expected}")`,
    );
  }
}

writeFileSync(indexPath, JSON.stringify(index) + "\n");
console.log(`✅ lib/communes-index.json : ${index.length} communes`);
