import type { ReactNode } from "react";

export interface CardProps {
  title?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  noBody?: boolean;
  children?: ReactNode;
}

export function Card({ title, extra, footer, noBody = false, children }: CardProps) {
  return (
    <div className="ag-card">
      {title || extra ? (
        <div className="ag-card__header">
          <h3 className="ag-card__title">{title}</h3>
          {extra ? <div className="ag-card__extra">{extra}</div> : null}
        </div>
      ) : null}
      {noBody ? children : <div className="ag-card__body">{children}</div>}
      {footer ? <div className="ag-card__footer">{footer}</div> : null}
    </div>
  );
}
