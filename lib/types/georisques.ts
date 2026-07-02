// --- Rapport risque ---

export interface RiskReportRisk {
  present: boolean;
  libelle: string;
  libelleStatutCommune?: string;
  libelleStatutAdresse?: string;
}

export interface RiskReport {
  risquesNaturels: RiskReportRisk[];
  risquesTechnologiques: RiskReportRisk[];
}

// --- Radon ---

export interface RadonResult {
  code_insee: string;
  classe_potentiel: 1 | 2 | 3;
}

export interface RadonData {
  data: RadonResult[];
}

// --- RGA (retrait-gonflement argile) ---

// L'endpoint /rga renvoie un objet unique (pas un tableau `data`), ou un corps
// vide hors couverture. Ex. : {"codeExposition":"1","exposition":"Exposition faible"}.
export interface RGAData {
  codeExposition?: string; // "1" faible · "2" moyenne · "3" forte
  exposition?: string; // libellé humain, ex. "Exposition faible"
}

// --- Zone sismique ---

export interface SeismicResult {
  code_zone: 1 | 2 | 3 | 4 | 5;
}

export interface SeismicData {
  data: SeismicResult[];
}

// --- ICPE ---

export interface ICPEResult {
  raisonSociale?: string;
  adresse1?: string;
  codePostal?: string;
  commune?: string;
  statutSeveso: string | null;
  regime: string | null;
  etatActivite: string | null;
  longitude: number | null;
  latitude: number | null;
}

export interface ICPEData {
  data: ICPEResult[];
  totalElements?: number;
}

// --- Cavites ---

export interface CaviteResult {
  nom: string;
  type_cavite: string;
  commune: string;
  latitude?: number;
  longitude?: number;
}

export interface CaviteData {
  data: CaviteResult[];
  totalElements?: number;
}
