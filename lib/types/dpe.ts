import type { DPELabel } from "../constants";

export interface DPEDistribution {
  label: DPELabel;
  count: number;
}

export interface DPEStats {
  distribution: DPEDistribution[];
  avgConso: number | null; // kWh/m2/an
  avgGES: number | null; // kgCO2/m2/an
  totalDPE: number;
}
