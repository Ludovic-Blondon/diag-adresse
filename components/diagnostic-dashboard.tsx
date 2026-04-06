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

export async function DiagnosticDashboard({ lon, lat, citycode }: DashboardProps) {
  const hubeauCode = toHubeauCode(citycode);

  const [
    riskReportResult,
    radonResult,
    rgaResult,
    seismicResult,
    icpeResult,
    cavitesResult,
    waterResult,
    dpeResult,
  ] = await Promise.allSettled([
    fetchRiskReport({ lon, lat }),
    fetchRadon(citycode),
    fetchRGA(lon, lat),
    fetchSeismicZone(citycode),
    fetchICPE({ codeInsee: citycode, lon, lat }),
    fetchCavites({ codeInsee: citycode, lon, lat }),
    fetchWaterQuality(hubeauCode),
    fetchDPEStats(citycode),
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
    <div className="space-y-8">
      {/* Risk summary */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Synthese des risques</h2>
        {allRisksFailed ? (
          <p className="text-sm text-muted-foreground">
            Les donnees de risques sont temporairement indisponibles. Veuillez reessayer plus tard.
          </p>
        ) : (
          <RiskSummary risks={risks} />
        )}
      </section>

      <Separator />

      {/* Risk cards */}
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

      <Separator />

      {/* Map */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Carte</h2>
        <RiskMap
          lon={lon}
          lat={lat}
          icpeList={icpeResult.status === "fulfilled" ? icpeResult.value.data : []}
        />
      </section>

      <Separator />

      {/* Water quality */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Qualite de l&apos;eau potable</h2>
        {waterResult.status === "fulfilled" ? (
          <WaterQualityCard data={waterResult.value} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Donnees indisponibles pour cette commune.
          </p>
        )}
      </section>

      <Separator />

      {/* Energy / DPE */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Performance energetique (DPE)</h2>
        {dpeResult.status === "fulfilled" ? (
          <EnergyCard data={dpeResult.value} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun DPE disponible pour ce secteur.
          </p>
        )}
      </section>
    </div>
  );
}
