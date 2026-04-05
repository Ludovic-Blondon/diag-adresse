"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  WATER_CATEGORY_LABELS,
  type WaterCategory,
} from "@/lib/constants";
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

  const keyParams = data.params.filter((p) => p.category === "indicateurs_cles");

  if (data.params.every((p) => p.value == null)) {
    return (
      <p className="text-sm text-muted-foreground">
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
            <div key={cat} className="rounded-lg border overflow-hidden">
              <button
                onClick={() => toggle(cat)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-accent/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {WATER_CATEGORY_LABELS[cat]}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({catParams.length} parametre{catParams.length > 1 ? "s" : ""})
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      allCompliant ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <svg
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
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
                <div className="border-t px-4 py-3 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-muted-foreground">
                        <th className="text-left font-medium pb-2">Parametre</th>
                        <th className="text-right font-medium pb-2">Valeur</th>
                        <th className="text-right font-medium pb-2">Seuil</th>
                        <th className="text-right font-medium pb-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {catParams.map((p) => (
                        <tr key={p.code}>
                          <td className="py-2 pr-4">{p.label}</td>
                          <td className="py-2 text-right tabular-nums whitespace-nowrap">
                            {p.value?.toFixed(2)}{" "}
                            <span className="text-muted-foreground">{p.unit}</span>
                          </td>
                          <td className="py-2 text-right text-muted-foreground tabular-nums whitespace-nowrap">
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
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {catParams[0]?.date && (
                    <p className="text-xs text-muted-foreground mt-2">
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
        <CardTitle className="text-sm font-medium flex items-center justify-between">
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
                <span className="text-sm text-muted-foreground">{param.unit}</span>
              )}
            </div>
            {param.threshold != null && (
              <>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      param.compliant ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min((param.value / param.threshold) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Seuil : {param.threshold} {param.unit}
                </p>
              </>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Non mesure</p>
        )}
        {param.date && (
          <p className="text-xs text-muted-foreground">
            Prelevement : {param.date}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
