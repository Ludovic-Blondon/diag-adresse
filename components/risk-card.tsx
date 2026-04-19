"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RISK_LEVEL_BADGE,
  RISK_LEVEL_LABELS,
  type RiskLevel,
} from "@/lib/constants";

interface RiskCardProps {
  title: string;
  level: RiskLevel;
  description: string;
  details?: string;
  communeOnly?: boolean;
}

export function RiskCard({
  title,
  level,
  description,
  details,
  communeOnly,
}: RiskCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge
          variant="outline"
          className={`${RISK_LEVEL_BADGE[level]} text-xs font-semibold`}
        >
          {RISK_LEVEL_LABELS[level]}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1.5">
          <p className="text-muted-foreground text-sm">{description}</p>
          {communeOnly && (
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground/60 shrink-0 cursor-help text-xs">
                &#9432;
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Risque identifie au niveau communal, non confirme a cette
                  adresse
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {details && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary mt-2 text-xs underline-offset-4 hover:underline"
            >
              {expanded ? "Masquer les details" : "Voir les details"}
            </button>
            {expanded && (
              <p className="text-muted-foreground mt-2 text-xs">{details}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
