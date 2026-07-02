import {
  listAvailableDepartements,
  importDepartementDiff,
  argileLevelLabel,
} from "@/lib/argile/data";
import { DEPARTEMENTS } from "@/lib/departements";

// Export CSV par département pour le kit presse (/argile-2026/presse).
// Prérendu au build pour les 95 départements couverts ; UTF-8 avec BOM et
// séparateur « ; » pour une ouverture directe dans Excel/LibreOffice en français.

interface Props {
  params: Promise<{ code: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return listAvailableDepartements().map((code) => ({ code }));
}

function csvField(value: string): string {
  return /[";\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export async function GET(_request: Request, { params }: Props) {
  const { code } = await params;
  const diff = await importDepartementDiff(code);
  if (!diff) {
    return new Response("Département non couvert", { status: 404 });
  }

  const header = [
    "code_insee",
    "commune",
    "departement",
    "exposition_2020",
    "exposition_2026",
    "delta_classe",
    "part_surface_moyen_fort_2020_pct",
    "part_surface_moyen_fort_2026_pct",
  ].join(";");

  const depName = DEPARTEMENTS[code] ?? code;
  const rows = Object.entries(diff)
    .map(([insee, c]) => ({ insee, ...c }))
    // Communes qui changent d'abord (hausses en tête), puis ordre alphabétique.
    .sort(
      (a, b) =>
        Number(a.d === 0) - Number(b.d === 0) ||
        b.d - a.d ||
        a.n.localeCompare(b.n, "fr"),
    )
    .map((c) =>
      [
        c.insee,
        csvField(c.n),
        csvField(depName),
        argileLevelLabel(c.a20.max),
        argileLevelLabel(c.a26.max),
        String(c.d),
        String(c.a20.pctMF),
        String(c.a26.pctMF),
      ].join(";"),
    );

  const csv = "\uFEFF" + [header, ...rows].join("\r\n") + "\r\n";

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="argile-2026-communes-${code}.csv"`,
    },
  });
}
