import { cache } from "react";
import { GEORISQUES_BASE_URL } from "../constants";
import { apiFetch } from "./api-fetch";
import { arrondissementCodes, toHubeauCode } from "../paris";
import type {
  ICPEResult,
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
  const res = await apiFetch(url, {
    // 7 days: risk zonings change on regulatory timescales. Keep >= the
    // /commune revalidate (7d) — the route re-renders at the lowest fetch
    // revalidate it uses, so a shorter value here multiplies ISR renders.
    next: { revalidate: 604800 },
  });
  if (!res.ok) throw new Error(`Georisques ${path} ${res.status}`);
  return res.json();
}

// --- Public API ---

// Codes GASPAR dont le rapport donne le statut communal « Risque Existant »
// (comparaison avec le rapport de Feyzin, Lille et Bordeaux, oct. 2026).
const GASPAR_REPORT_RISKS: Record<string, string> = {
  "11": "Inondation",
  "116": "Remontée de nappe",
  "12": "Mouvements de terrain",
};

/**
 * Équivalent communal du rapport, tiré de GASPAR (/gaspar/risques). Le rapport
 * coupe la plupart des connexions (oct. 2026) alors que GASPAR répond. Les
 * cartes obtenues n'ont qu'un statut communal, signalé comme tel à l'écran.
 * GASPAR indexe le code commune global, comme Hub'Eau, pas les arrondissements.
 */
async function fetchGasparReport(codeInsee: string): Promise<RiskReport> {
  const raw = await geoFetch<{
    data: { risques_detail?: { num_risque: string }[] }[];
  }>("/gaspar/risques", { code_insee: toHubeauCode(codeInsee) });
  const codes = new Set(
    raw.data.flatMap((d) => d.risques_detail ?? []).map((r) => r.num_risque),
  );
  return {
    risquesNaturels: Object.entries(GASPAR_REPORT_RISKS)
      .filter(([code]) => codes.has(code))
      .map(([, libelle]) => ({
        present: true,
        libelle,
        libelleStatutCommune: "Risque Existant",
      })),
    risquesTechnologiques: [],
  };
}

export const fetchRiskReport = cache(
  async (lon: number, lat: number, codeInsee?: string): Promise<RiskReport> => {
    const toArray = (obj: unknown) => {
      if (Array.isArray(obj)) return obj;
      if (obj && typeof obj === "object") return Object.values(obj);
      return [];
    };

    try {
      const raw = await geoFetch<Record<string, unknown>>(
        "/resultats_rapport_risque",
        { latlon: `${lon},${lat}` },
      );
      return {
        risquesNaturels: toArray(raw.risquesNaturels),
        risquesTechnologiques: toArray(raw.risquesTechnologiques),
      };
    } catch (err) {
      if (!codeInsee) throw err;
      return fetchGasparReport(codeInsee);
    }
  },
);

// Paris, Lyon et Marseille : Géorisques ne classe le radon (et la sismicité de
// Paris) que par arrondissement. Une page commune interroge la commune et ses
// arrondissements, et garde la valeur la plus élevée en tête. L'API accepte au
// plus 20 codes INSEE par requête (500 au-delà) : Paris, avec 21 codes, en fait
// deux.
const MAX_INSEE_CODES = 20;

async function fetchWithArrondissements<T>(
  path: string,
  codeInsee: string,
  value: (item: T) => number,
): Promise<{ data: T[] }> {
  const codes = [codeInsee, ...arrondissementCodes(codeInsee)];
  const groups = Array.from(
    { length: Math.ceil(codes.length / MAX_INSEE_CODES) },
    (_, i) => codes.slice(i * MAX_INSEE_CODES, (i + 1) * MAX_INSEE_CODES),
  );
  const pages = await Promise.all(
    groups.map((group) =>
      geoFetch<{ data?: T[] }>(path, {
        code_insee: group.join(","),
        page_size: "50",
      }),
    ),
  );
  const data = pages.flatMap((page) => page.data ?? []);
  return { data: data.sort((a, b) => value(b) - value(a)) };
}

export const fetchRadon = cache(async (codeInsee: string): Promise<RadonData> =>
  fetchWithArrondissements(
    "/radon",
    codeInsee,
    (r: RadonData["data"][number]) => Number(r.classe_potentiel),
  ),
);

export const fetchRGA = cache(
  async (lon: number, lat: number): Promise<RGAData> => {
    const res = await apiFetch(
      `${GEORISQUES_BASE_URL}/rga?latlon=${lon},${lat}`,
      {
        next: { revalidate: 604800 }, // 7 days, see geoFetch
      },
    );
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
  async (codeInsee: string): Promise<SeismicData> =>
    fetchWithArrondissements(
      "/zonage_sismique",
      codeInsee,
      (z: SeismicData["data"][number]) => Number(z.code_zone),
    ),
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

// Marqueurs de la carte (ouverte à ~1–2 km du point) : tous les sites Seveso du
// rayon, plus les installations à moins de ICPE_MARKER_RADIUS. Le reste du
// rayon est seulement compté : Paris compte 1 371 installations à 5 km.
export const ICPE_MARKER_RADIUS = 1000;
export const ICPE_MARKER_LIMIT = 100;

// Les fiches ICPE embarquent inspections, documents et rubriques : la carte,
// rendue côté client, n'a besoin que de quoi placer et nommer chaque site.
function toMarker(site: ICPEResult): ICPEResult {
  return {
    codeAIOT: site.codeAIOT,
    raisonSociale: site.raisonSociale,
    statutSeveso: site.statutSeveso,
    regime: site.regime,
    etatActivite: site.etatActivite,
    longitude: site.longitude,
    latitude: site.latitude,
  };
}

export const fetchICPE = cache(
  async (
    codeInsee: string,
    lon?: number,
    lat?: number,
    rayon?: number,
  ): Promise<ICPEData> => {
    const query = locationQuery(codeInsee, lon, lat, rayon);
    // Sans coordonnées, les marqueurs sont la première page de la commune.
    const nearQuery =
      lon != null && lat != null
        ? locationQuery(codeInsee, lon, lat, ICPE_MARKER_RADIUS)
        : query;
    const list = (params: Record<string, string>) =>
      geoFetch<ICPEData>("/installations_classees", {
        ...params,
        page_size: String(ICPE_MARKER_LIMIT),
      });
    // L'API pagine : le total vient de `results`, et le statut Seveso de
    // requêtes filtrées, sinon un site seuil haut hors de la page passerait
    // inaperçu.
    const [total, haut, bas, nearby] = await Promise.all([
      geoFetch<ICPEData>("/installations_classees", {
        ...query,
        page_size: "1",
      }),
      list({ ...query, statutSeveso: "SEUIL_HAUT" }),
      list({ ...query, statutSeveso: "SEUIL_BAS" }),
      list(nearQuery),
    ]);

    const markers = new Map<string, ICPEResult>();
    for (const site of [...haut.data, ...bas.data, ...nearby.data]) {
      const key =
        site.codeAIOT ??
        `${site.raisonSociale}|${site.longitude}|${site.latitude}`;
      if (!markers.has(key)) markers.set(key, toMarker(site));
    }

    return {
      data: [...markers.values()],
      results: total.results ?? total.data.length,
      seveso: {
        haut: haut.results ?? haut.data.length,
        bas: bas.results ?? bas.data.length,
      },
      nearbyTotal: nearby.results ?? nearby.data.length,
    };
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
