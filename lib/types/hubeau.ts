import type { WaterCategory } from "../constants";

export interface WaterParam {
  code: string;
  label: string;
  value: number | null;
  unit: string;
  threshold: number | null;
  date: string | null;
  compliant: boolean | null;
  /** Résultat « <x » : rien n'a été détecté au-dessus de la limite de quantification du labo */
  belowLimit: boolean;
  /** Conforme sur une valeur réellement mesurée, à moins de 10 % du seuil */
  nearLimit: boolean;
  category: WaterCategory;
}

export interface WaterQualityResult {
  params: WaterParam[];
}
