"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WATER_CATEGORY_LABELS, type WaterCategory } from "@/lib/constants";
import { formatDateFr, formatNumberFr } from "@/lib/format";
import type { WaterQualityResult, WaterParam } from "@/lib/types/hubeau";

interface WaterQualityCardProps {
  data: WaterQualityResult;
}

/**
 * Statut d'affichage d'un paramètre. Le cas « conforme mais à la limite du
 * seuil » a sa propre couleur : un pesticide à 0,50 µg/L pour un seuil de
 * 0,5 est réglementairement conforme, l'afficher comme un simple « OK » le
 * présente à tort comme sans enjeu.
 */
function complianceStatus(param: WaterParam) {
  if (param.compliant == null) return null;
  if (!param.compliant) {
    return {
      label: "Non conforme",
      short: "Dépassement",
      text: "text-red-600 dark:text-red-400",
      bar: "bg-red-500",
    };
  }
  if (param.nearLimit) {
    return {
      label: "Conforme — à la limite du seuil",
      short: "Limite",
      text: "text-amber-600 dark:text-amber-400",
      bar: "bg-amber-500",
    };
  }
  return {
    label: "Conforme",
    short: "OK",
    text: "text-green-600 dark:text-green-400",
    bar: "bg-green-500",
  };
}

/**
 * Bactériologie : le seuil réglementaire est l'absence (0 dans 100 mL) et le
 * labo rapporte « <1 », sa limite de comptage — il compte des colonies
 * entières. Afficher « < 1,00 » face à un seuil de 0 se lit comme un
 * dépassement alors que le prélèvement est conforme ; l'ARS parle d'absence,
 * on écrit la même chose.
 */
function isAbsence(param: WaterParam): boolean {
  return param.belowLimit && param.threshold === 0;
}

const DETAIL_CATEGORIES: WaterCategory[] = [
  "physicochimie",
  "mineraux",
  "metaux",
  "bacteriologie",
];

export function WaterQualityCard({ data }: WaterQualityCardProps) {
  const [openCategories, setOpenCategories] = useState<Set<WaterCategory>>(
    new Set(),
  );

  const keyParams = data.params.filter(
    (p) => p.category === "indicateurs_cles",
  );

  if (data.params.every((p) => p.value == null)) {
    return (
      <p className="text-muted-foreground text-sm">
        Aucune donnée disponible pour cette commune.
      </p>
    );
  }

  const toggle = (cat: WaterCategory) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Key indicators as cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {keyParams.map((param) => (
          <ParamCard key={param.code} param={param} />
        ))}
      </div>

      {/* Detail categories — collapsible */}
      <div className="space-y-2">
        {DETAIL_CATEGORIES.map((cat) => {
          const catParams = data.params.filter(
            (p) => p.category === cat && p.value != null,
          );
          if (catParams.length === 0) return null;

          const isOpen = openCategories.has(cat);
          const allCompliant = catParams.every(
            (p) => p.compliant == null || p.compliant,
          );
          const anyNearLimit = catParams.some((p) => p.nearLimit);
          const dotColor = !allCompliant
            ? "bg-red-500"
            : anyNearLimit
              ? "bg-amber-500"
              : "bg-green-500";

          return (
            <div key={cat} className="overflow-hidden rounded-lg border">
              <button
                onClick={() => toggle(cat)}
                className="hover:bg-accent/50 flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  {WATER_CATEGORY_LABELS[cat]}
                  <span className="text-muted-foreground text-xs font-normal">
                    ({catParams.length} paramètre
                    {catParams.length > 1 ? "s" : ""})
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${dotColor}`}
                  />
                  <svg
                    className={`text-muted-foreground h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="overflow-x-auto border-t px-4 py-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground text-xs">
                        <th className="pb-2 text-left font-medium">
                          Paramètre
                        </th>
                        <th className="pb-2 text-right font-medium">Valeur</th>
                        <th className="pb-2 text-right font-medium">Seuil</th>
                        <th className="pb-2 text-right font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {catParams.map((p) => (
                        <tr key={p.code}>
                          <td className="py-2 pr-4">{p.label}</td>
                          <td className="py-2 text-right whitespace-nowrap tabular-nums">
                            {isAbsence(p) ? (
                              "Absence"
                            ) : (
                              <>
                                {p.belowLimit ? "< " : ""}
                                {p.value != null
                                  ? formatNumberFr(p.value, 2)
                                  : "—"}{" "}
                                <span className="text-muted-foreground">
                                  {p.unit}
                                </span>
                              </>
                            )}
                          </td>
                          <td className="text-muted-foreground py-2 text-right whitespace-nowrap tabular-nums">
                            {p.threshold != null
                              ? `${formatNumberFr(p.threshold)} ${p.unit}`
                              : "—"}
                          </td>
                          <td className="py-2 text-right">
                            <ParamStatus param={p} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {catParams[0]?.date && (
                    <p className="text-muted-foreground mt-2 text-xs">
                      Dernier prélèvement : {formatDateFr(catParams[0].date)}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Dureté (TH) — échelle indicative en degrés français (°f)
const HARDNESS_CODE = "1345";

const HARDNESS_SCALE = [
  { max: 7, range: "0–7°f", label: "très douce" },
  { max: 15, range: "7–15°f", label: "douce" },
  { max: 30, range: "15–30°f", label: "moyennement dure" },
  { max: 40, range: "30–40°f", label: "dure" },
  { max: Infinity, range: "> 40°f", label: "très dure" },
] as const;

function hardnessBand(value: number) {
  return HARDNESS_SCALE.find((b) => value < b.max) ?? HARDNESS_SCALE.at(-1)!;
}

function HardnessHelp({ value }: { value: number }) {
  const band = hardnessBand(value);
  const formatted = value.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  const calcaire = value >= 30 ? " (calcaire)" : "";

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label="Aide sur la dureté de l'eau"
        className="text-muted-foreground/60 hover:text-muted-foreground shrink-0 cursor-help transition-colors"
      >
        <CircleHelp className="size-3.5" aria-hidden />
      </TooltipTrigger>
      <TooltipContent className="max-w-[16rem]">
        <div className="space-y-1.5 text-left">
          <p>
            {formatted}°f correspond à une eau {band.label}
            {calcaire}.
          </p>
          <div className="border-background/20 space-y-0.5 border-t pt-1.5">
            <p className="text-background/60">Échelle indicative</p>
            <ul className="space-y-0.5">
              {HARDNESS_SCALE.map((b) => (
                <li
                  key={b.range}
                  className={b === band ? "font-medium" : "text-background/60"}
                >
                  {b.range} : {b.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function ParamStatus({ param }: { param: WaterParam }) {
  const status = complianceStatus(param);
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <span className={`text-xs font-semibold ${status.text}`}>
      {status.short}
    </span>
  );
}

function ParamCard({ param }: { param: WaterParam }) {
  const status = complianceStatus(param);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-1.5">
            {param.label}
            {param.code === HARDNESS_CODE && param.value != null && (
              <HardnessHelp value={param.value} />
            )}
          </span>
          {status && (
            <span className={`text-right text-xs font-semibold ${status.text}`}>
              {status.label}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {param.value != null ? (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums">
                {isAbsence(param) ? (
                  "Absence"
                ) : (
                  <>
                    {param.belowLimit ? "< " : ""}
                    {formatNumberFr(param.value, param.value < 1 ? 2 : 1)}
                  </>
                )}
              </span>
              {param.unit && !isAbsence(param) && (
                <span className="text-muted-foreground text-sm">
                  {param.unit}
                </span>
              )}
            </div>
            {param.threshold != null && (
              <>
                {/* Pas de jauge sur une non-détection : « <0,5 » pour un seuil
                    de 0,5 dessinerait une barre pleine, soit l'inverse de ce
                    que dit la mesure. */}
                {!param.belowLimit && (
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status?.bar ?? "bg-muted-foreground"
                      }`}
                      style={{
                        width: `${Math.min((param.value / param.threshold) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
                <p className="text-muted-foreground text-xs">
                  Seuil : {formatNumberFr(param.threshold)} {param.unit}
                </p>
              </>
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-sm">Non mesuré</p>
        )}
        {param.date && (
          <p className="text-muted-foreground text-xs">
            Prélèvement : {formatDateFr(param.date)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
