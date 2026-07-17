import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchRGA } from "../lib/apis/georisques";

// fetchRGA est mémoïsé par react cache : chaque test utilise des coordonnées
// distinctes pour ne pas dépendre de l'implémentation du cache.

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
