import type { StepItem } from "@argon-kit/core";

export interface StepsProps {
  items: StepItem[];
  current?: number;
  direction?: "horizontal" | "vertical";
}

export function Steps({ items, current = 0, direction = "horizontal" }: StepsProps) {
  return (
    <div className={direction === "vertical" ? "ag-steps ag-steps--vertical" : "ag-steps"}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`ag-steps__item${i < current ? " is-finish" : ""}${i === current ? " is-active" : ""}`}
        >
          <span className="ag-steps__marker">{i < current ? "✓" : i + 1}</span>
          <div className="ag-steps__meta">
            <div className="ag-steps__title">{item.title}</div>
            {item.description ? <div className="ag-steps__desc">{item.description}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
