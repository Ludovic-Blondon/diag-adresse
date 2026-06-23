import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { RiskCard } from "./risk-card";
import { RiskSummary } from "./risk-summary";
import { RiskMap } from "./risk-map";
import { WaterQualityCard } from "./water-quality-card";
import { EnergyCard } from "./energy-card";
import {
  fetchRiskReport,
  fetchRadon,
  fetchRGA,
  fetchSeismicZone,
  fetchICPE,
  fetchCavites,
} from "@/lib/apis/georisques";
import { fetchWaterQuality } from "@/lib/apis/hubeau";
import { fetchDPEStats } from "@/lib/apis/ademe-dpe";
import {
  scoreSeismic,
  scoreRadon,
  scoreRGA,
  scoreInondation,
  scoreICPE,
  scoreCavites,
  scoreRiskReport,
  type ScoredRisk,
} from "@/lib/scoring";
import { toHubeauCode } from "@/lib/paris";
import { prepositionVille } from "@/lib/commune-text";

interface DashboardProps {
  lon: number;
  lat: number;
  citycode: string;
  communeName?: string;
}

// H2 wording: search-intent questions on commune pages (communeName set),
// generic labels on the address page (communeName undefined).
function sectionHeadings(communeName?: string) {
  if (!communeName) {
    return {
      summary: "Synthèse des risques",
      detail: "Détail des risques",
      map: "Carte",
      water: "Qualité de l'eau potable",
      energy: "Performance énergétique (DPE)",
    };
  }
  const a = prepositionVille(communeName);
  return {
    summary: `Zone inondable ${a} ?`,
    detail: `Risque argile et sismicité ${a}`,
    map: `Carte des risques ${a}`,
    water: `L'eau du robinet est-elle bonne ${a} ?`,
    energy: `Les DPE ${a}`,
  };
}

function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="bg-muted h-4 rounded"
          style={{ width: `${80 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function DiagnosticDashboard({
  lon,
  lat,
  citycode,
  communeName,
}: DashboardProps) {
  const h = sectionHeadings(communeName);
  return (
    <div className="space-y-8">
      <Suspense fallback={<SectionSkeleton lines={6} />}>
        <RiskSection
          lon={lon}
          lat={lat}
          citycode={citycode}
          summaryHeading={h.summary}
          detailHeading={h.detail}
        />
      </Suspense>

      <Separator />

      <section>
        <h2 className="mb-3 text-lg font-semibold">{h.map}</h2>
        <Suspense
          fallback={
            <div className="bg-muted h-80 w-full animate-pulse rounded-lg border" />
          }
        >
          <MapSection lon={lon} lat={lat} citycode={citycode} />
        </Suspense>
      </section>

      <Separator />

      <Suspense fallback={<SectionSkeleton />}>
        <WaterSection citycode={citycode} heading={h.water} />
      </Suspense>

      <Separator />

      <Suspense fallback={<SectionSkeleton />}>
        <EnergySection citycode={citycode} heading={h.energy} />
      </Suspense>
    </div>
  );
}

async function RiskSection({
  lon,
  lat,
  citycode,
  summaryHeading,
  detailHeading,
}: DashboardProps & { summaryHeading: string; detailHeading: string }) {
  const [
    riskReportResult,
    radonResult,
    rgaResult,
    seismicResult,
    icpeResult,
    cavitesResult,
  ] = await Promise.allSettled([
    fetchRiskReport(lon, lat),
    fetchRadon(citycode),
    fetchRGA(lon, lat),
    fetchSeismicZone(citycode),
    fetchICPE(citycode, lon, lat),
    fetchCavites(citycode, lon, lat),
  ]);

  const levelOrder = { fort: 0, moyen: 1, faible: 2, negligeable: 3 };
  const risks: ScoredRisk[] = [];

  if (seismicResult.status === "fulfilled") {
    risks.push(scoreSeismic(seismicResult.value));
  }
  if (radonResult.status === "fulfilled") {
    risks.push(scoreRadon(radonResult.value));
  }
  if (rgaResult.status === "fulfilled") {
    risks.push(scoreRGA(rgaResult.value));
  }
  if (riskReportResult.status === "fulfilled") {
    const inondation = scoreInondation(riskReportResult.value);
    if (inondation) risks.push(inondation);
    risks.push(...scoreRiskReport(riskReportResult.value));
  }
  if (icpeResult.status === "fulfilled") {
    risks.push(scoreICPE(icpeResult.value));
  }
  if (cavitesResult.status === "fulfilled") {
    risks.push(scoreCavites(cavitesResult.value));
  }

  risks.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);

  const allRisksFailed =
    riskReportResult.status === "rejected" &&
    radonResult.status === "rejected" &&
    seismicResult.status === "rejected" &&
    rgaResult.status === "rejected" &&
    icpeResult.status === "rejected" &&
    cavitesResult.status === "rejected";

  return (
    <>
      <section>
        <h2 className="mb-3 text-lg font-semibold">{summaryHeading}</h2>
        {allRisksFailed ? (
          <p className="text-muted-foreground text-sm">
            Les données de risques sont temporairement indisponibles. Veuillez
            réessayer plus tard.
          </p>
        ) : (
          <RiskSummary risks={risks} />
        )}
      </section>

      <Separator />

      <section>
        <h2 className="mb-3 text-lg font-semibold">{detailHeading}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {risks.map((risk) => (
            <RiskCard
              key={risk.id}
              title={risk.label}
              level={risk.level}
              description={risk.description}
              details={risk.details}
              communeOnly={risk.source === "commune"}
            />
          ))}
        </div>
      </section>
    </>
  );
}

async function MapSection({ lon, lat, citycode }: DashboardProps) {
  let icpeList: Awaited<ReturnType<typeof fetchICPE>>["data"] = [];
  try {
    const result = await fetchICPE(citycode, lon, lat);
    icpeList = result.data;
  } catch {
    // Map still works without ICPE markers
  }

  return <RiskMap lon={lon} lat={lat} icpeList={icpeList} />;
}

async function WaterSection({
  citycode,
  heading,
}: {
  citycode: string;
  heading: string;
}) {
  const hubeauCode = toHubeauCode(citycode);
  let data = null;
  try {
    data = await fetchWaterQuality(hubeauCode);
  } catch {
    data = null;
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{heading}</h2>
      {data ? (
        <WaterQualityCard data={data} />
      ) : (
        <p className="text-muted-foreground text-sm">
          Données indisponibles pour cette commune.
        </p>
      )}
    </section>
  );
}

async function EnergySection({
  citycode,
  heading,
}: {
  citycode: string;
  heading: string;
}) {
  let data = null;
  try {
    data = await fetchDPEStats(citycode);
  } catch {
    data = null;
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{heading}</h2>
      {data ? (
        <EnergyCard data={data} />
      ) : (
        <p className="text-muted-foreground text-sm">
          Aucun DPE disponible pour ce secteur.
        </p>
      )}
    </section>
  );
}
