import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchWaterQuality,
  isBelowLimit,
  isNearLimit,
  parseWaterValue,
} from "../lib/apis/hubeau";
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
 * Stub fetch Hub'Eau : `bulk` répond aux requêtes groupées (code_parametre
 * multi, filtré sur les codes demandés), `single` aux fallbacks unitaires par
 * code. Comme la vraie API, rejette en 400 une liste de plus de 20 codes.
 * Renvoie le mock pour compter les appels.
 */
function stubHubeau(
  bulk: StubRow[] | "error",
  single: Record<string, StubRow[]> = {},
) {
  const mock = vi.fn(async (input: string | URL) => {
    const url = new URL(String(input));
    const codes = url.searchParams.get("code_parametre") ?? "";
    const requested = codes.split(",");
    if (requested.length > 20) return new Response("size", { status: 400 });
    if (requested.length > 1) {
      if (bulk === "error") return new Response("oops", { status: 500 });
      return Response.json({
        data: bulk.filter((r) => requested.includes(r.code_parametre)),
      });
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

describe("isBelowLimit", () => {
  it("reconnaît les résultats « <x » (rien de détecté)", () => {
    expect(isBelowLimit("<0,500")).toBe(true);
    expect(isBelowLimit("<1")).toBe(true);
  });

  it("ne confond pas avec une valeur mesurée", () => {
    expect(isBelowLimit("0,500")).toBe(false);
    expect(isBelowLimit("25")).toBe(false);
    expect(isBelowLimit(undefined)).toBe(false);
  });
});

describe("isNearLimit", () => {
  it("signale une valeur conforme mais à moins de 10 % du seuil", () => {
    expect(isNearLimit(0.5, 0.5)).toBe(true); // pesticides pile au seuil
    expect(isNearLimit(0.45, 0.5)).toBe(true);
    expect(isNearLimit(46, 50)).toBe(true); // nitrates
  });

  it("ne signale pas une valeur avec de la marge", () => {
    expect(isNearLimit(0.44, 0.5)).toBe(false);
    expect(isNearLimit(25, 50)).toBe(false);
  });

  it("ne signale pas un dépassement (déjà non conforme)", () => {
    expect(isNearLimit(0.6, 0.5)).toBe(false);
  });

  it("ignore les seuils à 0, où toute valeur conforme vaut 0", () => {
    expect(isNearLimit(0, 0)).toBe(false);
  });
});

// Requêtes groupées par rendu : Hub'Eau plafonne code_parametre à 20 codes.
const BULK_REQUESTS = Math.ceil(WATER_PARAMS.length / 20);

describe("fetchWaterQuality", () => {
  it("découpe la requête groupée en listes de 20 codes au plus", async () => {
    const mock = stubHubeau([]);
    await fetchWaterQuality("34173");

    const lists = mock.mock.calls
      .map(([input]) => new URL(String(input)).searchParams)
      .map((p) => (p.get("code_parametre") ?? "").split(","))
      .filter((codes) => codes.length > 1);
    expect(lists).toHaveLength(BULK_REQUESTS);
    expect(lists.every((codes) => codes.length <= 20)).toBe(true);
    expect(lists.flat().sort()).toEqual(WATER_PARAMS.map((p) => p.code).sort());
  });

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

    // Nitrates : dernière valeur du bulk, conforme (25 <= 50) et avec marge
    expect(byCode.get("1340")).toMatchObject({
      value: 25,
      compliant: true,
      nearLimit: false,
    });
    // pH : pas de seuil → compliant null
    expect(byCode.get("1302")).toMatchObject({ value: 7.2, compliant: null });
    // E. coli : 0 est une vraie valeur, conforme au seuil 0 — et le seuil nul
    // ne doit pas la faire passer pour « à la limite »
    expect(byCode.get("1449")).toMatchObject({
      value: 0,
      compliant: true,
      nearLimit: false,
    });
    // Spores : absents du bulk, récupérés par le fallback unitaire. « <1 »
    // est une non-détection, pas 1 germe : conforme malgré le seuil à 0.
    expect(byCode.get("1042")).toMatchObject({
      value: 1,
      belowLimit: true,
      compliant: true,
    });
    // Paramètre jamais mesuré : null partout
    expect(byCode.get("1350")).toMatchObject({
      value: null,
      compliant: null,
      date: null,
    });

    // Requêtes groupées + 1 fallback par paramètre absent du bulk
    const missingCount = WATER_PARAMS.length - 3;
    expect(mock).toHaveBeenCalledTimes(BULK_REQUESTS + missingCount);
  });

  it("retombe sur les requêtes unitaires quand le bulk répond une erreur HTTP", async () => {
    const mock = stubHubeau("error", {
      "1340": [row("1340", "30")],
    });

    const result = await fetchWaterQuality("31555");
    const byCode = new Map(result.params.map((p) => [p.code, p]));

    expect(byCode.get("1340")).toMatchObject({ value: 30, compliant: true });
    expect(mock).toHaveBeenCalledTimes(BULK_REQUESTS + WATER_PARAMS.length);
  });

  it("ne signale pas « à la limite » une non-détection au niveau du seuil", async () => {
    // Cas réel : Hub'Eau renvoie « <0,500 » pour les pesticides dans la quasi
    // totalité des communes, pour un seuil de 0,5 µg/L.
    stubHubeau([row("6276", "<0,500"), row("1340", "48")]);

    const byCode = new Map(
      (await fetchWaterQuality("38185")).params.map((p) => [p.code, p]),
    );

    expect(byCode.get("6276")).toMatchObject({
      value: 0.5,
      belowLimit: true,
      compliant: true,
      nearLimit: false,
    });
    // Nitrates réellement mesurés à 48 pour un seuil de 50 : là, on signale.
    expect(byCode.get("1340")).toMatchObject({
      value: 48,
      belowLimit: false,
      compliant: true,
      nearLimit: true,
    });
  });

  it("garde les vrais dépassements non conformes", async () => {
    stubHubeau([row("1449", "12"), row("1340", "62")]);

    const byCode = new Map(
      (await fetchWaterQuality("38185")).params.map((p) => [p.code, p]),
    );

    expect(byCode.get("1449")).toMatchObject({
      value: 12,
      belowLimit: false,
      compliant: false,
    });
    expect(byCode.get("1340")).toMatchObject({ value: 62, compliant: false });
  });

  it("lève quand l'API est entièrement indisponible", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );

    // Une Map vide se lirait « commune sans analyses » : la page doit pouvoir
    // annoncer une panne plutôt que 22 paramètres muets.
    await expect(fetchWaterQuality("13055")).rejects.toThrow(
      "HubEau unreachable",
    );
  });

  it("lève sans fallback quand le bulk expire", async () => {
    // Hub'Eau qui ne répond plus : 22 fallbacks attendraient chacun leur
    // propre timeout pour le même résultat.
    const mock = vi.fn(async (input: string | URL) => {
      const codes = new URL(String(input)).searchParams.get("code_parametre");
      if (codes?.includes(",")) {
        throw new DOMException("The operation timed out.", "TimeoutError");
      }
      return Response.json({ data: [] });
    });
    vi.stubGlobal("fetch", mock);

    await expect(fetchWaterQuality("33063")).rejects.toThrow(
      "HubEau unreachable",
    );
    expect(mock).toHaveBeenCalledTimes(BULK_REQUESTS);
  });

  it("renvoie tous les paramètres à null pour une commune sans analyses", async () => {
    // L'API répond, elle n'a simplement rien pour cette commune : c'est une
    // absence de données, pas une panne.
    stubHubeau([]);

    const result = await fetchWaterQuality("13055");
    expect(result.params).toHaveLength(WATER_PARAMS.length);
    expect(result.params.every((p) => p.value === null)).toBe(true);
  });
});
