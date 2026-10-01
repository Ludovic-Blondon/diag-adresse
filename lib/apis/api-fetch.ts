import { API_TIMEOUT_MS } from "../constants";

// ISR window of a page rendered while an external API was failing: retried
// within the hour instead of keeping an "indisponible" section for the
// route's normal 7 days, without re-rendering on every visit during an outage.
const DEGRADED_REVALIDATE = 3600;

// Statuses whose Response cannot carry a body.
const NULL_BODY_STATUSES = new Set([204, 205, 304]);

/**
 * fetch() for every external API call, with two guarantees the bare call
 * lacks.
 *
 * Hard deadline: AbortSignal.timeout alone is not enough. When Next refreshes
 * a stale Data Cache entry during an ISR render, it drops `signal`
 * (patch-fetch.js, doOriginalFetch(isStale)), and a silent API then holds the
 * render until undici's own 300 s timeout. Racing the call and the body read
 * against API_TIMEOUT_MS keeps the render bounded; the orphaned request ends
 * in Next's waitUntil, which costs memory but no CPU.
 *
 * Short cache on transient failure: a timeout, a network error, a 429 or a 5xx
 * lowers the page's ISR window to DEGRADED_REVALIDATE. Other 4xx are definite
 * answers (an unknown INSEE code stays unknown) and keep the normal window.
 */
export async function apiFetch(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new DOMException(`${url} timed out`, "TimeoutError")),
      API_TIMEOUT_MS,
    );
  });
  try {
    const res = await Promise.race([
      fetch(url, { ...init, signal: AbortSignal.timeout(API_TIMEOUT_MS) }),
      deadline,
    ]);
    const body = await Promise.race([res.arrayBuffer(), deadline]);
    if (res.status === 429 || res.status >= 500) await shortenPageCache();
    return new Response(NULL_BODY_STATUSES.has(res.status) ? null : body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  } catch (err) {
    await shortenPageCache();
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Next lowers a route's revalidate to the lowest one declared by a fetch
 * during the render — documented as the way to "dynamically opt-in to more
 * frequent revalidation". A data: URL makes that fetch free: no network, no
 * new way to fail. A dynamic render has no page cache, so the call is inert
 * there; outside Next (tests, scripts) fetch is not patched and it is skipped.
 */
async function shortenPageCache(): Promise<void> {
  if (!(fetch as { __nextPatched?: boolean }).__nextPatched) return;
  try {
    const res = await fetch("data:,", {
      next: { revalidate: DEGRADED_REVALIDATE },
    });
    await res.arrayBuffer();
  } catch {
    // Best effort: never turn the original failure into a second one.
  }
}
