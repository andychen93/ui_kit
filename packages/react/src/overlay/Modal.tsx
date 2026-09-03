import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../button/Button";
import { Glyph } from "../glyph/Glyph";

export interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm?: () => void;
  /** 弹窗宽度 px */
  width?: number;
  /** 确认按钮 loading（防重复提交） */
  confirmLoading?: boolean;
  /** 隐藏底部（纯展示弹窗） */
  hideFooter?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  open,
  title,
  onClose,
  onConfirm,
  width = 520,
  confirmLoading = false,
  hideFooter = false,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="ag-mask" onClick={onClose} role="presentation">
      <div
        className="ag-modal"
        style={{ width: `min(${width}px, 100%)` }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ag-modal__header">
          <h3 className="ag-modal__title">{title}</h3>
          <button type="button" className="ag-modal__close" aria-label="关闭" onClick={onClose}>
            <Glyph name="x" />
          </button>
        </div>
        <div className="ag-modal__body">{children}</div>
        {hideFooter ? null : footer !== undefined ? (
          <div className="ag-modal__footer">{footer}</div>
        ) : (
          <div className="ag-modal__footer">
            <Button variant="neutral" onClick={onClose}>
              取消
            </Button>
            <Button loading={confirmLoading} onClick={() => onConfirm?.()}>
              确定
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export interface DrawerProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children?: ReactNode;
}

export function Drawer({ open, title, onClose, children }: DrawerProps) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <>
      <div className="ag-drawer-mask" onClick={onClose} />
      <aside className="ag-drawer" role="dialog" aria-modal="true">
        <div className="ag-drawer__header">
          <h3 className="ag-drawer__title">{title}</h3>
          <button type="button" className="ag-drawer__close" aria-label="关闭" onClick={onClose}>
            <Glyph name="x" />
          </button>
        </div>
        <div className="ag-drawer__body">{children}</div>
      </aside>
    </>,
    document.body,
  );
}

export function Popconfirm({
  title = "确认操作？",
  onConfirm,
  children,
}: {
  title?: string;
  onConfirm?: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ag-overlay-root">
      <span onClick={() => setOpen((v) => !v)}>{children}</span>
      {open ? (
        <div className="ag-popconfirm">
          <p className="ag-popconfirm__title">{title}</p>
          <div className="ag-popconfirm__actions">
            <Button size="sm" variant="neutral" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                onConfirm?.();
                setOpen(false);
              }}
            >
              确定
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
