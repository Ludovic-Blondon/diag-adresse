import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchDPEStats } from "../lib/apis/ademe-dpe";

afterEach(() => {
  vi.unstubAllGlobals();
});

/**
 * Stub fetch ADEME : `values_agg` porte la distribution, `metric_agg` les deux
 * moyennes (conso puis GES). Passer "error" fait répondre 500 à la route.
 */
function stubAdeme(
  values: { aggs: { value: string; total: number }[]; total: number } | "error",
  metrics: (number | "error")[] = [150, 25],
) {
  let metricCall = 0;
  const mock = vi.fn(async (input: string | URL) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("/values_agg")) {
      if (values === "error") return new Response("oops", { status: 500 });
      return Response.json(values);
    }
    const metric = metrics[metricCall++];
    if (metric === "error") return new Response("oops", { status: 500 });
    return Response.json({ metric, total: 42 });
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

describe("fetchDPEStats", () => {
  it("répartit les étiquettes et remonte les moyennes", async () => {
    stubAdeme({
      aggs: [
        { value: "D", total: 30 },
        { value: "c", total: 12 },
      ],
      total: 42,
    });

    const stats = await fetchDPEStats("34172");

    expect(stats.totalDPE).toBe(42);
    expect(stats.avgConso).toBe(150);
    expect(stats.avgGES).toBe(25);
    // La casse de l'étiquette varie côté ADEME
    expect(stats.distribution).toContainEqual({ label: "C", count: 12 });
    expect(stats.distribution).toContainEqual({ label: "D", count: 30 });
    expect(stats.distribution).toContainEqual({ label: "A", count: 0 });
  });

  it("renvoie 0 DPE pour une commune sans logement diagnostiqué", async () => {
    // L'API répond, le secteur n'a simplement aucun DPE : ce n'est pas une
    // panne, la carte doit afficher « aucun DPE ».
    stubAdeme({ aggs: [], total: 0 });

    const stats = await fetchDPEStats("31555");
    expect(stats.totalDPE).toBe(0);
  });

  it("garde les moyennes à null quand seul metric_agg échoue", async () => {
    stubAdeme({ aggs: [{ value: "E", total: 5 }], total: 5 }, [
      "error",
      "error",
    ]);

    const stats = await fetchDPEStats("38185");
    expect(stats.totalDPE).toBe(5);
    expect(stats.avgConso).toBeNull();
    expect(stats.avgGES).toBeNull();
  });

  it("lève quand la distribution est indisponible", async () => {
    // Sans distribution, totalDPE vaudrait 0 et la carte annoncerait à tort
    // « aucun DPE » : la page doit pouvoir parler de panne.
    stubAdeme("error");

    await expect(fetchDPEStats("13055")).rejects.toThrow(
      "ADEME DPE unreachable",
    );
  });
});
