import { useState } from "react";
import {
  regionColor,
  regionStats,
  worldRegions,
  type VectorMapProps,
} from "../../core/worldMap";

export function VectorMap({
  data = {},
  height = 320,
  onRegionClick,
}: VectorMapProps) {
  const [hover, setHover] = useState<{
    name: string;
    value?: number;
    x: number;
    y: number;
  } | null>(null);

  const stats = regionStats(data);

  return (
    <div className="ag-vec" style={{ height }}>
      <svg viewBox="0 0 1000 500" style={{ width: "100%", height: "100%", display: "block" }}>
        {worldRegions.map((region) => (
          <path
            key={region.code}
            d={region.d}
            fill={regionColor(data[region.code], stats.max)}
            stroke="#fff"
            strokeWidth={1.5}
            style={{ cursor: "pointer" }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.closest("svg")?.getBoundingClientRect();
              if (!rect) return;
              setHover({
                name: region.name,
                value: data[region.code],
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            }}
            onMouseLeave={() => setHover(null)}
            onClick={() => onRegionClick?.(region.code, region.name)}
          />
        ))}
      </svg>
      {hover ? (
        <div
          className="ag-vec__tip"
          style={{ left: hover.x + 12, top: hover.y - 8 }}
        >
          {hover.name}
          {hover.value !== undefined ? `：${hover.value}` : ""}
        </div>
      ) : null}
      <div className="ag-vec__legend">
        低 <span className="ag-vec__ramp" /> 高 ｜ 合计 {stats.total}
      </div>
    </div>
  );
}
