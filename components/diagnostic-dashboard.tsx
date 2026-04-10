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

interface DashboardProps {
  lon: number;
  lat: number;
  citycode: string;
}

function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-muted"
          style={{ width: `${80 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function DiagnosticDashboard({ lon, lat, citycode }: DashboardProps) {
  return (
    <div className="space-y-8">
      <Suspense fallback={<SectionSkeleton lines={6} />}>
        <RiskSection lon={lon} lat={lat} citycode={citycode} />
      </Suspense>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-3">Carte</h2>
        <Suspense
          fallback={
            <div className="w-full h-80 rounded-lg border bg-muted animate-pulse" />
          }
        >
          <MapSection lon={lon} lat={lat} citycode={citycode} />
        </Suspense>
      </section>

      <Separator />

      <Suspense fallback={<SectionSkeleton />}>
        <WaterSection citycode={citycode} />
      </Suspense>

      <Separator />

      <Suspense fallback={<SectionSkeleton />}>
        <EnergySection citycode={citycode} />
      </Suspense>
    </div>
  );
}

async function RiskSection({ lon, lat, citycode }: DashboardProps) {
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
        <h2 className="text-lg font-semibold mb-3">Synthese des risques</h2>
        {allRisksFailed ? (
          <p className="text-sm text-muted-foreground">
            Les donnees de risques sont temporairement indisponibles. Veuillez
            reessayer plus tard.
          </p>
        ) : (
          <RiskSummary risks={risks} />
        )}
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-3">Detail des risques</h2>
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

async function WaterSection({ citycode }: { citycode: string }) {
  const hubeauCode = toHubeauCode(citycode);
  let data = null;
  try {
    data = await fetchWaterQuality(hubeauCode);
  } catch {
    data = null;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">
        Qualite de l&apos;eau potable
      </h2>
      {data ? (
        <WaterQualityCard data={data} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Donnees indisponibles pour cette commune.
        </p>
      )}
    </section>
  );
}

async function EnergySection({ citycode }: { citycode: string }) {
  let data = null;
  try {
    data = await fetchDPEStats(citycode);
  } catch {
    data = null;
  }

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">
        Performance energetique (DPE)
      </h2>
      {data ? (
        <EnergyCard data={data} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Aucun DPE disponible pour ce secteur.
        </p>
      )}
    </section>
  );
}
