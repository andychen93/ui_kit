import type { ReactNode } from "react";
import type { StatVariant } from "@argon-kit/core";

export function StatCard({
  variant = "primary",
  label,
  value,
  progress,
  hint,
}: {
  variant?: StatVariant;
  label: string;
  value?: ReactNode;
  progress?: number;
  hint?: ReactNode;
}) {
  const display = typeof value === "number" ? value.toLocaleString("en-US") : value;
  return (
    <div className={`ag-stat-card ag-stat-card--${variant}`}>
      <div className="ag-stat-card__label">{label}</div>
      <div className="ag-stat-card__value">{display ?? "—"}</div>
      {progress != null ? (
        <div className="ag-stat-card__progress">
          <div className="ag-stat-card__bar" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      {hint ? <div className="ag-stat-card__hint">{hint}</div> : null}
    </div>
  );
}
