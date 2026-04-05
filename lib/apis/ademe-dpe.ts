import { ADEME_DPE_BASE_URL, API_TIMEOUT_MS, DPE_LABELS } from "../constants";
import type { DPEStats, DPEDistribution } from "../types/dpe";
import type { DPELabel } from "../constants";

interface AggBucket {
  value: string;
  total: number;
}

interface ValuesAggResponse {
  aggs: AggBucket[];
  total: number;
}

interface MetricAggResponse {
  metric: number;
  total: number;
}

async function ademeFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params);
  const url = `${ADEME_DPE_BASE_URL}${path}?${qs}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    next: { revalidate: 604800 }, // 7 days
  });
  if (!res.ok) throw new Error(`ADEME DPE ${path} ${res.status}`);
  return res.json();
}

export async function fetchDPEStats(codeInsee: string): Promise<DPEStats> {
  const filter = `code_insee_ban:${codeInsee}`;

  const [distResult, consoResult, gesResult] = await Promise.allSettled([
    ademeFetch<ValuesAggResponse>("/values_agg", {
      field: "etiquette_dpe",
      qs: filter,
      agg_size: "10",
      size: "0",
    }),
    ademeFetch<MetricAggResponse>("/metric_agg", {
      metric: "avg",
      field: "conso_5_usages_par_m2_ep",
      qs: filter,
    }),
    ademeFetch<MetricAggResponse>("/metric_agg", {
      metric: "avg",
      field: "emission_ges_5_usages_par_m2",
      qs: filter,
    }),
  ]);

  // Build distribution
  const buckets =
    distResult.status === "fulfilled" ? distResult.value.aggs : [];
  const totalDPE =
    distResult.status === "fulfilled" ? distResult.value.total : 0;

  const distribution: DPEDistribution[] = DPE_LABELS.map((label) => {
    const bucket = buckets.find(
      (b) => b.value.toUpperCase() === label,
    );
    return { label: label as DPELabel, count: bucket?.total ?? 0 };
  });

  const avgConso =
    consoResult.status === "fulfilled" ? consoResult.value.metric : null;
  const avgGES =
    gesResult.status === "fulfilled" ? gesResult.value.metric : null;

  return { distribution, avgConso, avgGES, totalDPE };
}
