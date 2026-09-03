import type { ReactNode } from "react";
import { Spin } from "../spin/Spin";

export interface ListItemType {
  key?: string;
  title?: ReactNode;
  description?: ReactNode;
}

export interface ListProps {
  items?: ListItemType[];
  loading?: boolean;
  bordered?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  renderItem?: (item: ListItemType, index: number) => ReactNode;
}

export function List({
  items = [],
  loading = false,
  bordered = false,
  header,
  footer,
  renderItem,
}: ListProps) {
  return (
    <div
      className={`ag-list${bordered ? " ag-list--bordered" : ""}${loading ? " ag-list--loading" : ""}`}
    >
      {header ? <div className="ag-list__header">{header}</div> : null}
      {loading ? (
        <div className="ag-list__spin">
          <Spin />
        </div>
      ) : (
        <ul className="ag-list__items">
          {items.map((item, i) => (
            <li key={item.key ?? i} className="ag-list__item">
              {renderItem ? (
                renderItem(item, i)
              ) : (
                <>
                  <span>{item.title}</span>
                  {item.description ? (
                    <span style={{ marginLeft: "auto", color: "var(--ag-gray-500)", fontSize: 13 }}>
                      {item.description}
                    </span>
                  ) : null}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {footer ? <div className="ag-list__footer">{footer}</div> : null}
    </div>
  );
}

export interface EmptyProps {
  description?: string;
  image?: ReactNode;
  extra?: ReactNode;
}

export function Empty({
  description = "暂无数据",
  image,
  extra,
}: EmptyProps) {
  return (
    <div className="ag-empty">
      <div className="ag-empty__image">
        {image ?? (
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 13V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6" />
            <path d="M2 13h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
            <path d="M6 20v.01M10 20v.01M14 20v.01M18 20v.01" />
          </svg>
        )}
      </div>
      <p className="ag-empty__desc">{description}</p>
      {extra ? <div className="ag-empty__extra">{extra}</div> : null}
    </div>
  );
}
