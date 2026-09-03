import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { ColumnDef as BaseColumn } from "@argon-kit/core";

export interface TableColumn<T> extends BaseColumn {
  render?: (value: unknown, record: T, index: number) => ReactNode;
  /** 本地排序比较器 */
  sorter?: (a: T, b: T) => number;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | string;
  loading?: boolean;
  striped?: boolean;
  onRowClick?: (record: T) => void;
  activeKey?: string | number;
  /** 横向滚动最小宽度（启用固定列时应设置） */
  scrollX?: number;
}

function rowId<T>(row: T, rowKey: keyof T | string) {
  return String((row as Record<string, unknown>)[rowKey as string]);
}

export function Table<T extends object>({
  columns,
  data,
  rowKey,
  loading,
  striped,
  onRowClick,
  activeKey,
  scrollX,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = (col: TableColumn<T>) => {
    if (!col.sorter) return;
    if (sortKey === col.key) {
      if (sortAsc) setSortAsc(false);
      else {
        setSortKey(null); // 第三次点击恢复原始顺序
        setSortAsc(true);
      }
    } else {
      setSortKey(col.key);
      setSortAsc(true);
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sorter) return data;
    const arr = [...data];
    arr.sort(col.sorter);
    return sortAsc ? arr : arr.reverse();
  }, [data, sortKey, sortAsc, columns]);

  /** 固定列 sticky 偏移 */
  const sticky = useMemo(() => {
    const left = new Map<string, number>();
    const right = new Map<string, number>();
    let acc = 0;
    for (const c of columns) {
      if (c.fixed === "left") {
        left.set(c.key, acc);
        acc += Number(c.width ?? 160);
      }
    }
    acc = 0;
    for (let i = columns.length - 1; i >= 0; i--) {
      const c = columns[i];
      if (c.fixed === "right") {
        right.set(c.key, acc);
        acc += Number(c.width ?? 160);
      }
    }
    return { left, right };
  }, [columns]);

  const cellStyle = (c: TableColumn<T>): CSSProperties => {
    const s: CSSProperties = {};
    if (c.width) s.width = c.width;
    if (c.fixed === "left") s.left = sticky.left.get(c.key) ?? 0;
    if (c.fixed === "right") s.right = sticky.right.get(c.key) ?? 0;
    if (c.align) s.textAlign = c.align;
    return s;
  };

  return (
    <div className={["ag-table-wrap", loading ? "is-loading" : ""].filter(Boolean).join(" ")}>
      <div className="ag-table-scroll" style={scrollX ? { minWidth: scrollX } : undefined}>
        <table className={["ag-table", striped ? "ag-table--striped" : ""].filter(Boolean).join(" ")}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={[
                    c.fixed ? `ag-table__cell--fixed ag-table__cell--fixed-${c.fixed}` : "",
                    c.sorter ? "ag-table__th-sorter" : "",
                    sortKey === c.key ? "is-sorted" : "",
                    c.align ? `is-align-${c.align}` : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={cellStyle(c)}
                  aria-sort={
                    sortKey === c.key ? (sortAsc ? "ascending" : "descending") : undefined
                  }
                  onClick={() => toggleSort(c)}
                >
                  <span className={c.ellipsis ? "ag-table__ellipsis" : ""}>{c.title}</span>
                  {c.sorter ? (
                    <span className="ag-table__sorter">
                      {sortKey === c.key ? (sortAsc ? "↑" : "↓") : "⇅"}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td className="ag-table__empty" colSpan={columns.length}>
                  {loading ? "加载中…" : "暂无数据"}
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const id = rowId(record, rowKey);
                return (
                  <tr
                    key={id}
                    className={[
                      onRowClick ? "is-clickable" : "",
                      activeKey != null && String(activeKey) === id ? "is-active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => onRowClick?.(record)}
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={[
                          c.fixed ? `ag-table__cell--fixed ag-table__cell--fixed-${c.fixed}` : "",
                          c.align ? `is-align-${c.align}` : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={cellStyle(c)}
                      >
                        {c.render ? (
                          c.render(
                            (record as Record<string, unknown>)[c.dataIndex ?? c.key],
                            record,
                            index,
                          )
                        ) : (
                          <span className={c.ellipsis ? "ag-table__ellipsis" : ""}>
                            {String(
                              (record as Record<string, unknown>)[c.dataIndex ?? c.key] ?? "",
                            )}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
