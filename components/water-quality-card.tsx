"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WATER_CATEGORY_LABELS, type WaterCategory } from "@/lib/constants";
import type { WaterQualityResult, WaterParam } from "@/lib/types/hubeau";

interface WaterQualityCardProps {
  data: WaterQualityResult;
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
        Aucune donnee disponible pour cette commune.
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

          return (
            <div key={cat} className="overflow-hidden rounded-lg border">
              <button
                onClick={() => toggle(cat)}
                className="hover:bg-accent/50 flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  {WATER_CATEGORY_LABELS[cat]}
                  <span className="text-muted-foreground text-xs font-normal">
                    ({catParams.length} parametre
                    {catParams.length > 1 ? "s" : ""})
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      allCompliant ? "bg-green-500" : "bg-red-500"
                    }`}
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
                          Parametre
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
                            {p.value?.toFixed(2)}{" "}
                            <span className="text-muted-foreground">
                              {p.unit}
                            </span>
                          </td>
                          <td className="text-muted-foreground py-2 text-right whitespace-nowrap tabular-nums">
                            {p.threshold != null
                              ? `${p.threshold} ${p.unit}`
                              : "—"}
                          </td>
                          <td className="py-2 text-right">
                            {p.compliant != null ? (
                              <span
                                className={`text-xs font-semibold ${
                                  p.compliant
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {p.compliant ? "OK" : "Depassement"}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {catParams[0]?.date && (
                    <p className="text-muted-foreground mt-2 text-xs">
                      Dernier prelevement : {catParams[0].date}
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

function ParamCard({ param }: { param: WaterParam }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          {param.label}
          {param.compliant != null && (
            <span
              className={`text-xs font-semibold ${
                param.compliant
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {param.compliant ? "Conforme" : "Non conforme"}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {param.value != null ? (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums">
                {param.value.toFixed(param.value < 1 ? 2 : 1)}
              </span>
              {param.unit && (
                <span className="text-muted-foreground text-sm">
                  {param.unit}
                </span>
              )}
            </div>
            {param.threshold != null && (
              <>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${
                      param.compliant ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min((param.value / param.threshold) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Seuil : {param.threshold} {param.unit}
                </p>
              </>
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-sm">Non mesure</p>
        )}
        {param.date && (
          <p className="text-muted-foreground text-xs">
            Prelevement : {param.date}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
