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

async function geoFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params);
  const url = `${GEORISQUES_BASE_URL}${path}?${qs}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Georisques ${path} ${res.status}`);
  return res.json();
}

// --- Rate limiter for resultats_rapport_risque (1 req/s) ---

let lastRiskReportCall = 0;

async function rateLimitedFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const now = Date.now();
  const wait = Math.max(0, 1000 - (now - lastRiskReportCall));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRiskReportCall = Date.now();
  return geoFetch<T>(path, params);
}

// --- Public API ---

export async function fetchRiskReport(params: {
  codeInsee?: string;
  lon?: number;
  lat?: number;
}): Promise<RiskReport> {
  const query: Record<string, string> = {};
  if (params.lon != null && params.lat != null) {
    query.latlon = `${params.lon},${params.lat}`;
  } else if (params.codeInsee) {
    query.code_insee = params.codeInsee;
  }

  const raw = await rateLimitedFetch<Record<string, unknown>>(
    "/resultats_rapport_risque",
    query,
  );

  // The API returns an object keyed by risk type — flatten to array
  const toArray = (obj: unknown) => {
    if (Array.isArray(obj)) return obj;
    if (obj && typeof obj === "object") return Object.values(obj);
    return [];
  };

  return {
    risquesNaturels: toArray(raw.risquesNaturels),
    risquesTechnologiques: toArray(raw.risquesTechnologiques),
  };
}

export const fetchRadon = cache(async (codeInsee: string): Promise<RadonData> => {
  return geoFetch<RadonData>("/radon", { code_insee: codeInsee });
});

export async function fetchRGA(lon: number, lat: number): Promise<RGAData> {
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
}

export const fetchSeismicZone = cache(async (codeInsee: string): Promise<SeismicData> => {
  return geoFetch<SeismicData>("/zonage_sismique", { code_insee: codeInsee });
});

export async function fetchICPE(params: {
  codeInsee: string;
  rayon?: number;
  lon?: number;
  lat?: number;
}): Promise<ICPEData> {
  const query: Record<string, string> = { code_insee: params.codeInsee };
  if (params.lon != null && params.lat != null) {
    query.latlon = `${params.lon},${params.lat}`;
    query.rayon = String(params.rayon ?? 5000);
  }
  return geoFetch<ICPEData>("/installations_classees", query);
}

export async function fetchCavites(params: {
  codeInsee: string;
  lon?: number;
  lat?: number;
  rayon?: number;
}): Promise<CaviteData> {
  const query: Record<string, string> = { code_insee: params.codeInsee };
  if (params.lon != null && params.lat != null) {
    query.latlon = `${params.lon},${params.lat}`;
    query.rayon = String(params.rayon ?? 5000);
  }
  return geoFetch<CaviteData>("/cavites", query);
}
