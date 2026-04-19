// --- Site URL ---

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// --- API Base URLs ---

export const GEOCODE_URL =
  process.env.NEXT_PUBLIC_GEOCODE_URL ?? "https://data.geopf.fr/geocodage";

export const GEOCODE_FALLBACK_URL =
  process.env.GEOCODE_FALLBACK_URL ?? "https://api-adresse.data.gouv.fr";

export const GEORISQUES_BASE_URL =
  process.env.GEORISQUES_BASE_URL ?? "https://georisques.gouv.fr/api/v1";

export const HUBEAU_BASE_URL =
  process.env.HUBEAU_BASE_URL ??
  "https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable";

export const ADEME_DPE_BASE_URL =
  process.env.ADEME_DPE_BASE_URL ??
  "https://data.ademe.fr/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe";

// --- Risk levels ---

export const RISK_LEVELS = ["negligeable", "faible", "moyen", "fort"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_LEVEL_BADGE: Record<RiskLevel, string> = {
  negligeable:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  faible:
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
  moyen:
    "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  fort: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  negligeable: "Negligeable",
  faible: "Faible",
  moyen: "Moyen",
  fort: "Fort",
};

// --- Water quality thresholds ---

export type WaterCategory =
  | "indicateurs_cles"
  | "physicochimie"
  | "mineraux"
  | "metaux"
  | "bacteriologie";

export const WATER_CATEGORY_LABELS: Record<WaterCategory, string> = {
  indicateurs_cles: "Indicateurs cles",
  physicochimie: "Physico-chimie",
  mineraux: "Mineraux et ions",
  metaux: "Metaux",
  bacteriologie: "Bacteriologie",
};

export interface WaterParamDef {
  code: string;
  label: string;
  unit: string;
  threshold: number | null;
  category: WaterCategory;
}

export const WATER_PARAMS: WaterParamDef[] = [
  // --- Indicateurs cles (affiches en cards) ---
  {
    code: "1340",
    label: "Nitrates",
    unit: "mg/L",
    threshold: 50,
    category: "indicateurs_cles",
  },
  {
    code: "6276",
    label: "Pesticides totaux",
    unit: "µg/L",
    threshold: 0.5,
    category: "indicateurs_cles",
  },
  {
    code: "1345",
    label: "Durete (TH)",
    unit: "°F",
    threshold: null,
    category: "indicateurs_cles",
  },
  {
    code: "1302",
    label: "pH",
    unit: "",
    threshold: null,
    category: "indicateurs_cles",
  },

  // --- Physico-chimie ---
  {
    code: "1303",
    label: "Conductivite",
    unit: "µS/cm",
    threshold: null,
    category: "physicochimie",
  },
  {
    code: "1295",
    label: "Turbidite",
    unit: "NFU",
    threshold: 2,
    category: "physicochimie",
  },
  {
    code: "1301",
    label: "Temperature",
    unit: "°C",
    threshold: 25,
    category: "physicochimie",
  },
  {
    code: "1398",
    label: "Chlore libre",
    unit: "mg/L",
    threshold: null,
    category: "physicochimie",
  },
  {
    code: "1399",
    label: "Chlore total",
    unit: "mg/L",
    threshold: null,
    category: "physicochimie",
  },

  // --- Mineraux et ions ---
  {
    code: "1350",
    label: "Fluor",
    unit: "mg/L",
    threshold: 1.5,
    category: "mineraux",
  },
  {
    code: "1335",
    label: "Ammonium",
    unit: "mg/L",
    threshold: 0.1,
    category: "mineraux",
  },
  {
    code: "1337",
    label: "Chlorures",
    unit: "mg/L",
    threshold: 250,
    category: "mineraux",
  },
  {
    code: "1338",
    label: "Sulfates",
    unit: "mg/L",
    threshold: 250,
    category: "mineraux",
  },
  {
    code: "1339",
    label: "Nitrites",
    unit: "mg/L",
    threshold: null,
    category: "mineraux",
  },
  {
    code: "1374",
    label: "Calcium",
    unit: "mg/L",
    threshold: null,
    category: "mineraux",
  },
  {
    code: "1372",
    label: "Magnesium",
    unit: "mg/L",
    threshold: null,
    category: "mineraux",
  },

  // --- Metaux ---
  {
    code: "1370",
    label: "Aluminium",
    unit: "µg/L",
    threshold: 200,
    category: "metaux",
  },
  {
    code: "1393",
    label: "Fer total",
    unit: "µg/L",
    threshold: 200,
    category: "metaux",
  },

  // --- Bacteriologie ---
  {
    code: "1449",
    label: "Escherichia coli",
    unit: "n/100mL",
    threshold: 0,
    category: "bacteriologie",
  },
  {
    code: "6455",
    label: "Enterocoques",
    unit: "n/100mL",
    threshold: 0,
    category: "bacteriologie",
  },
  {
    code: "1447",
    label: "Coliformes",
    unit: "n/100mL",
    threshold: 0,
    category: "bacteriologie",
  },
  {
    code: "1042",
    label: "Spores sulfito-reducteurs",
    unit: "n/100mL",
    threshold: 0,
    category: "bacteriologie",
  },
];

// --- DPE labels ---

export const DPE_LABELS = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type DPELabel = (typeof DPE_LABELS)[number];

export const DPE_COLORS: Record<DPELabel, string> = {
  A: "bg-[#009c6b]",
  B: "bg-[#52b153]",
  C: "bg-[#8dc641]",
  D: "bg-[#f4e70f]",
  E: "bg-[#f0b40f]",
  F: "bg-[#eb6e2c]",
  G: "bg-[#d7221f]",
};

// --- Fetch defaults ---

export const API_TIMEOUT_MS = 10_000;
