export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showTotal?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
}

export function Pagination({
  current,
  pageSize,
  total,
  showTotal = true,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50],
  onChange,
}: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / Math.max(pageSize, 1)));

  const items: number[] = [];
  if (pages <= 7) {
    for (let i = 1; i <= pages; i++) items.push(i);
  } else {
    const start = Math.max(1, Math.min(current - 2, pages - 4));
    const end = Math.min(pages, start + 4);
    for (let i = start; i <= end; i++) items.push(i);
  }

  return (
    <div className="ag-pagination">
      {showTotal ? <span>共 {total} 条</span> : null}
      {showSizeChanger ? (
        <select
          className="ag-pagination__size"
          value={pageSize}
          aria-label="每页条数"
          onChange={(e) => onChange?.(1, Number(e.target.value))}
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n} 条/页
            </option>
          ))}
        </select>
      ) : null}
      <button
        type="button"
        className="ag-pagination__btn"
        disabled={current <= 1}
        onClick={() => onChange?.(current - 1, pageSize)}
      >
        ‹
      </button>
      {items.map((p) => (
        <button
          key={p}
          type="button"
          className={["ag-pagination__btn", p === current ? "is-active" : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onChange?.(p, pageSize)}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        className="ag-pagination__btn"
        disabled={current >= pages}
        onClick={() => onChange?.(current + 1, pageSize)}
      >
        ›
      </button>
    </div>
  );
}
