import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DPE_COLORS, DPE_LABELS } from "@/lib/constants";
import type { DPEStats } from "@/lib/types/dpe";

interface EnergyCardProps {
  data: DPEStats;
}

export function EnergyCard({ data }: EnergyCardProps) {
  if (data.totalDPE === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Aucun DPE disponible pour ce secteur.
      </p>
    );
  }

  const maxCount = Math.max(...data.distribution.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      {/* Distribution bars */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Distribution des etiquettes DPE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {DPE_LABELS.map((label) => {
            const item = data.distribution.find((d) => d.label === label);
            const count = item?.count ?? 0;
            const pct = (count / maxCount) * 100;
            return (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-sm font-bold text-white ${DPE_COLORS[label]}`}
                >
                  {label}
                </span>
                <div className="bg-muted h-6 flex-1 overflow-hidden rounded">
                  <div
                    className={`h-full rounded ${DPE_COLORS[label]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-12 text-right text-xs">
                  {count}
                </span>
              </div>
            );
          })}
          <p className="text-muted-foreground pt-1 text-xs">
            Base : {data.totalDPE.toLocaleString("fr-FR")} DPE
          </p>
        </CardContent>
      </Card>

      {/* Averages */}
      <div className="grid gap-4 sm:grid-cols-2">
        {data.avgConso != null && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Consommation moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">
                  {Math.round(data.avgConso)}
                </span>
                <span className="text-muted-foreground text-sm">
                  kWh/m&sup2;/an
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        {data.avgGES != null && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Emission GES moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">
                  {Math.round(data.avgGES)}
                </span>
                <span className="text-muted-foreground text-sm">
                  kgCO&sub2;/m&sup2;/an
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
