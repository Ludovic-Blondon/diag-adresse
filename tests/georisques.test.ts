import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCavites, fetchICPE, fetchRGA } from "../lib/apis/georisques";

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
    expect(urls).toHaveLength(3);
    for (const url of urls) {
      expect(url.searchParams.has("code_insee")).toBe(false);
      expect(url.searchParams.get("latlon")).toBe("2.1,48.1");
      expect(url.searchParams.get("rayon")).toBe("5000");
    }
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

  it("renvoie le total et les comptages Seveso filtrés", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        const seveso = new URL(input).searchParams.get("statutSeveso");
        if (seveso === "SEUIL_HAUT") return page(10);
        if (seveso === "SEUIL_BAS") return page(4);
        return page(207, [{ statutSeveso: null }]);
      }),
    );
    await expect(fetchICPE("69199", 2.2, 48.2)).resolves.toEqual({
      data: [{ statutSeveso: null }],
      results: 207,
      seveso: { haut: 10, bas: 4 },
    });
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
