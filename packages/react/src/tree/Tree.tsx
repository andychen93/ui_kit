import { useState } from "react";
import type { TreeNode } from "@argon-kit/core";
import { Glyph } from "../glyph/Glyph";

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
              className={["ag-tree__node", n.id === selected ? "is-active" : ""].filter(Boolean).join(" ")}
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

export function Tree({
  data,
  value = null,
  onChange,
}: {
  data: TreeNode[];
  value?: string | number | null;
  onChange?: (id: string | number, node: TreeNode) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  return (
    <div className="ag-tree-panel">
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
        onSelect={(node) => onChange?.(node.id, node)}
      />
    </div>
  );
}
