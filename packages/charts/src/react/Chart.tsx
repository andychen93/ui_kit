import { useEffect, useRef } from "react";
import {
  Chart,
  registerables,
  type ChartConfiguration,
  type ChartType,
} from "chart.js";
import {
  applyChartDefaults,
  baseOptionsFor,
  withPalette,
  type ChartKind,
} from "../core/chartTheme";

Chart.register(...registerables);
applyChartDefaults(Chart);

export type { ChartKind };

export interface ArgonChartProps {
  kind?: ChartKind;
  labels: string[];
  datasets: Array<Record<string, unknown>>;
  options?: Record<string, unknown>;
  height?: number;
}

export function ArgonChart({
  kind = "line",
  labels,
  datasets,
  options,
  height = 300,
}: ArgonChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  // kind 变化 → 重建
  useEffect(() => {
    if (!canvasRef.current) return;
    const config: ChartConfiguration = {
      type: kind as ChartType,
      data: {
        labels,
        datasets: withPalette(datasets as Array<{ backgroundColor?: unknown }>) as never,
      },
      options: { ...baseOptionsFor(kind), ...options },
    };
    chartRef.current = new Chart(canvasRef.current, config);
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  // 数据/options 变化 → 原地更新
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.data.labels = labels;
    chart.data.datasets = withPalette(
      datasets as Array<{ backgroundColor?: unknown }>,
    ) as never;
    chart.options = { ...baseOptionsFor(kind), ...options };
    chart.update();
  }, [kind, labels, datasets, options]);

  return (
    <div className="ag-chart" style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export const LineChart = (p: Omit<ArgonChartProps, "kind">) => <ArgonChart {...p} kind="line" />;
export const BarChart = (p: Omit<ArgonChartProps, "kind">) => <ArgonChart {...p} kind="bar" />;
export const PieChart = (p: Omit<ArgonChartProps, "kind">) => <ArgonChart {...p} kind="pie" />;
export const DoughnutChart = (p: Omit<ArgonChartProps, "kind">) => <ArgonChart {...p} kind="doughnut" />;
