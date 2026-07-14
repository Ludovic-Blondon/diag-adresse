import { cache } from "react";
import { HUBEAU_BASE_URL, API_TIMEOUT_MS, WATER_PARAMS } from "../constants";
import type { WaterQualityResult, WaterParam } from "../types/hubeau";

interface HubeauResultDis {
  code_parametre?: string;
  resultat_alphanumerique?: string;
  date_prelevement?: string;
}

interface HubeauResponse {
  data: HubeauResultDis[];
}

const RESULT_FIELDS = "code_parametre,resultat_alphanumerique,date_prelevement";

// One page of the latest analyses, all parameters mixed, sorted by sampling
// date desc. 200 rows span the last few sampling campaigns: enough to contain
// every regularly measured parameter. Rarely measured ones (missing from the
// page) get an individual fallback request in fetchLatestByParam.
const BULK_SIZE = "200";

async function fetchResults(
  params: URLSearchParams,
): Promise<HubeauResultDis[]> {
  const url = `${HUBEAU_BASE_URL}/resultats_dis?${params}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    // 7 days, aligned with the /commune page revalidate: a shorter value here
    // drags the whole route's ISR window down to it (lowest fetch wins).
    next: { revalidate: 604800 },
  });
  if (!res.ok) throw new Error(`HubEau ${res.status}`);
  const data: HubeauResponse = await res.json();
  return data.data ?? [];
}

/**
 * Latest result per parameter code, in one bulk request for the common case
 * (instead of one request per parameter — 22 calls per commune render). The
 * response is sorted by date desc, so the first row seen for a code is its
 * most recent result. Parameters absent from the bulk page — rarely measured,
 * or total bulk failure — are fetched individually.
 */
async function fetchLatestByParam(
  codeCommune: string,
): Promise<Map<string, HubeauResultDis>> {
  const latest = new Map<string, HubeauResultDis>();

  try {
    const rows = await fetchResults(
      new URLSearchParams({
        code_commune: codeCommune,
        code_parametre: WATER_PARAMS.map((p) => p.code).join(","),
        fields: RESULT_FIELDS,
        sort: "desc",
        size: BULK_SIZE,
      }),
    );
    for (const row of rows) {
      if (row.code_parametre && !latest.has(row.code_parametre)) {
        latest.set(row.code_parametre, row);
      }
    }
  } catch {
    // Bulk failed: the per-parameter fallback below covers every code.
  }

  const missing = WATER_PARAMS.filter((p) => !latest.has(p.code));
  const fallbacks = await Promise.allSettled(
    missing.map((p) =>
      fetchResults(
        new URLSearchParams({
          code_commune: codeCommune,
          code_parametre: p.code,
          fields: RESULT_FIELDS,
          sort: "desc",
          size: "1",
        }),
      ),
    ),
  );
  fallbacks.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value[0]) {
      latest.set(missing[i].code, result.value[0]);
    }
  });

  return latest;
}

/**
 * Parse a Hub'Eau alphanumeric result ("7,71", "<0,5") to a number; null when
 * absent or not numeric. "<x" (below detection limit) is treated as x.
 */
export function parseWaterValue(raw: string | undefined): number | null {
  if (!raw) return null;
  const parsed = parseFloat(raw.replace(",", ".").replace(/^</, ""));
  return Number.isNaN(parsed) ? null : parsed;
}

export const fetchWaterQuality = cache(
  async (codeCommune: string): Promise<WaterQualityResult> => {
    const latest = await fetchLatestByParam(codeCommune);

    const params: WaterParam[] = WATER_PARAMS.map((entry) => {
      const dis = latest.get(entry.code);
      const value = parseWaterValue(dis?.resultat_alphanumerique);

      let compliant: boolean | null = null;
      if (value != null && entry.threshold != null) {
        compliant = value <= entry.threshold;
      }

      return {
        code: entry.code,
        label: entry.label,
        value,
        unit: entry.unit,
        threshold: entry.threshold,
        date: dis?.date_prelevement ?? null,
        compliant,
        category: entry.category,
      };
    });

    return { params };
  },
);
