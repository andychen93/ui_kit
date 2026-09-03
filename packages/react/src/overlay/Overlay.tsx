import { type ReactNode, useEffect, useRef, useState } from "react";

export function Tooltip({ title, children }: { title: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="ag-overlay-root"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show ? (
        <span className="ag-tooltip" role="tooltip">
          {title}
        </span>
      ) : null}
    </span>
  );
}

export function Popover({
  content,
  children,
}: {
  content: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div className="ag-overlay-root" ref={ref}>
      <span onClick={() => setOpen((v) => !v)}>{children}</span>
      {open ? <div className="ag-popover">{content}</div> : null}
    </div>
  );
}

export interface DropdownItem {
  key: string;
  label: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function Dropdown({
  items,
  children,
}: {
  items: DropdownItem[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div className="ag-overlay-root" ref={ref}>
      <span onClick={() => setOpen((v) => !v)}>{children}</span>
      {open ? (
        <div className="ag-dropdown" role="menu">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              role="menuitem"
              disabled={it.disabled}
              className={["ag-dropdown__item", it.danger ? "is-danger" : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (it.disabled) return;
                it.onClick?.();
                setOpen(false);
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
