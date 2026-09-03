import type { ReactNode } from "react";

export type SpinSize = "sm" | "md" | "lg";

export interface SpinProps {
  spinning?: boolean;
  size?: SpinSize;
  text?: string;
  children?: ReactNode;
}

export function Spin({ spinning = true, size = "md", text, children }: SpinProps) {
  const sizeClass = size !== "md" ? ` ag-spin--${size}` : "";

  if (children) {
    return (
      <div className={`ag-spin ag-spin--wrap${sizeClass}`}>
        {children}
        {spinning ? (
          <div className="ag-spin__mask">
            <span className="ag-spin__spinner" />
            {text ? <span className="ag-spin__text">{text}</span> : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`ag-spin${sizeClass}`}>
      <span className="ag-spin__spinner" />
      {text ? <span className="ag-spin__text">{text}</span> : null}
    </div>
  );
}
