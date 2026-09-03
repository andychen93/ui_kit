import { describe, expect, it } from "vitest";
import { Chart } from "chart.js";
import {
  applyChartDefaults,
  barOptions,
  chartColors,
  lineBarOptions,
  palette,
  pieOptions,
  withPalette,
} from "./chartTheme";

describe("chartTheme", () => {
  it("exposes the Argon palette", () => {
    expect(chartColors.theme.primary).toBe("#5e72e4");
    expect(chartColors.theme.info).toBe("#11cdef");
    expect(palette[0]).toBe("#5e72e4");
  });

  it("lineBarOptions matches Argon visual rules", () => {
    const o = lineBarOptions();
    expect(o.elements?.line?.borderCapStyle).toBe("round");
    expect(o.scales?.y?.border?.dash).toEqual([2]);
    expect(o.plugins?.legend?.display).toBe(false);
  });

  it("barOptions adds the Argon rounded bars", () => {
    const bar = barOptions() as { elements?: { rectangle?: { borderRadius?: number } } };
    expect(bar.elements?.rectangle?.borderRadius).toBe(6);
  });

  it("pieOptions uses the signature 83% doughnut cutout", () => {
    expect((pieOptions(true) as { cutout?: string }).cutout).toBe("83%");
    expect((pieOptions(false) as { cutout?: string }).cutout).toBeUndefined();
  });

  it("applyChartDefaults is idempotent on the Chart class", () => {
    const snapshot = (Chart.defaults as unknown as { color?: string }).color;
    applyChartDefaults(Chart);
    const applied = (Chart.defaults as unknown as { color?: string }).color;
    expect(applied).toBe("#8898aa");
    (Chart.defaults as unknown as { color?: string }).color = "#changed";
    applyChartDefaults(Chart);
    expect((Chart.defaults as unknown as { color?: string }).color).toBe("#changed");
    (Chart.defaults as unknown as { color?: string }).color = snapshot;
  });

  it("withPalette fills missing dataset colors in order", () => {
    const out = withPalette([{ label: "a" }, { label: "b", backgroundColor: "#000" }, { label: "c" }]);
    expect(out[0].backgroundColor).toBe("#5e72e4");
    expect(out[1].backgroundColor).toBe("#000");
    expect(out[2].backgroundColor).toBe("#11cdef");
  });
});
