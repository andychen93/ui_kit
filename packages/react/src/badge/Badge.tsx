import type { ReactNode } from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  pill?: boolean;
  size?: BadgeSize;
  circle?: boolean;
  children?: ReactNode;
}

export function Badge({
  variant = "default",
  pill = false,
  size = "sm",
  circle = false,
  children,
}: BadgeProps) {
  const className = [
    "ag-badge",
    variant !== "default" ? `ag-badge--${variant}` : "",
    circle ? "ag-badge--circle" : "",
    size !== "sm" ? `ag-badge--${size}` : "",
    pill ? "ag-badge--pill" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={className}>{children}</span>;
}

export type TagVariant =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface TagProps {
  variant?: TagVariant;
  dot?: boolean;
  closable?: boolean;
  onClose?: (e: MouseEvent) => void;
  children?: ReactNode;
}

export function Tag({
  variant = "default",
  dot = true,
  closable = false,
  onClose,
  children,
}: TagProps) {
  return (
    <span className={variant === "default" ? "ag-tag" : `ag-tag ag-tag--${variant}`}>
      {dot ? <span className="ag-tag__dot" /> : null}
      {children}
      {closable ? (
        <button
          type="button"
          className="ag-tag__close"
          aria-label="close"
          onClick={(e) => onClose?.(e.nativeEvent)}
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
