import { NextRequest, NextResponse } from "next/server";
import { autocomplete } from "@/lib/apis/geocode";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const hits = new Map<string, { count: number; reset: number }>();
let nextSweep = 0;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  // Sweep expired entries at most once per window: without it the map grows
  // by one entry per IP for the lifetime of the serverless instance.
  if (now >= nextSweep) {
    for (const [key, entry] of hits) {
      if (now > entry.reset) hits.delete(key);
    }
    nextSweep = now + WINDOW_MS;
  }
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS;
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes, veuillez réessayer dans une minute" },
      { status: 429 },
    );
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 3) {
    return NextResponse.json(
      { error: "Le paramètre q doit faire au moins 3 caractères" },
      { status: 400 },
    );
  }

  try {
    const suggestions = await autocomplete(q);
    return NextResponse.json(suggestions, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur du service de géocodage" },
      { status: 502 },
    );
  }
}
