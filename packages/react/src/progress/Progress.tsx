export type ProgressVariant =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "gradient-primary"
  | "gradient-info"
  | "gradient-success"
  | "gradient-warning"
  | "gradient-danger";

export interface ProgressProps {
  percent?: number;
  variant?: ProgressVariant;
  thin?: boolean;
  striped?: boolean;
  showLabel?: boolean;
}

export function Progress({
  percent = 0,
  variant = "primary",
  thin = false,
  striped = false,
  showLabel = false,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const className = [
    "ag-progress",
    `ag-progress--${variant}`,
    thin ? "ag-progress--thin" : "",
    striped ? "ag-progress--striped" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="ag-progress__track">
        <div className="ag-progress__bar" style={{ width: `${clamped}%` }} />
      </div>
      {showLabel ? <span className="ag-progress__label">{clamped}%</span> : null}
    </div>
  );
}
