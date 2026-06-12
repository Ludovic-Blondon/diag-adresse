// Garde-fou P0-1 : detecte les mots francais non accentues dans le texte
// destine au rendu (litteraux de chaines et texte JSX). Les slugs, cles,
// classes CSS et URLs (chaines sans espace ni apostrophe) sont ignores.
// Echappatoire ponctuelle : ajouter `accents-ok` en commentaire sur la ligne.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

const TARGETS = [
  { dir: "lib", exts: [".ts"] },
  { dir: "app", exts: [".ts", ".tsx"] },
  { dir: "components", exts: [".tsx"] },
];

const EXCLUDED = new Set(["lib/slug.ts"]);

// Mots interdits (formes non accentuees), frontieres de mots, insensible a la casse.
const FORBIDDEN = [
  "qualite",
  "detail",
  "details",
  "seisme",
  "secheresse",
  "reglementation",
  "reglementaire",
  "energetique",
  "energie",
  "departement",
  "region",
  "consequence",
  "cout",
  "etude",
  "prevention",
  "donnee",
  "donnees",
  "prelevement",
  "parametre",
  "parametres",
  "etiquette",
  "emission",
  "conformite",
  "geotechnique",
  "francais",
  "francaise",
  "arrete",
  "propriete",
  "securite",
  "sante",
  "verifiez",
  "reessayer",
  "negligeable",
  "repertoriee",
  "identifie",
  "frequentes",
];

// Frontieres Unicode : "é" est une lettre, donc "écouté" ne declenche pas "cout".
const FORBIDDEN_RE = new RegExp(
  `(?<![\\p{L}\\p{N}_])(?:${FORBIDDEN.join("|")})(?![\\p{L}\\p{N}_])`,
  "giu",
);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function collectFiles() {
  const files = [];
  for (const { dir, exts } of TARGETS) {
    for (const file of walk(join(ROOT, dir))) {
      const rel = relative(ROOT, file).split(sep).join("/");
      if (EXCLUDED.has(rel)) continue;
      if (exts.some((ext) => file.endsWith(ext))) files.push({ file, rel });
    }
  }
  return files;
}

/**
 * Decide si un litteral de chaine doit etre scanne.
 * - Texte avec espace ou apostrophe = prose visible.
 * - Mot unique entierement composé de lettres et commençant par une majuscule
 *   (ex. "Seisme", "Turbidite") = libelle probable : les slugs, cles et classes
 *   Tailwind sont en minuscules, donc exclus.
 * Les autres mono-mots (slugs, cles, URLs, classes, codes) sont ignores.
 */
function looksLikeRenderedText(text) {
  if (/[ '’]/.test(text)) return true;
  return /^\p{Lu}\p{L}*$/u.test(text);
}

function checkFile(file, rel) {
  const source = readFileSync(file, "utf8");
  const lines = source.split("\n");
  const sf = ts.createSourceFile(
    rel,
    source,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    rel.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const violations = [];

  function report(text, startPos) {
    FORBIDDEN_RE.lastIndex = 0;
    for (const match of text.matchAll(FORBIDDEN_RE)) {
      const pos = startPos + match.index;
      const { line } = sf.getLineAndCharacterOfPosition(pos);
      if (lines[line].includes("accents-ok")) continue;
      violations.push({
        line: line + 1,
        word: match[0],
        excerpt: lines[line].trim().slice(0, 80),
      });
    }
  }

  function visit(node) {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      if (looksLikeRenderedText(node.text)) {
        report(node.text, node.getStart(sf) + 1);
      }
    } else if (ts.isJsxText(node)) {
      // Texte JSX : toujours rendu, pas de filtre anti-slug.
      report(node.text, node.getStart(sf));
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return violations;
}

let total = 0;
for (const { file, rel } of collectFiles()) {
  for (const v of checkFile(file, rel)) {
    total++;
    console.log(`${rel}:${v.line} — ${v.word} — ${v.excerpt}`);
  }
}

if (total > 0) {
  console.error(`\n${total} violation(s) : mots francais non accentues.`);
  process.exit(1);
}
console.log("check-accents : aucune violation.");
