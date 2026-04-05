import type { ScoredRisk } from "../scoring";
import type { WaterQualityResult } from "./hubeau";
import type { DPEStats } from "./dpe";

export interface DiagnosticResult {
  address: {
    label: string;
    lon: number;
    lat: number;
    citycode: string;
  };
  risks: ScoredRisk[];
  water: WaterQualityResult | null;
  dpe: DPEStats | null;
}
