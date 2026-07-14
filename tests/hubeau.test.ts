import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWaterQuality, parseWaterValue } from "../lib/apis/hubeau";
import { WATER_PARAMS } from "../lib/constants";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseWaterValue", () => {
  it("parse les décimales à virgule", () => {
    expect(parseWaterValue("7,71")).toBe(7.71);
    expect(parseWaterValue("25")).toBe(25);
    expect(parseWaterValue("0")).toBe(0);
  });

  it("traite « <x » (limite de détection) comme x", () => {
    expect(parseWaterValue("<0,5")).toBe(0.5);
    expect(parseWaterValue("<10")).toBe(10);
  });

  it("renvoie null pour les valeurs absentes ou non numériques", () => {
    expect(parseWaterValue(undefined)).toBeNull();
    expect(parseWaterValue("")).toBeNull();
    expect(parseWaterValue("ND")).toBeNull();
  });
});

interface StubRow {
  code_parametre: string;
  resultat_alphanumerique: string;
  date_prelevement: string;
}

/**
 * Stub fetch Hub'Eau : `bulk` répond à la requête groupée (code_parametre
 * multi), `single` répond aux fallbacks unitaires par code. Renvoie le mock
 * pour compter les appels.
 */
function stubHubeau(
  bulk: StubRow[] | "error",
  single: Record<string, StubRow[]> = {},
) {
  const mock = vi.fn(async (input: string | URL) => {
    const url = new URL(String(input));
    const codes = url.searchParams.get("code_parametre") ?? "";
    if (codes.includes(",")) {
      if (bulk === "error") return new Response("oops", { status: 500 });
      return Response.json({ data: bulk });
    }
    return Response.json({ data: single[codes] ?? [] });
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

const row = (
  code: string,
  value: string,
  date = "2026-01-30T13:05:00Z",
): StubRow => ({
  code_parametre: code,
  resultat_alphanumerique: value,
  date_prelevement: date,
});

describe("fetchWaterQuality", () => {
  it("prend le premier résultat par paramètre du bulk (le plus récent) et complète en unitaire", async () => {
    const mock = stubHubeau(
      [
        row("1340", "25", "2026-01-30T13:05:00Z"),
        row("1302", "7,2", "2026-01-30T13:05:00Z"),
        row("1340", "42", "2026-01-15T09:00:00Z"), // plus ancien : ignoré
        row("1449", "0", "2026-01-30T13:05:00Z"),
      ],
      { "1042": [row("1042", "<1", "2025-11-02T08:00:00Z")] },
    );

    const result = await fetchWaterQuality("34172");
    const byCode = new Map(result.params.map((p) => [p.code, p]));

    // Nitrates : dernière valeur du bulk, conforme (25 <= 50)
    expect(byCode.get("1340")).toMatchObject({ value: 25, compliant: true });
    // pH : pas de seuil → compliant null
    expect(byCode.get("1302")).toMatchObject({ value: 7.2, compliant: null });
    // E. coli : 0 est une vraie valeur, conforme au seuil 0
    expect(byCode.get("1449")).toMatchObject({ value: 0, compliant: true });
    // Spores : absents du bulk, récupérés par le fallback unitaire
    expect(byCode.get("1042")).toMatchObject({ value: 1, compliant: false });
    // Paramètre jamais mesuré : null partout
    expect(byCode.get("1350")).toMatchObject({
      value: null,
      compliant: null,
      date: null,
    });

    // 1 requête bulk + 1 fallback par paramètre absent du bulk
    const missingCount = WATER_PARAMS.length - 3;
    expect(mock).toHaveBeenCalledTimes(1 + missingCount);
  });

  it("retombe sur les requêtes unitaires pour tout quand le bulk échoue", async () => {
    const mock = stubHubeau("error", {
      "1340": [row("1340", "30")],
    });

    const result = await fetchWaterQuality("31555");
    const byCode = new Map(result.params.map((p) => [p.code, p]));

    expect(byCode.get("1340")).toMatchObject({ value: 30, compliant: true });
    expect(mock).toHaveBeenCalledTimes(1 + WATER_PARAMS.length);
  });

  it("renvoie tous les paramètres à null quand l'API est entièrement indisponible", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );

    const result = await fetchWaterQuality("13055");
    expect(result.params).toHaveLength(WATER_PARAMS.length);
    expect(result.params.every((p) => p.value === null)).toBe(true);
  });
});
