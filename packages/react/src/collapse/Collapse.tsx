import { createContext, useContext, useState, type ReactNode } from "react";

interface CollapseCtx {
  isActive: (key: string) => boolean;
  toggle: (key: string) => void;
}

const Ctx = createContext<CollapseCtx | null>(null);

export interface CollapseProps {
  activeKeys?: string[];
  defaultActiveKeys?: string[];
  accordion?: boolean;
  onChange?: (keys: string[]) => void;
  children?: ReactNode;
}

export function Collapse({
  activeKeys,
  defaultActiveKeys = [],
  accordion = false,
  onChange,
  children,
}: CollapseProps) {
  const [internal, setInternal] = useState<string[]>(defaultActiveKeys);
  const active = activeKeys ?? internal;

  const toggle = (key: string) => {
    let next: string[];
    if (accordion) {
      next = active.includes(key) ? [] : [key];
    } else {
      next = active.includes(key)
        ? active.filter((k) => k !== key)
        : [...active, key];
    }
    if (activeKeys === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <Ctx.Provider value={{ isActive: (k) => active.includes(k), toggle }}>
      <div className="ag-collapse">{children}</div>
    </Ctx.Provider>
  );
}

export interface CollapsePanelProps {
  panelKey: string;
  title?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
}

export function CollapsePanel({ panelKey, title, disabled = false, children }: CollapsePanelProps) {
  const ctx = useContext(Ctx);
  const open = ctx?.isActive(panelKey) ?? false;
  return (
    <div className="ag-collapse__panel">
      <button
        type="button"
        className="ag-collapse__header"
        disabled={disabled}
        onClick={() => ctx?.toggle(panelKey)}
      >
        {title}
        <span className={`ag-collapse__arrow${open ? " is-open" : ""}`}>›</span>
      </button>
      {open ? <div className="ag-collapse__body">{children}</div> : null}
    </div>
  );
}
