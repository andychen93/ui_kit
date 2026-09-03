import { useEffect, useRef, useState } from "react";
import type { TreeNode } from "@argon-kit/core";
import { Glyph } from "../glyph/Glyph";

export type { TreeNode };

function findLabel(nodes: TreeNode[], id: string | number | null | undefined): string {
  if (id == null) return "";
  for (const n of nodes) {
    if (n.id === id) return n.label;
    if (n.children) {
      const hit = findLabel(n.children, id);
      if (hit) return hit;
    }
  }
  return "";
}

function TreeList({
  nodes,
  expanded,
  selected,
  onToggle,
  onSelect,
}: {
  nodes: TreeNode[];
  expanded: Set<string>;
  selected: string | number | null;
  onToggle: (id: string | number) => void;
  onSelect: (node: TreeNode) => void;
}) {
  return (
    <ul className="ag-tree">
      {nodes.map((n) => {
        const key = String(n.id);
        const hasKids = Boolean(n.children?.length);
        return (
          <li key={key}>
            <div
              className={[
                "ag-tree__node",
                n.id === selected ? "is-active" : "",
                n.disabled ? "is-disabled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => !n.disabled && onSelect(n)}
            >
              {hasKids ? (
                <button
                  type="button"
                  className={["ag-tree__twist", expanded.has(key) ? "is-open" : ""].filter(Boolean).join(" ")}
                  aria-label={expanded.has(key) ? "收起" : "展开"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(n.id);
                  }}
                >
                  <Glyph name="chevronRight" />
                </button>
              ) : (
                <span className="ag-tree__leaf" />
              )}
              {n.label}
            </div>
            {hasKids && expanded.has(key) ? (
              <TreeList
                nodes={n.children!}
                expanded={expanded}
                selected={selected}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export interface TreeSelectProps {
  data: TreeNode[];
  value?: string | number | null;
  onChange?: (id: string | number | null, node?: TreeNode | null) => void;
  placeholder?: string;
  allowClear?: boolean;
  status?: "error" | "success";
}

export function TreeSelect({
  data,
  value = null,
  onChange,
  placeholder = "请选择",
  allowClear,
  status,
}: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const rootRef = useRef<HTMLDivElement>(null);
  const label = findLabel(data, value);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="ag-field" ref={rootRef}>
      <div className="ag-select">
        <div
          role="combobox"
          aria-expanded={open}
          className={["ag-input-wrap", "ag-select__trigger", status ? `is-${status}` : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={["ag-select__value", label ? "" : "is-placeholder"].filter(Boolean).join(" ")}>
            {label || placeholder}
          </span>
          {allowClear && value != null ? (
            <button
              type="button"
              className="ag-input__addon-btn"
              aria-label="清除"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(null, null);
              }}
            >
              <Glyph name="x" />
            </button>
          ) : (
            <Glyph name="chevronDown" />
          )}
        </div>
        {open ? (
          <div className="ag-select__dropdown" style={{ padding: 8, maxHeight: 280, overflow: "auto" }}>
            <TreeList
              nodes={data}
              expanded={expanded}
              selected={value}
              onToggle={(id) => {
                const key = String(id);
                setExpanded((prev) => {
                  const next = new Set(prev);
                  if (next.has(key)) next.delete(key);
                  else next.add(key);
                  return next;
                });
              }}
              onSelect={(node) => {
                onChange?.(node.id, node);
                setOpen(false);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
