import { Badge } from "@/components/ui/badge";
import { RISK_LEVEL_BADGE } from "@/lib/constants";
import type { ScoredRisk } from "@/lib/scoring";

interface RiskSummaryProps {
  risks: ScoredRisk[];
}

export function RiskSummary({ risks }: RiskSummaryProps) {
  // Une source muette ne compte ni comme risque identifié ni comme risque
  // écarté : elle est signalée à part pour que le décompte reste vrai.
  const unavailable = risks.filter((r) => r.level === "indisponible").length;
  const identified = risks.filter(
    (r) => r.level !== "negligeable" && r.level !== "indisponible",
  );
  const fort = identified.filter((r) => r.level === "fort").length;

  let summary: string;
  if (risks.length > 0 && unavailable === risks.length) {
    summary = "Aucune donnée de risque disponible pour ce point";
  } else if (identified.length === 0) {
    summary = "Aucun risque significatif identifié";
  } else {
    summary = `${identified.length} risque${identified.length > 1 ? "s" : ""} identifié${identified.length > 1 ? "s" : ""}`;
    if (fort > 0) {
      summary += ` dont ${fort} important${fort > 1 ? "s" : ""}`;
    }
  }
  if (unavailable > 0 && unavailable < risks.length) {
    summary += ` · ${unavailable} donnée${unavailable > 1 ? "s" : ""} indisponible${unavailable > 1 ? "s" : ""}`;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{summary}</p>
      <div className="flex flex-wrap gap-2">
        {risks.map((risk) => (
          <Badge
            key={risk.id}
            variant="outline"
            className={`${RISK_LEVEL_BADGE[risk.level]} text-xs font-semibold`}
          >
            {risk.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
