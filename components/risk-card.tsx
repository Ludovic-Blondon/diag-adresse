"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
}

export function RiskCard({ title, level, description, details }: RiskCardProps) {
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
        <p className="text-sm text-muted-foreground">{description}</p>
        {details && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs text-primary underline-offset-4 hover:underline"
            >
              {expanded ? "Masquer les details" : "Voir les details"}
            </button>
            {expanded && (
              <p className="mt-2 text-xs text-muted-foreground">{details}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
