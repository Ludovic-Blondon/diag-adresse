// One-shot generator for lib/communes-index.json.
//
// Downloads commune names from geo.api.gouv.fr, keeps only the curated set of
// codes (population >= 5000), and writes [[code, nom], ...] sorted by code.
// communes-index.json is the single source of truth for the commune list:
// on re-run (annual COG update, name fixes) the code set is read back from it.
// Bootstrap falls back to the legacy lib/sitemap-communes.json when the index
// does not exist yet.
//
//   node scripts/build-communes-index.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(root, "lib/communes-index.json");
const legacyPath = join(root, "lib/sitemap-communes.json");

const codes = existsSync(indexPath)
  ? JSON.parse(readFileSync(indexPath, "utf8")).map(([code]) => code)
  : JSON.parse(readFileSync(legacyPath, "utf8"));
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

// Self-check: this slug logic must stay in sync with slugifyCommune (lib/commune-url.ts).
const slugifyCommune = (name) =>
  name
    .replace(/[œŒ]/g, "oe")
    .replace(/[æÆ]/g, "ae")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

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
