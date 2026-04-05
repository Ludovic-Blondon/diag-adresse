import type { RiskLevel } from "./constants";
import type {
  RiskReport,
  RadonData,
  RGAData,
  SeismicData,
  ICPEData,
  CaviteData,
} from "./types/georisques";

export interface ScoredRisk {
  id: string;
  label: string;
  level: RiskLevel;
  description: string;
  details?: string;
}

// --- Seisme ---

export function scoreSeismic(data: SeismicData): ScoredRisk {
  const zone = data.data?.[0]?.code_zone ?? 1;
  const map: Record<number, RiskLevel> = {
    1: "negligeable",
    2: "faible",
    3: "moyen",
    4: "fort",
    5: "fort",
  };
  return {
    id: "seisme",
    label: "Seisme",
    level: map[zone] ?? "negligeable",
    description: `Zone de sismicite ${zone}/5`,
  };
}

// --- Radon ---

export function scoreRadon(data: RadonData): ScoredRisk {
  const classe = data.data?.[0]?.classe_potentiel ?? 1;
  const map: Record<number, RiskLevel> = {
    1: "faible",
    2: "moyen",
    3: "fort",
  };
  return {
    id: "radon",
    label: "Radon",
    level: map[classe] ?? "faible",
    description: `Potentiel radon classe ${classe}/3`,
  };
}

// --- RGA (argile) ---

export function scoreRGA(data: RGAData): ScoredRisk {
  const expo = data.data?.[0]?.exposition;
  if (expo == null) {
    return {
      id: "argile",
      label: "Retrait-gonflement argile",
      level: "negligeable",
      description: "Hors couverture ou non concerne",
    };
  }
  const map: Record<number, RiskLevel> = {
    0: "negligeable",
    1: "faible",
    2: "moyen",
    3: "fort",
  };
  return {
    id: "argile",
    label: "Retrait-gonflement argile",
    level: map[expo] ?? "negligeable",
    description: `Exposition ${expo}/3`,
  };
}

// --- Inondation (from risk report) ---

/** Returns null if the risk status is unknown/not applicable */
function levelFromStatus(statut: string | undefined): RiskLevel | null {
  const s = statut?.toLowerCase() ?? "";
  if (s.includes("inconnu") || s.includes("non connu") || s.includes("non concerne")) {
    return null;
  }
  if (s.includes("existant") && !s.includes("non") && !s.includes("inex")) {
    if (s.includes("important") || s.includes("fort")) return "fort";
    return "moyen";
  }
  if (s.includes("concerne")) return "faible";
  return null;
}

export function scoreInondation(report: RiskReport): ScoredRisk | null {
  const inondation = report.risquesNaturels.find(
    (r) => r.libelle?.toLowerCase().includes("inondation") && r.present,
  );
  if (!inondation) return null;

  const level = levelFromStatus(inondation.libelleStatutAdresse)
    ?? levelFromStatus(inondation.libelleStatutCommune);
  if (!level) return null;

  return {
    id: "inondation",
    label: "Inondation",
    level,
    description: inondation.libelleStatutAdresse ?? inondation.libelleStatutCommune ?? "Risque present",
  };
}

// --- ICPE / Seveso ---

export function scoreICPE(data: ICPEData): ScoredRisk {
  const items = data.data ?? [];
  if (items.length === 0) {
    return {
      id: "icpe",
      label: "Sites industriels (ICPE)",
      level: "negligeable",
      description: "Aucun site industriel a proximite",
    };
  }
  const sevesoHaut = items.some((i) =>
    i.statutSeveso?.toLowerCase().includes("seuil haut"),
  );
  const sevesoBas = items.some((i) =>
    i.statutSeveso?.toLowerCase().includes("seuil bas"),
  );
  const level: RiskLevel = sevesoHaut ? "fort" : sevesoBas ? "moyen" : "faible";
  const count = items.length;
  return {
    id: "icpe",
    label: "Sites industriels (ICPE)",
    level,
    description: `${count} site${count > 1 ? "s" : ""} dans un rayon de 5 km`,
    details: sevesoHaut
      ? "Au moins un site Seveso seuil haut"
      : sevesoBas
        ? "Au moins un site Seveso seuil bas"
        : undefined,
  };
}

// --- Cavites ---

export function scoreCavites(data: CaviteData): ScoredRisk {
  const count = data.data?.length ?? 0;
  if (count === 0) {
    return {
      id: "cavites",
      label: "Cavites souterraines",
      level: "negligeable",
      description: "Aucune cavite repertoriee a proximite",
    };
  }
  return {
    id: "cavites",
    label: "Cavites souterraines",
    level: count >= 5 ? "moyen" : "faible",
    description: `${count} cavite${count > 1 ? "s" : ""} a proximite`,
  };
}

// --- Aggregate from risk report ---

export function scoreRiskReport(report: RiskReport): ScoredRisk[] {
  const scored: ScoredRisk[] = [];

  const naturels = report.risquesNaturels.filter((r) => r.present);
  const technos = report.risquesTechnologiques.filter((r) => r.present);

  // Skip risks already handled by dedicated endpoints
  const handled = ["inondation", "séisme", "seisme", "radon", "argile", "retrait gonflement"];

  for (const r of [...naturels, ...technos]) {
    const lbl = r.libelle?.toLowerCase() ?? "";
    if (handled.some((h) => lbl.includes(h))) continue;

    const level = levelFromStatus(r.libelleStatutAdresse)
      ?? levelFromStatus(r.libelleStatutCommune);
    if (!level) continue;

    scored.push({
      id: lbl.replace(/\s+/g, "-") || "risque",
      label: r.libelle ?? "Risque",
      level,
      description: r.libelleStatutAdresse ?? r.libelleStatutCommune ?? "Risque present",
    });
  }

  return scored;
}
