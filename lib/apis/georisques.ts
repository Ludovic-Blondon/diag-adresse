import { cache } from "react";
import { GEORISQUES_BASE_URL, API_TIMEOUT_MS } from "../constants";
import type {
  RiskReport,
  RadonData,
  RGAData,
  SeismicData,
  ICPEData,
  CaviteData,
} from "../types/georisques";

async function geoFetch<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const qs = new URLSearchParams(params);
  const url = `${GEORISQUES_BASE_URL}${path}?${qs}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    // 7 days: risk zonings change on regulatory timescales. Keep >= the
    // /commune revalidate (7d) — the route re-renders at the lowest fetch
    // revalidate it uses, so a shorter value here multiplies ISR renders.
    next: { revalidate: 604800 },
  });
  if (!res.ok) throw new Error(`Georisques ${path} ${res.status}`);
  return res.json();
}

// --- Public API ---

export const fetchRiskReport = cache(
  async (lon: number, lat: number): Promise<RiskReport> => {
    const raw = await geoFetch<Record<string, unknown>>(
      "/resultats_rapport_risque",
      { latlon: `${lon},${lat}` },
    );

    const toArray = (obj: unknown) => {
      if (Array.isArray(obj)) return obj;
      if (obj && typeof obj === "object") return Object.values(obj);
      return [];
    };

    return {
      risquesNaturels: toArray(raw.risquesNaturels),
      risquesTechnologiques: toArray(raw.risquesTechnologiques),
    };
  },
);

export const fetchRadon = cache(
  async (codeInsee: string): Promise<RadonData> => {
    return geoFetch<RadonData>("/radon", { code_insee: codeInsee });
  },
);

export const fetchRGA = cache(
  async (lon: number, lat: number): Promise<RGAData> => {
    const res = await fetch(`${GEORISQUES_BASE_URL}/rga?latlon=${lon},${lat}`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      next: { revalidate: 604800 }, // 7 days, see geoFetch
    });
    if (!res.ok) throw new Error(`RGA ${res.status}`);
    // Out of coverage, the endpoint returns 200 with an empty body: scoreRGA
    // maps that to "indisponible". Real errors must reject so the dashboard
    // drops the card instead of rendering a falsely reassuring level.
    const text = await res.text();
    if (!text.trim()) return {};
    return JSON.parse(text) as RGAData;
  },
);

export const fetchSeismicZone = cache(
  async (codeInsee: string): Promise<SeismicData> => {
    return geoFetch<SeismicData>("/zonage_sismique", { code_insee: codeInsee });
  },
);

// Géorisques rejette en 500 une requête qui combine code_insee et latlon/rayon
// (« deux types de recherche différentes ») : avec des coordonnées, on cherche
// au rayon seul.
function locationQuery(
  codeInsee: string,
  lon?: number,
  lat?: number,
  rayon?: number,
): Record<string, string> {
  if (lon != null && lat != null) {
    return { latlon: `${lon},${lat}`, rayon: String(rayon ?? 5000) };
  }
  return { code_insee: codeInsee };
}

export const fetchICPE = cache(
  async (
    codeInsee: string,
    lon?: number,
    lat?: number,
    rayon?: number,
  ): Promise<ICPEData> => {
    const query = locationQuery(codeInsee, lon, lat, rayon);
    // `data` n'est que la première page (10 sites) : le statut Seveso se compte
    // par des requêtes filtrées, sinon un site seuil haut hors de cette page
    // passerait inaperçu.
    const countSeveso = async (statutSeveso: string) => {
      const res = await geoFetch<ICPEData>("/installations_classees", {
        ...query,
        statutSeveso,
        page_size: "1",
      });
      return res.results ?? res.data.length;
    };
    const [page, haut, bas] = await Promise.all([
      geoFetch<ICPEData>("/installations_classees", query),
      countSeveso("SEUIL_HAUT"),
      countSeveso("SEUIL_BAS"),
    ]);
    return { data: page.data, results: page.results, seveso: { haut, bas } };
  },
);

export const fetchCavites = cache(
  async (
    codeInsee: string,
    lon?: number,
    lat?: number,
    rayon?: number,
  ): Promise<CaviteData> => {
    return geoFetch<CaviteData>(
      "/cavites",
      locationQuery(codeInsee, lon, lat, rayon),
    );
  },
);
