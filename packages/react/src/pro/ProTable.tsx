import { type ReactNode, useEffect, useState } from "react";
import type { PageQuery, PageResult, QueryField } from "@argon-kit/core";
import { Table, type TableColumn } from "../table/Table";
import { Pagination } from "../table/Pagination";
import { QueryForm } from "./QueryForm";

export interface ProTableProps<T extends object> {
  service: (params: PageQuery) => Promise<PageResult<T>>;
  columns: TableColumn<T>[];
  rowKey: keyof T | string;
  querySchema?: QueryField[];
  pageSize?: number;
  toolbar?: ReactNode;
  onFiltersChange?: (filters: Record<string, unknown>) => void;
}

export function ProTable<T extends object>({
  service,
  columns,
  rowKey,
  querySchema,
  pageSize = 10,
  toolbar,
  onFiltersChange,
}: ProTableProps<T>) {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const [list, setList] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    service({ pageNum: page, pageSize: size, ...filters })
      .then((res) => {
        if (cancelled) return;
        setList(res.list);
        setTotal(res.total);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [service, page, size, filters]);

  function applyFilters(next: Record<string, unknown>) {
    setFilters(next);
    setPage(1);
    onFiltersChange?.(next);
  }

  return (
    <>
      {querySchema && querySchema.length > 0 ? (
        <QueryForm fields={querySchema} onSearch={applyFilters} />
      ) : null}
      <div className="ag-card">
        {toolbar ? <div className="ag-toolbar">{toolbar}</div> : null}
        <Table columns={columns} data={list} rowKey={rowKey} loading={loading} />
        <Pagination
          current={page}
          pageSize={size}
          total={total}
          showSizeChanger
          onChange={(p, ps) => {
            setPage(p);
            setSize(ps);
          }}
        />
      </div>
    </>
  );
}
