import React from "react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { KPI } from "../../types";

export const KPICard: React.FC<KPI> = ({ label, value, change, trend }) => {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  // Badge styling for dark mode: slightly transparent backgrounds
  const badgeVariant =
    trend === "up" ? "success" : trend === "down" ? "destructive" : "secondary";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          {change !== undefined && (
            <Badge
              variant={badgeVariant as any}
              className="flex items-center gap-1 font-medium px-2 py-0.5 h-auto"
            >
              <TrendIcon className="h-3 w-3" />
              {Math.abs(change)}%
            </Badge>
          )}
        </div>
        <div>
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </span>
        </div>
        <div className="mt-3 flex items-center text-xs text-muted-foreground font-medium">
          {trend === "up" ? (
            <span className="flex items-center gap-1">
              Trending up this month <ArrowUpRight className="h-3 w-3" />
            </span>
          ) : trend === "down" ? (
            <span className="flex items-center gap-1">
              Down from last period <ArrowDownRight className="h-3 w-3" />
            </span>
          ) : (
            "No significant change"
          )}
        </div>
      </CardContent>
    </Card>
  );
};
