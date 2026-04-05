import { NextRequest, NextResponse } from "next/server";
import { autocomplete } from "@/lib/apis/geocode";

export async function GET(request: NextRequest) {
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
