import type { Metadata } from "next";
import { fetchSeismicZone, fetchRadon } from "./apis/georisques";
import { fetchDPEStats } from "./apis/ademe-dpe";
import { fetchWaterQuality } from "./apis/hubeau";
import { toHubeauCode } from "./paris";
import { RISK_LEVEL_LABELS } from "./constants";
import { scoreRadon } from "./scoring";

export interface DiagnosticSummary {
  seismicZone?: number;
  radonLevel?: string;
  waterCompliant?: boolean;
  dominantDPE?: string;
}

export async function fetchDiagnosticSummary(
  codeInsee: string,
): Promise<DiagnosticSummary> {
  const hubeauCode = toHubeauCode(codeInsee);

  const [seismicResult, radonResult, dpeResult, waterResult] =
    await Promise.allSettled([
      fetchSeismicZone(codeInsee),
      fetchRadon(codeInsee),
      fetchDPEStats(codeInsee),
      fetchWaterQuality(hubeauCode),
    ]);

  const summary: DiagnosticSummary = {};

  if (seismicResult.status === "fulfilled") {
    summary.seismicZone = seismicResult.value.data?.[0]?.code_zone;
  }

  if (radonResult.status === "fulfilled") {
    const scored = scoreRadon(radonResult.value);
    summary.radonLevel = RISK_LEVEL_LABELS[scored.level].toLowerCase();
  }

  if (dpeResult.status === "fulfilled" && dpeResult.value.totalDPE > 0) {
    const dominant = dpeResult.value.distribution.reduce((a, b) =>
      b.count > a.count ? b : a,
    );
    summary.dominantDPE = dominant.label;
  }

  if (waterResult.status === "fulfilled") {
    const keyParams = waterResult.value.params.filter(
      (p) => p.category === "indicateurs_cles" && p.compliant !== null,
    );
    if (keyParams.length > 0) {
      summary.waterCompliant = keyParams.every((p) => p.compliant);
    }
  }

  return summary;
}

const FALLBACK_DESCRIPTION = (name: string) =>
  `Risques naturels et industriels, qualite de l'eau potable et performance energetique (DPE) pour ${name}. Consultez le diagnostic complet.`;

export function generateCommuneMetadata(
  codeInsee: string,
  communeName: string,
  diagnostic?: DiagnosticSummary,
): Metadata {
  const title = `Diagnostic ${communeName} (${codeInsee})`;

  const parts: string[] = [];
  if (diagnostic?.seismicZone != null) {
    parts.push(`sismicite zone ${diagnostic.seismicZone}`);
  }
  if (diagnostic?.radonLevel) {
    parts.push(`radon ${diagnostic.radonLevel}`);
  }
  if (diagnostic?.waterCompliant != null) {
    parts.push(diagnostic.waterCompliant ? "eau conforme" : "eau non conforme");
  }
  if (diagnostic?.dominantDPE) {
    parts.push(`DPE majoritaire ${diagnostic.dominantDPE}`);
  }

  const description =
    parts.length > 0
      ? `${communeName} : ${parts.join(", ")}. Diagnostic complet des risques, qualite de l'eau et performance energetique.`
      : FALLBACK_DESCRIPTION(communeName);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}
