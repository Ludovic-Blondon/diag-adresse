import { NextResponse, type NextRequest } from "next/server";
import communesIndex from "./lib/communes-index.json";
import { slugifyCommune } from "./lib/commune-url";

// Bare INSEE code → canonical `slug-insee`, precomputed once at module load.
// Keys are uppercase so Corsica codes (2A/2B) match regardless of request casing.
const SLUGS = new Map(
  communesIndex.map(([code, name]) => [
    code.toUpperCase(),
    `${slugifyCommune(name)}-${code.toLowerCase()}`,
  ]),
);

// Deterministic 308 for the old `/commune/{insee}` URLs Google knows (sitemap +
// internal links). The matcher only fires on bare codes, so canonical
// `slug-insee` URLs never invoke the proxy. Unknown codes (long-tail INSEE,
// postal codes) fall through to the route's own resolution.
export function proxy(request: NextRequest) {
  const code = request.nextUrl.pathname.split("/")[2]?.toUpperCase();
  const slug = code ? SLUGS.get(code) : undefined;
  if (slug) {
    return NextResponse.redirect(new URL(`/commune/${slug}`, request.url), 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/commune/:code((?:\\d{5}|2[ABab]\\d{3}))"],
};
