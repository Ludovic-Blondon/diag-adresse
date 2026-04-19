import { cache } from "react";
import { HUBEAU_BASE_URL, API_TIMEOUT_MS, WATER_PARAMS } from "../constants";
import type { WaterQualityResult, WaterParam } from "../types/hubeau";

interface HubeauResultDis {
  resultat_alphanumerique?: string;
  date_prelevement?: string;
}

interface HubeauResponse {
  data: HubeauResultDis[];
}

async function fetchLastResult(
  codeCommune: string,
  codeParametre: string,
): Promise<HubeauResultDis | null> {
  const params = new URLSearchParams({
    code_commune: codeCommune,
    code_parametre: codeParametre,
    sort: "desc",
    size: "1",
  });
  const url = `${HUBEAU_BASE_URL}/resultats_dis?${params}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const data: HubeauResponse = await res.json();
  return data.data?.[0] ?? null;
}

export const fetchWaterQuality = cache(
  async (codeCommune: string): Promise<WaterQualityResult> => {
    const results = await Promise.allSettled(
      WATER_PARAMS.map((p) => fetchLastResult(codeCommune, p.code)),
    );

    const params: WaterParam[] = WATER_PARAMS.map((entry, i) => {
      const result = results[i];
      const dis = result.status === "fulfilled" ? result.value : null;
      const rawValue = dis?.resultat_alphanumerique;
      const parsed = rawValue
        ? parseFloat(rawValue.replace(",", ".").replace(/^</, ""))
        : null;
      const value = parsed != null && !isNaN(parsed) ? parsed : null;

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
