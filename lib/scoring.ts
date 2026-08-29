import type { DisplayRiskLevel, RiskLevel } from "./constants";
import type {
  RiskReport,
  RadonData,
  RGAData,
  SeismicData,
  ICPEData,
  CaviteData,
} from "./types/georisques";

export type RiskSource = "adresse" | "commune";

export interface ScoredRisk {
  id: string;
  label: string;
  /** `indisponible` = la source n'a pas répondu pour ce point, pas un risque nul */
  level: DisplayRiskLevel;
  description: string;
  details?: string;
  source?: RiskSource;
}

// --- Séisme ---

export function scoreSeismic(data: SeismicData): ScoredRisk {
  const map: Record<number, RiskLevel> = {
    1: "negligeable",
    2: "faible",
    3: "moyen",
    4: "fort",
    5: "fort",
  };
  const zone = Number(data.data?.[0]?.code_zone);
  const level = map[zone];
  // Réponse vide : ne pas retomber sur la zone 1, qui afficherait un badge
  // vert « sismicité très faible » pour une donnée qu'on n'a pas.
  if (level == null) {
    return {
      id: "seisme",
      label: "Séisme",
      level: "indisponible",
      description: "Zonage sismique non disponible pour cette commune",
    };
  }
  return {
    id: "seisme",
    label: "Séisme",
    level,
    description: `Zone de sismicité ${zone}/5`,
  };
}

// --- Radon ---

export function scoreRadon(data: RadonData): ScoredRisk {
  const map: Record<number, RiskLevel> = {
    1: "faible",
    2: "moyen",
    3: "fort",
  };
  const classe = Number(data.data?.[0]?.classe_potentiel);
  const level = map[classe];
  if (level == null) {
    return {
      id: "radon",
      label: "Radon",
      level: "indisponible",
      description: "Potentiel radon non disponible pour cette commune",
    };
  }
  return {
    id: "radon",
    label: "Radon",
    level,
    description: `Potentiel radon classe ${classe}/3`,
  };
}

// --- RGA (argile) ---

export function scoreRGA(data: RGAData): ScoredRisk {
  const map: Record<number, RiskLevel> = {
    0: "negligeable",
    1: "faible",
    2: "moyen",
    3: "fort",
  };
  const code = data.codeExposition != null ? Number(data.codeExposition) : NaN;
  const level = map[code];
  // Corps vide = point hors de la carte RGA. Distinct du code 0 (« aucune
  // exposition »), qui est bien une réponse de l'API.
  if (level == null) {
    return {
      id: "argile",
      label: "Retrait-gonflement argile",
      level: "indisponible",
      description: "Hors de la zone cartographiée par Géorisques",
    };
  }
  return {
    id: "argile",
    label: "Retrait-gonflement argile",
    level,
    description:
      data.exposition ??
      (code === 0
        ? "Aucune exposition identifiée"
        : `Exposition niveau ${code}`),
  };
}

// --- Inondation (from risk report) ---

/** Returns null if the risk status is unknown/not applicable */
function levelFromStatus(statut: string | undefined): RiskLevel | null {
  const s = statut?.toLowerCase() ?? "";
  if (
    s.includes("inconnu") ||
    s.includes("non connu") ||
    s.includes("non concerne")
  ) {
    return null;
  }
  if (s.includes("existant") && !s.includes("non") && !s.includes("inex")) {
    if (s.includes("important") || s.includes("fort")) return "fort";
    return "moyen";
  }
  if (s.includes("concerne")) return "faible";
  return null;
}

/** Resolves level and description from the same status source to keep them consistent */
function resolveRiskStatus(
  statutAdresse: string | undefined,
  statutCommune: string | undefined,
): { level: RiskLevel; description: string; source: RiskSource } | null {
  const adresseLevel = levelFromStatus(statutAdresse);
  if (adresseLevel)
    return {
      level: adresseLevel,
      description: statutAdresse!,
      source: "adresse",
    };
  const communeLevel = levelFromStatus(statutCommune);
  if (communeLevel)
    return {
      level: communeLevel,
      description: statutCommune!,
      source: "commune",
    };
  return null;
}

export function scoreInondation(report: RiskReport): ScoredRisk | null {
  const inondation = report.risquesNaturels.find(
    (r) => r.libelle?.toLowerCase().includes("inondation") && r.present,
  );
  if (!inondation) return null;

  const resolved = resolveRiskStatus(
    inondation.libelleStatutAdresse,
    inondation.libelleStatutCommune,
  );
  if (!resolved) return null;

  return {
    id: "inondation",
    label: "Inondation",
    level: resolved.level,
    description: resolved.description,
    source: resolved.source,
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
      description: "Aucun site industriel à proximité",
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

// --- Cavités ---

export function scoreCavites(data: CaviteData): ScoredRisk {
  const count = data.data?.length ?? 0;
  if (count === 0) {
    return {
      id: "cavites",
      label: "Cavités souterraines",
      level: "negligeable",
      description: "Aucune cavité répertoriée à proximité",
    };
  }
  return {
    id: "cavites",
    label: "Cavités souterraines",
    level: count >= 5 ? "moyen" : "faible",
    description: `${count} cavité${count > 1 ? "s" : ""} à proximité`,
  };
}

// --- Aggregate from risk report ---

export function scoreRiskReport(report: RiskReport): ScoredRisk[] {
  const scored: ScoredRisk[] = [];

  const naturels = report.risquesNaturels.filter((r) => r.present);
  const technos = report.risquesTechnologiques.filter((r) => r.present);

  // Skip risks already handled by dedicated endpoints
  const handled = [
    "inondation",
    "séisme",
    "seisme",
    "radon",
    "argile",
    "retrait gonflement",
  ];

  for (const r of [...naturels, ...technos]) {
    const lbl = r.libelle?.toLowerCase() ?? "";
    if (handled.some((h) => lbl.includes(h))) continue;

    const resolved = resolveRiskStatus(
      r.libelleStatutAdresse,
      r.libelleStatutCommune,
    );
    if (!resolved) continue;

    scored.push({
      id: lbl.replace(/\s+/g, "-") || "risque",
      label: r.libelle ?? "Risque",
      level: resolved.level,
      description: resolved.description,
      source: resolved.source,
    });
  }

  return scored;
}
