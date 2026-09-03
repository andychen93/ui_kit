import { useState, type ReactNode } from "react";

export type AlertVariant =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface AlertProps {
  variant?: AlertVariant;
  dismissible?: boolean;
  icon?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}

export function Alert({
  variant = "default",
  dismissible = false,
  icon,
  onClose,
  children,
}: AlertProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      className={variant === "default" ? "ag-alert" : `ag-alert ag-alert--${variant}`}
      role="alert"
    >
      {icon ? <span className="ag-alert__icon">{icon}</span> : null}
      <div className="ag-alert__content">{children}</div>
      {dismissible ? (
        <button
          type="button"
          className="ag-alert__close"
          aria-label="close"
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
