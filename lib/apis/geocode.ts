import {
  GEOCODE_URL,
  GEOCODE_FALLBACK_URL,
  API_TIMEOUT_MS,
} from "../constants";
import type { GeocodeResponse, GeocodeSuggestion } from "../types/geocode";

function toSuggestion(
  feature: GeocodeResponse["features"][number],
): GeocodeSuggestion {
  const { properties, geometry } = feature;
  return {
    label: properties.label,
    lon: geometry.coordinates[0],
    lat: geometry.coordinates[1],
    citycode: properties.citycode,
    postcode: properties.postcode,
    city: properties.city,
    context: properties.context,
    type: properties.type,
  };
}

async function fetchGeocode(
  baseUrl: string,
  params: URLSearchParams,
): Promise<GeocodeResponse> {
  const url = `${baseUrl}/search?${params}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Geocode ${res.status}`);
  return res.json();
}

export async function autocomplete(
  query: string,
  limit = 5,
): Promise<GeocodeSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    autocomplete: "1",
    limit: String(limit),
  });

  try {
    const data = await fetchGeocode(GEOCODE_URL, params);
    return data.features.map(toSuggestion);
  } catch {
    // Fallback to legacy API
    const data = await fetchGeocode(GEOCODE_FALLBACK_URL, params);
    return data.features.map(toSuggestion);
  }
}

export async function reverseGeocode(
  lon: number,
  lat: number,
): Promise<GeocodeSuggestion | null> {
  const params = new URLSearchParams({
    lon: String(lon),
    lat: String(lat),
    limit: "1",
  });

  const tryReverse = async (baseUrl: string) => {
    const url = `${baseUrl}/reverse?${params}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`Reverse geocode ${res.status}`);
    const data: GeocodeResponse = await res.json();
    return data.features.length > 0 ? toSuggestion(data.features[0]) : null;
  };

  try {
    return await tryReverse(GEOCODE_URL);
  } catch {
    return tryReverse(GEOCODE_FALLBACK_URL);
  }
}
