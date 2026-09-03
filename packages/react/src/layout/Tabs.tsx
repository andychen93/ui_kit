import type { ReactNode } from "react";
import type { TabItem } from "@argon-kit/core";

export function Tabs({
  items,
  active,
  onChange,
  center,
  children,
}: {
  items: TabItem[];
  active: string;
  onChange?: (key: string) => void;
  center?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="ag-tabs">
      <div className={["ag-tabs__nav", center ? "is-center" : ""].filter(Boolean).join(" ")} role="tablist">
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={it.key === active}
            disabled={it.disabled}
            className={["ag-tabs__tab", it.key === active ? "is-active" : ""].filter(Boolean).join(" ")}
            onClick={() => onChange?.(it.key)}
          >
            {it.label}
          </button>
        ))}
      </div>
      {children ? <div className="ag-tabs__panel">{children}</div> : null}
    </div>
  );
}
