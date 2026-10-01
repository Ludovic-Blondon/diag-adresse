import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../lib/apis/api-fetch";
import { API_TIMEOUT_MS } from "../lib/constants";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

/**
 * Stub fetch : `respond` sert les appels d'API, le fetch « data: » de
 * raccourcissement du cache est enregistré à part. `patched` simule le fetch
 * de Next (hors Next, aucun cache de page à raccourcir).
 */
function stubFetch(
  respond: (url: string) => Promise<Response>,
  patched = true,
) {
  const shortened: unknown[] = [];
  const mock = Object.assign(
    vi.fn(async (input: string, init?: RequestInit) => {
      if (input.startsWith("data:")) {
        shortened.push(init?.next);
        return new Response("");
      }
      return respond(input);
    }),
    patched ? { __nextPatched: true } : {},
  );
  vi.stubGlobal("fetch", mock);
  return { mock, shortened };
}

describe("apiFetch", () => {
  it("renvoie la réponse, statut et corps compris", async () => {
    const { shortened } = stubFetch(async () =>
      Response.json({ ok: 1 }, { status: 206 }),
    );
    const res = await apiFetch("https://api.test/a");
    expect(res.status).toBe(206);
    await expect(res.json()).resolves.toEqual({ ok: 1 });
    expect(shortened).toHaveLength(0);
  });

  it("coupe à API_TIMEOUT_MS même si le signal est ignoré", async () => {
    // Next retire `signal` quand il rafraîchit une entrée périmée du Data
    // Cache : la requête ne s'arrête alors jamais d'elle-même.
    vi.useFakeTimers();
    stubFetch(() => new Promise<Response>(() => {}));
    const pending = apiFetch("https://api.test/muet");
    const assertion = expect(pending).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(API_TIMEOUT_MS);
    await assertion;
  });

  it("coupe aussi un corps qui n'arrive jamais", async () => {
    vi.useFakeTimers();
    stubFetch(async () => new Response(new ReadableStream({ start() {} }), {}));
    const pending = apiFetch("https://api.test/corps");
    const assertion = expect(pending).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(API_TIMEOUT_MS);
    await assertion;
  });

  it("raccourcit le cache de la page sur une erreur réseau", async () => {
    const { shortened } = stubFetch(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(apiFetch("https://api.test/b")).rejects.toThrow(
      "fetch failed",
    );
    expect(shortened).toEqual([{ revalidate: 3600 }]);
  });

  it("raccourcit le cache sur un 5xx ou un 429, pas sur un autre 4xx", async () => {
    for (const [status, expected] of [
      [503, 1],
      [429, 1],
      [404, 0],
      [400, 0],
    ] as const) {
      const { shortened } = stubFetch(
        async () => new Response("x", { status }),
      );
      const res = await apiFetch(`https://api.test/${status}`);
      expect(res.status).toBe(status);
      expect(shortened).toHaveLength(expected);
    }
  });

  it("sert la dernière réponse en cache quand le rafraîchissement échoue", async () => {
    // Le cache de Next est simulé : seule la relecture avec revalidate: false
    // (clé identique, jamais périmée) y trouve l'entrée.
    const reads: unknown[] = [];
    const mock = Object.assign(
      vi.fn(async (input: string, init?: RequestInit) => {
        if (input.startsWith("data:")) return new Response("");
        reads.push(init?.next?.revalidate);
        if (init?.next?.revalidate === false)
          return Response.json({ v: "ancien" });
        throw new TypeError("fetch failed");
      }),
      { __nextPatched: true },
    );
    vi.stubGlobal("fetch", mock);

    const res = await apiFetch("https://api.test/d", {
      next: { revalidate: 604800 },
    });
    await expect(res.json()).resolves.toEqual({ v: "ancien" });
    expect(reads).toEqual([604800, false]);
  });

  it("propage l'échec quand aucune entrée en cache ne répond", async () => {
    const { shortened } = stubFetch(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(
      apiFetch("https://api.test/e", { next: { revalidate: 604800 } }),
    ).rejects.toThrow("fetch failed");
    expect(shortened).toHaveLength(1);
  });

  it("ne fait rien de plus hors de Next", async () => {
    const { mock } = stubFetch(async () => {
      throw new TypeError("fetch failed");
    }, false);
    await expect(apiFetch("https://api.test/c")).rejects.toThrow();
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
