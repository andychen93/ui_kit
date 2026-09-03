import { useEffect, useRef, useState } from "react";
import type { ColumnDef, PageQuery, PageResult } from "@argon-kit/core";
import { Glyph } from "../glyph/Glyph";
import { Input } from "../input/Input";
import { Table, type TableColumn } from "../table/Table";
import { Pagination } from "../table/Pagination";

const SEARCH_DEBOUNCE_MS = 300;

export interface PageSelectProps<T extends object> {
  service: (params: PageQuery) => Promise<PageResult<T>>;
  columns: TableColumn<T>[] | ColumnDef[];
  rowKey: keyof T | string;
  labelField: keyof T;
  value?: T | null;
  onChange?: (record: T | null) => void;
  placeholder?: string;
  searchField?: keyof T | string;
  pageSize?: number;
  popoverWidth?: number;
  allowClear?: boolean;
  /** 同页多个实例时建议传入，API 与 rbac 对齐（本实现不做 react-query 缓存） */
  cacheKey?: string;
}

export function PageSelect<T extends object>({
  service,
  columns,
  rowKey,
  labelField,
  value = null,
  onChange,
  placeholder = "请选择",
  searchField,
  pageSize = 5,
  popoverWidth = 480,
  allowClear = false,
}: PageSelectProps<T>) {
  const selectedLabel = value ? String(value[labelField] ?? "") : "";
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(selectedLabel);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const [list, setList] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSearch = (kw: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setKeyword(kw), SEARCH_DEBOUNCE_MS);
  };
  const cancelSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  useEffect(() => () => cancelSearch(), []);

  useEffect(() => {
    setText(selectedLabel);
  }, [selectedLabel]);

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const params: PageQuery = {
      pageNum: page,
      pageSize: size,
      ...(searchField ? { [String(searchField)]: keyword } : {}),
    };
    service(params)
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
  }, [open, page, size, keyword, searchField, service]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      cancelSearch();
      setOpen(false);
      setKeyword("");
      setText(selectedLabel);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [selectedLabel]);

  function handleSelect(record: T) {
    cancelSearch();
    onChange?.(record);
    setText(String(record[labelField] ?? ""));
    setOpen(false);
    setKeyword("");
  }

  function handleOpen() {
    setOpen(true);
    setKeyword("");
    setPage(1);
  }

  const activeKey = value
    ? String((value as Record<string, unknown>)[String(rowKey)])
    : undefined;

  return (
    <div className="ag-page-select" ref={rootRef}>
      <Input
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          scheduleSearch(next);
          if (!open) setOpen(true);
        }}
        onFocus={handleOpen}
        suffix={
          allowClear && text ? (
            <button
              type="button"
              className="ag-input__addon-btn"
              aria-label="清除"
              onClick={(e) => {
                e.stopPropagation();
                cancelSearch();
                onChange?.(null);
                setText("");
                setKeyword("");
                setOpen(false);
              }}
            >
              <Glyph name="x" />
            </button>
          ) : (
            <Glyph name="search" />
          )
        }
      />
      {open ? (
        <div className="ag-page-select__panel" style={{ width: popoverWidth }}>
          <Table
            columns={columns as TableColumn<T>[]}
            data={list}
            rowKey={rowKey}
            loading={loading}
            onRowClick={handleSelect}
            activeKey={activeKey}
          />
          <Pagination
            current={page}
            pageSize={size}
            total={total}
            onChange={(p, ps) => {
              setPage(p);
              setSize(ps);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
