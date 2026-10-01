import { API_TIMEOUT_MS } from "../constants";

// ISR window of a page rendered while an external API was failing: retried
// within the hour instead of keeping an "indisponible" section for the
// route's normal 7 days, without re-rendering on every visit during an outage.
const DEGRADED_REVALIDATE = 3600;

// Budget of the stale-if-error lookup. A Data Cache hit answers in
// milliseconds; without an entry the lookup becomes a fresh request, dropped
// after this delay.
const STALE_LOOKUP_MS = 1000;

// Statuses whose Response cannot carry a body.
const NULL_BODY_STATUSES = new Set([204, 205, 304]);

function isTransient(status: number): boolean {
  return status === 429 || status >= 500;
}

// Next patches the global fetch and flags it; outside Next (tests, scripts)
// there is neither a Data Cache nor a page cache to work with.
function isNextFetch(): boolean {
  return Boolean((fetch as { __nextPatched?: boolean }).__nextPatched);
}

/** Race `work` against a deadline, clearing the timer either way. */
async function withDeadline<T>(work: Promise<T>, ms: number, url: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new DOMException(`${url} timed out`, "TimeoutError")),
      ms,
    );
  });
  try {
    return await Promise.race([work, deadline]);
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch and read the whole body within `ms`, as a self-contained Response. */
async function fetchBuffered(
  url: string,
  init: RequestInit,
  ms: number,
): Promise<Response> {
  return withDeadline(
    (async () => {
      const res = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(ms),
      });
      const body = await res.arrayBuffer();
      return new Response(NULL_BODY_STATUSES.has(res.status) ? null : body, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
    })(),
    ms,
    url,
  );
}

/**
 * fetch() for every external API call, with three guarantees the bare call
 * lacks.
 *
 * Hard deadline: AbortSignal.timeout alone is not enough. When Next refreshes
 * a stale Data Cache entry during an ISR render, it drops `signal`
 * (patch-fetch.js, doOriginalFetch(isStale)), and a silent API then holds the
 * render until undici's own 300 s timeout. Racing the call and the body read
 * against API_TIMEOUT_MS keeps the render bounded; the orphaned request ends
 * in Next's waitUntil, which costs memory but no CPU.
 *
 * Stale if error: on that same refresh, Next does not fall back to the entry
 * it holds when the API fails. A second read of the same request with
 * `revalidate: false` gets it: the cache key ignores `revalidate`, and an
 * entry is only stale relative to the revalidate of the read.
 *
 * Short cache on transient failure: a timeout, a network error, a 429 or a 5xx
 * lowers the page's ISR window to DEGRADED_REVALIDATE, stale data served or
 * not. Other 4xx are definite answers (an unknown INSEE code stays unknown)
 * and keep the normal window.
 */
export async function apiFetch(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  let failure: unknown;
  try {
    const res = await fetchBuffered(url, init, API_TIMEOUT_MS);
    if (!isTransient(res.status)) return res;
    failure = res;
  } catch (err) {
    failure = err;
  }

  await markPageDegraded();
  const stale = await readStale(url, init);
  if (stale) return stale;
  if (failure instanceof Response) return failure;
  throw failure;
}

/** Last cached 200 for this request, whatever its age; null if none. */
async function readStale(
  url: string,
  init: RequestInit,
): Promise<Response | null> {
  // Only requests cached by Next (with a revalidate) have an entry.
  if (!isNextFetch() || init.next?.revalidate == null) return null;
  try {
    const res = await fetchBuffered(
      url,
      { ...init, next: { ...init.next, revalidate: false } },
      STALE_LOOKUP_MS,
    );
    return res.status === 200 ? res : null;
  } catch {
    return null;
  }
}

/**
 * Lower the current page's ISR window to DEGRADED_REVALIDATE. Next lowers a
 * route's revalidate to the lowest one declared by a fetch during the render
 * — documented as the way to "dynamically opt-in to more frequent
 * revalidation". A data: URL makes that fetch free: no network, no new way to
 * fail. Inert in a dynamic render and inside unstable_cache, which have no
 * page window to lower: callers wrapping data in unstable_cache call this
 * themselves, outside of it, when the wrapped work fails.
 */
export async function markPageDegraded(): Promise<void> {
  if (!isNextFetch()) return;
  try {
    const res = await fetch("data:,", {
      next: { revalidate: DEGRADED_REVALIDATE },
    });
    await res.arrayBuffer();
  } catch {
    // Best effort: never turn the original failure into a second one.
  }
}
