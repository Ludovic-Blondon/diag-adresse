import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiagnosticDashboard } from "@/components/diagnostic-dashboard";
import { DashboardSkeleton } from "@/app/adresse/[slug]/loading";
import { generateCommuneMetadata, fetchDiagnosticSummary } from "@/lib/seo";
import { TOP_COMMUNES } from "@/lib/communes";
import { AddressSearch } from "@/components/address-search";

export const revalidate = 604800; // 7 days

interface Props {
  params: Promise<{ codeInsee: string }>;
}

async function getCommuneInfo(codeInsee: string) {
  const known = TOP_COMMUNES.find((c) => c.code === codeInsee);
  if (known) return known;
  // Try reverse geocode with a rough center — fallback
  return { code: codeInsee, name: `Commune ${codeInsee}` };
}

export async function generateMetadata({ params }: Props) {
  const { codeInsee } = await params;
  const commune = await getCommuneInfo(codeInsee);
  const summary = await fetchDiagnosticSummary(codeInsee);
  return generateCommuneMetadata(codeInsee, commune.name, summary);
}

export default async function CommunePage({ params }: Props) {
  const { codeInsee } = await params;
  const commune = await getCommuneInfo(codeInsee);

  // Get approximate center via reverse geocode of the commune
  // For now, use a simple approach: geocode the commune name
  const { autocomplete } = await import("@/lib/apis/geocode");
  const results = await autocomplete(commune.name, 1);
  const center = results[0];

  if (!center) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; Retour
        </Link>
        <h1 className="text-2xl font-bold mt-2">{commune.name}</h1>
        <p className="text-sm text-muted-foreground">
          Code INSEE : {codeInsee}
        </p>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm mb-3">
          Affiner le diagnostic avec une adresse precise :
        </p>
        <AddressSearch />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DiagnosticDashboard
          lon={center.lon}
          lat={center.lat}
          citycode={codeInsee}
        />
      </Suspense>
    </main>
  );
}
