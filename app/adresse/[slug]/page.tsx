import { Suspense } from "react";
import type { Metadata } from "next";
import { autocomplete } from "@/lib/apis/geocode";
import { slugToQuery } from "@/lib/slug";
import { AddressSearch } from "@/components/address-search";
import { ShareButton } from "@/components/share-button";
import { DiagnosticDashboard } from "@/components/diagnostic-dashboard";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { placeJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";
import { DashboardSkeleton } from "./loading";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lon?: string; lat?: string; citycode?: string }>;
}

async function resolveAddress(slug: string, sp: { lon?: string; lat?: string; citycode?: string }) {
  if (sp.lon && sp.lat && sp.citycode) {
    const lon = parseFloat(sp.lon);
    const lat = parseFloat(sp.lat);
    if (!Number.isNaN(lon) && !Number.isNaN(lat) && /^\d{5}$/.test(sp.citycode)) {
      return { label: slugToQuery(slug), lon, lat, citycode: sp.citycode };
    }
  }
  const results = await autocomplete(slugToQuery(slug), 1);
  if (results.length === 0) return null;
  const r = results[0];
  return { label: r.label, lon: r.lon, lat: r.lat, citycode: r.citycode };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const address = await resolveAddress(slug, sp);
  const title = address ? `Diagnostic - ${address.label}` : "Diagnostic adresse";
  const description = address
    ? `Risques, qualite de l'eau et DPE pour ${address.label}`
    : "Diagnostic complet de votre adresse";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      siteName: "DiagAdresse",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/adresse/${slug}`,
    },
  };
}

export default async function DiagnosticPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const address = await resolveAddress(slug, sp);

  if (!address) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">Adresse introuvable</h1>
        <p className="text-muted-foreground mb-8">
          Nous n&apos;avons pas pu identifier cette adresse.
        </p>
        <AddressSearch />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            placeJsonLd({
              name: address.label,
              description: `Diagnostic complet pour ${address.label} : risques, qualite de l'eau, performance energetique.`,
              latitude: address.lat,
              longitude: address.lon,
              url: `${BASE_URL}/adresse/${slug}`,
            }),
          ),
        }}
      />
      <Breadcrumbs
        items={[{ name: address.label, href: `/adresse/${slug}` }]}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{address.label}</h1>
          <p className="text-sm text-muted-foreground">
            Code INSEE : {address.citycode} — Coordonnees : {address.lat.toFixed(5)},{" "}
            {address.lon.toFixed(5)}
          </p>
        </div>
        <ShareButton
          title={`Diagnostic - ${address.label}`}
          url={`${BASE_URL}/adresse/${slug}`}
        />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DiagnosticDashboard
          lon={address.lon}
          lat={address.lat}
          citycode={address.citycode}
        />
      </Suspense>
    </main>
  );
}
