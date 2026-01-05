import React from "react";
import { KPI } from "../../types";

interface KPICardProps extends KPI {
  variant?: "default" | "glass" | "gradient";
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  variant = "glass",
  icon,
}) => {
  return (
    <div className="premium-kpi-card h-full">
      {/* Header with Icon and Label */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && <div className="kpi-icon-box">{icon}</div>}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 tracking-wide uppercase truncate">
              {label}
            </p>
          </div>
        </div>
      </div>

      {/* Value Display */}
      <div className="flex items-center min-w-0 w-full">
        <h3
          className="font-bold text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </h3>
      </div>
    </div>
  );
};
