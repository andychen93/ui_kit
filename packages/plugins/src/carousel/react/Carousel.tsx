import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CarouselProps } from "../../core/types";

export function Carousel({
  items,
  interval = 5000,
  indicators = true,
  controls = true,
}: CarouselProps & { items: Array<{ content?: ReactNode } & Record<string, unknown>> }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const go = (i: number) => setActive((i + count) % count);

  useEffect(() => {
    if (interval <= 0 || count <= 1 || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), interval);
    return () => clearInterval(t);
  }, [interval, count, paused]);

  return (
    <div
      className="ag-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="ag-carousel__track"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={(item.key as string) ?? i} className="ag-carousel__item">
            {item.src ? (
              <img src={item.src as string} alt={(item.alt as string) ?? ""} />
            ) : (
              <div
                style={{
                  minHeight: 240,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--ag-gradient-primary)",
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {item.content as ReactNode}
              </div>
            )}
            {item.caption ? (
              <div className="ag-carousel__caption">
                <h5>{item.caption as string}</h5>
                {item.description ? <p>{item.description as string}</p> : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {controls ? (
        <>
          <button
            type="button"
            className="ag-carousel__control ag-carousel__control--prev"
            aria-label="previous"
            onClick={() => go(active - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="ag-carousel__control ag-carousel__control--next"
            aria-label="next"
            onClick={() => go(active + 1)}
          >
            ›
          </button>
        </>
      ) : null}
      {indicators ? (
        <div className="ag-carousel__indicators">
          {items.map((_: unknown, i: number) => (
            <button
              key={i}
              type="button"
              className={`ag-carousel__indicator${i === active ? " is-active" : ""}`}
              aria-label={`slide ${i + 1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
