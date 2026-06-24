import fs from "node:fs";
import path from "node:path";
import { getDepartementCode } from "../departements";
import { toHubeauCode } from "../paris";

// Contrat de sortie du pipeline `scripts/argile/compute_rga_diff.py`.
// Les fichiers (lib/argile/diff/<dep>.json, lib/argile/summary.json) sont
// générés en local et committés ; absents tant que le calcul n'a pas tourné.

export interface ArgileClassStats {
  /** classe d'aléa maximale présente : 0 nulle · 1 faible · 2 moyenne · 3 forte */
  max: number;
  /** % de la surface communale en aléa moyen+fort */
  pctMF: number;
  /** classe majoritaire en surface */
  maj: number;
}

export interface CommuneArgileDiff {
  /** nom de la commune (embarqué pour rendre les pages autonomes) */
  n: string;
  a20: ArgileClassStats;
  a26: ArgileClassStats;
  /** delta de classe max : a26.max - a20.max */
  d: number;
}

export type DepartementDiff = Record<string, CommuneArgileDiff>;

export interface ArgileSummary {
  national: {
    /** nb de communes en exposition max moyenne/forte, par millésime */
    a20MF: number;
    a26MF: number;
    /** nb total de communes analysées */
    n: number;
    /** nb de communes dont la classe max augmente / baisse / stagne */
    up: number;
    down: number;
    same: number;
  };
  departements: Record<
    string,
    { n: number; up: number; down: number; same: number }
  >;
}

const ARGILE_DIR = path.join(process.cwd(), "lib", "argile");

/** Libellés des classes d'exposition de la carte RGA. */
export const ARGILE_LEVEL_LABELS: Record<number, string> = {
  0: "nulle ou très faible",
  1: "faible",
  2: "moyenne",
  3: "forte",
};

export function argileLevelLabel(n: number): string {
  return ARGILE_LEVEL_LABELS[n] ?? "inconnue";
}

// --- Consommateurs build-time (SSG : b1, b2). fs sur les fichiers du repo. ---

function readJsonAtBuild<T>(relPath: string): T | null {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(ARGILE_DIR, relPath), "utf-8"),
    ) as T;
  } catch {
    return null;
  }
}

/** Synthèse nationale + par département (b1). null si le calcul n'a pas tourné. */
export function getArgileSummary(): ArgileSummary | null {
  return readJsonAtBuild<ArgileSummary>("summary.json");
}

/** Liste des départements pour lesquels un diff existe (b2 generateStaticParams). */
export function listAvailableDepartements(): string[] {
  try {
    return fs
      .readdirSync(path.join(ARGILE_DIR, "diff"))
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""))
      .sort();
  } catch {
    return [];
  }
}

/** Diff complet d'un département, lu au build (b2). null si absent. */
export function loadDepartementDiff(dep: string): DepartementDiff | null {
  return readJsonAtBuild<DepartementDiff>(`diff/${dep}.json`);
}

// --- Consommateur runtime (badge sur les pages commune, ISR). ---
// Import dynamique : Next trace et embarque le JSON dans le bundle serverless,
// contrairement à un fs.readFileSync(cwd) au runtime. try/catch => silencieux
// si le département n'est pas couvert ou si le calcul n'a pas encore tourné.

export async function getCommuneArgileDiff(
  codeInsee: string,
): Promise<{ diff: CommuneArgileDiff; dep: string } | null> {
  const insee = toHubeauCode(codeInsee); // arrondissements -> commune englobante
  const dep = getDepartementCode(insee);
  try {
    const mod = (await import(`./diff/${dep}.json`)) as {
      default: DepartementDiff;
    };
    const diff = mod.default[insee];
    return diff ? { diff, dep } : null;
  } catch {
    return null;
  }
}
