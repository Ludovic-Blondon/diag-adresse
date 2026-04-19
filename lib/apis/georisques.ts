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
    next: { revalidate: 86400 },
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
    try {
      const res = await fetch(
        `${GEORISQUES_BASE_URL}/rga?latlon=${lon},${lat}`,
        {
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
          next: { revalidate: 86400 },
        },
      );
      if (!res.ok) throw new Error(`RGA ${res.status}`);
      const text = await res.text();
      if (!text.trim()) return { data: [] };
      return JSON.parse(text);
    } catch {
      return { data: [] };
    }
  },
);

export const fetchSeismicZone = cache(
  async (codeInsee: string): Promise<SeismicData> => {
    return geoFetch<SeismicData>("/zonage_sismique", { code_insee: codeInsee });
  },
);

export const fetchICPE = cache(
  async (
    codeInsee: string,
    lon?: number,
    lat?: number,
    rayon?: number,
  ): Promise<ICPEData> => {
    const query: Record<string, string> = { code_insee: codeInsee };
    if (lon != null && lat != null) {
      query.latlon = `${lon},${lat}`;
      query.rayon = String(rayon ?? 5000);
    }
    return geoFetch<ICPEData>("/installations_classees", query);
  },
);

export const fetchCavites = cache(
  async (
    codeInsee: string,
    lon?: number,
    lat?: number,
    rayon?: number,
  ): Promise<CaviteData> => {
    const query: Record<string, string> = { code_insee: codeInsee };
    if (lon != null && lat != null) {
      query.latlon = `${lon},${lat}`;
      query.rayon = String(rayon ?? 5000);
    }
    return geoFetch<CaviteData>("/cavites", query);
  },
);
