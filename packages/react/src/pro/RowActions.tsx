import { Popconfirm } from "../overlay/Modal";

export interface RowActionItem {
  key: string;
  label: string;
  danger?: boolean;
  confirmTitle?: string;
  onClick: () => void;
}

export function RowActions({ items }: { items: RowActionItem[] }) {
  return (
    <div className="ag-row-actions">
      {items.map((item) => {
        const btn = (
          <button
            type="button"
            className={item.danger ? "is-danger" : undefined}
            onClick={item.confirmTitle ? undefined : item.onClick}
          >
            {item.label}
          </button>
        );
        return item.confirmTitle ? (
          <Popconfirm key={item.key} title={item.confirmTitle} onConfirm={item.onClick}>
            {btn}
          </Popconfirm>
        ) : (
          <span key={item.key}>{btn}</span>
        );
      })}
    </div>
  );
}
