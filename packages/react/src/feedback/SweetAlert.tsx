import { createPortal } from "react-dom";
import type { ReactNode } from "react";

export type SweetAlertType = "success" | "error" | "warning" | "info" | "primary";

const ICONS: Record<SweetAlertType, ReactNode> = {
  success: <path d="m8 12.5 2.7 2.7L16.5 9.5" />,
  error: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3.5 21 19.5H3z" />
      <path d="M12 9.5v4M12 16.5v.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 11v5M12 8v.5" />
    </>
  ),
  primary: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 8v5M12 16.5v.5" />
    </>
  ),
};

export interface SweetAlertProps {
  open?: boolean;
  type?: SweetAlertType;
  title?: ReactNode;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function SweetAlert({
  open = false,
  type = "success",
  title,
  content,
  confirmText = "确定",
  cancelText = "取消",
  showCancel = false,
  onConfirm,
  onCancel,
}: SweetAlertProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="ag-swal-mask">
      <div className={`ag-swal ag-swal--${type}`} role="alertdialog" aria-modal="true">
        <div className="ag-swal__icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {ICONS[type]}
          </svg>
        </div>
        <h3 className="ag-swal__title">{title}</h3>
        {content ? <p className="ag-swal__content">{content}</p> : null}
        <div className="ag-swal__actions">
          {showCancel ? (
            <button type="button" className="ag-btn ag-btn--neutral" onClick={onCancel}>
              {cancelText}
            </button>
          ) : null}
          <button
            type="button"
            className={`ag-btn ${type === "error" ? "ag-btn--danger" : "ag-btn--primary"}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
