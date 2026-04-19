import { Badge } from "@/components/ui/badge";
import { RISK_LEVEL_BADGE, type RiskLevel } from "@/lib/constants";
import type { ScoredRisk } from "@/lib/scoring";

interface RiskSummaryProps {
  risks: ScoredRisk[];
}

export function RiskSummary({ risks }: RiskSummaryProps) {
  const identified = risks.filter((r) => r.level !== "negligeable");
  const fort = identified.filter((r) => r.level === "fort").length;

  let summary: string;
  if (identified.length === 0) {
    summary = "Aucun risque significatif identifie";
  } else {
    summary = `${identified.length} risque${identified.length > 1 ? "s" : ""} identifie${identified.length > 1 ? "s" : ""}`;
    if (fort > 0) {
      summary += ` dont ${fort} important${fort > 1 ? "s" : ""}`;
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{summary}</p>
      <div className="flex flex-wrap gap-2">
        {risks.map((risk) => (
          <Badge
            key={risk.id}
            variant="outline"
            className={`${RISK_LEVEL_BADGE[risk.level as RiskLevel]} text-xs font-semibold`}
          >
            {risk.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
