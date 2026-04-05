import type { WaterCategory } from "../constants";

export interface WaterParam {
  code: string;
  label: string;
  value: number | null;
  unit: string;
  threshold: number | null;
  date: string | null;
  compliant: boolean | null;
  category: WaterCategory;
}

export interface WaterQualityResult {
  params: WaterParam[];
}
