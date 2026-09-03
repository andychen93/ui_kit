import type { BreadcrumbItem } from "@argon-kit/core";

export function Breadcrumb({
  items,
  onNavigate,
}: {
  items: BreadcrumbItem[];
  onNavigate?: (item: BreadcrumbItem, index: number) => void;
}) {
  return (
    <nav className="ag-breadcrumb" aria-label="面包屑">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {i > 0 ? <span className="ag-breadcrumb__sep">/</span> : null}
          {i < items.length - 1 ? (
            <button type="button" onClick={() => onNavigate?.(item, i)}>
              {item.label}
            </button>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
