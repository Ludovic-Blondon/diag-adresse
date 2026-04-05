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

export interface RGAResult {
  exposition: 0 | 1 | 2 | 3;
}

export interface RGAData {
  data: RGAResult[];
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
