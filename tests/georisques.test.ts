import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchCavites,
  fetchICPE,
  fetchRadon,
  fetchRGA,
  fetchRiskReport,
  fetchSeismicZone,
} from "../lib/apis/georisques";

// Les fetchers sont mémoïsés par react cache : chaque test utilise des
// coordonnées distinctes pour ne pas dépendre de l'implémentation du cache.

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchRGA", () => {
  it("renvoie {} sur un corps vide (hors couverture)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 200 })),
    );
    await expect(fetchRGA(1.1, 42.1)).resolves.toEqual({});
  });

  it("parse la réponse JSON de l'endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              codeExposition: "2",
              exposition: "Exposition moyenne",
            }),
            { status: 200 },
          ),
      ),
    );
    await expect(fetchRGA(1.2, 42.2)).resolves.toEqual({
      codeExposition: "2",
      exposition: "Exposition moyenne",
    });
  });

  it("rejette sur une erreur HTTP au lieu de renvoyer {}", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("oops", { status: 500 })),
    );
    await expect(fetchRGA(1.3, 42.3)).rejects.toThrow("RGA 500");
  });

  it("rejette sur une erreur réseau au lieu de renvoyer {}", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );
    await expect(fetchRGA(1.4, 42.4)).rejects.toThrow("fetch failed");
  });
});

function page(results: number, data: unknown[] = []) {
  return new Response(JSON.stringify({ results, data }), { status: 200 });
}

describe("fetchICPE", () => {
  it("cherche au rayon seul quand les coordonnées sont fournies", async () => {
    const urls: URL[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        urls.push(new URL(input));
        return page(0);
      }),
    );
    await fetchICPE("75056", 2.1, 48.1);
    // Total, Seveso haut, Seveso bas (5 km) et marqueurs proches (1 km).
    expect(urls).toHaveLength(4);
    for (const url of urls) {
      expect(url.searchParams.has("code_insee")).toBe(false);
      expect(url.searchParams.get("latlon")).toBe("2.1,48.1");
    }
    expect(urls.map((u) => u.searchParams.get("rayon")).sort()).toEqual([
      "1000",
      "5000",
      "5000",
      "5000",
    ]);
  });

  it("garde code_insee sans coordonnées", async () => {
    const urls: URL[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        urls.push(new URL(input));
        return page(0);
      }),
    );
    await fetchICPE("75057");
    expect(urls[0].searchParams.get("code_insee")).toBe("75057");
    expect(urls[0].searchParams.has("latlon")).toBe(false);
  });

  it("renvoie le total, les comptages Seveso et les marqueurs de la carte", async () => {
    const haut = { codeAIOT: "1", statutSeveso: "Seveso seuil haut" };
    const proche = {
      codeAIOT: "2",
      statutSeveso: null,
      inspections: [{ lourd: true }],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        const params = new URL(input).searchParams;
        const seveso = params.get("statutSeveso");
        if (seveso === "SEUIL_HAUT") return page(1, [haut]);
        if (seveso === "SEUIL_BAS") return page(0);
        if (params.get("rayon") === "1000") return page(2, [proche, haut]);
        return page(207);
      }),
    );
    const icpe = await fetchICPE("69199", 2.2, 48.2);
    expect(icpe).toMatchObject({
      results: 207,
      seveso: { haut: 1, bas: 0 },
      nearbyTotal: 2,
    });
    // Seveso du rayon et sites proches, dédoublonnés, sans les champs lourds.
    expect(icpe.data.map((s) => s.codeAIOT)).toEqual(["1", "2"]);
    expect(icpe.data[1]).not.toHaveProperty("inspections");
  });

  it("rejette si un comptage Seveso échoue", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) =>
        new URL(input).searchParams.has("statutSeveso")
          ? new Response("oops", { status: 500 })
          : page(3),
      ),
    );
    await expect(fetchICPE("69199", 2.3, 48.3)).rejects.toThrow(
      "Georisques /installations_classees 500",
    );
  });
});

describe("fetchCavites", () => {
  it("cherche au rayon seul quand les coordonnées sont fournies", async () => {
    const urls: URL[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        urls.push(new URL(input));
        return page(42);
      }),
    );
    await expect(fetchCavites("80021", 2.4, 49.9)).resolves.toMatchObject({
      results: 42,
    });
    expect(urls[0].searchParams.has("code_insee")).toBe(false);
    expect(urls[0].searchParams.get("latlon")).toBe("2.4,49.9");
  });
});

describe("fetchRiskReport", () => {
  it("se replie sur GASPAR (statut communal) quand le rapport échoue", async () => {
    const urls: URL[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        const url = new URL(input);
        urls.push(url);
        if (url.pathname.endsWith("/resultats_rapport_risque")) {
          throw new TypeError("fetch failed");
        }
        return Response.json({
          data: [
            {
              risques_detail: [
                { num_risque: "11" },
                { num_risque: "112" },
                { num_risque: "13" },
              ],
            },
          ],
        });
      }),
    );
    const report = await fetchRiskReport(2.5, 48.5, "75104");
    expect(report.risquesNaturels).toEqual([
      {
        present: true,
        libelle: "Inondation",
        libelleStatutCommune: "Risque Existant",
      },
    ]);
    // GASPAR n'indexe que le code commune global.
    expect(urls[1].searchParams.get("code_insee")).toBe("75056");
  });

  it("rejette sans code commune pour se replier", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );
    await expect(fetchRiskReport(2.6, 48.6)).rejects.toThrow("fetch failed");
  });
});

describe("fetchRadon / fetchSeismicZone", () => {
  it("interroge les arrondissements et garde la classe la plus élevée", async () => {
    const urls: URL[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        const url = new URL(input);
        urls.push(url);
        return url.pathname.endsWith("/radon")
          ? Response.json({
              data: [
                { code_insee: "13201", classe_potentiel: 1 },
                { code_insee: "13216", classe_potentiel: 2 },
              ],
            })
          : Response.json({ data: [{ code_zone: 2 }] });
      }),
    );
    const radon = await fetchRadon("13055");
    expect(radon.data[0]).toEqual({ code_insee: "13216", classe_potentiel: 2 });
    const codes = urls[0].searchParams.get("code_insee")!.split(",");
    expect(codes).toHaveLength(17); // la commune + 16 arrondissements

    // Paris : 21 codes, l'API en accepte 20 par requête.
    await fetchRadon("75056");
    const parisLists = urls
      .slice(1)
      .map((u) => u.searchParams.get("code_insee")!.split(","));
    expect(parisLists.map((l) => l.length)).toEqual([20, 1]);
    urls.length = 1;

    await fetchSeismicZone("34172");
    expect(urls[1].searchParams.get("code_insee")).toBe("34172");
  });
});
