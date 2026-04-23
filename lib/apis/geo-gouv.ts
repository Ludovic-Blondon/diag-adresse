import { GEO_GOUV_BASE_URL, API_TIMEOUT_MS } from "../constants";

interface GeoGouvCommune {
  code: string;
  nom: string;
  centre: { type: "Point"; coordinates: [number, number] };
}

export interface CommuneLookup {
  name: string;
  lat: number;
  lon: number;
}

/**
 * Resolve an INSEE code to commune name + centroid via geo.api.gouv.fr.
 * Returns null if the code is unknown (404). Throws on network/server errors.
 */
export async function getCommuneByInseeCode(
  code: string,
): Promise<CommuneLookup | null> {
  const url = `${GEO_GOUV_BASE_URL}/communes/${encodeURIComponent(code)}?fields=nom,centre&format=json&geometry=centre`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    next: { revalidate: 2592000 }, // 30 days — INSEE data is effectively static
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`geo.api.gouv.fr ${res.status}`);
  const data = (await res.json()) as GeoGouvCommune;
  if (!data.centre?.coordinates) return null;
  return {
    name: data.nom,
    lat: data.centre.coordinates[1],
    lon: data.centre.coordinates[0],
  };
}
