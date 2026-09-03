import type { TimelineItem } from "@argon-kit/core";

export interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <ul className="ag-timeline">
      {items.map((item, i) => (
        <li key={i} className="ag-timeline__item">
          <span
            className={
              item.color ? `ag-timeline__dot ag-timeline__dot--${item.color}` : "ag-timeline__dot"
            }
          />
          <div className="ag-timeline__content">{item.content}</div>
          {item.time ? <div className="ag-timeline__time">{item.time}</div> : null}
        </li>
      ))}
    </ul>
  );
}
