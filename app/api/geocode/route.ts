import { NextRequest, NextResponse } from "next/server";
import { autocomplete } from "@/lib/apis/geocode";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
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
      { error: "Trop de requetes, veuillez reessayer dans une minute" },
      { status: 429 },
    );
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 3) {
    return NextResponse.json(
      { error: "Le parametre q doit faire au moins 3 caracteres" },
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
      { error: "Erreur du service de geocodage" },
      { status: 502 },
    );
  }
}
