import type { Component } from "svelte";
import type { ChartKind } from "../core/chartTheme";

export interface SvelteChartProps {
  kind?: ChartKind;
  labels: string[];
  datasets: Array<Record<string, unknown>>;
  options?: Record<string, unknown>;
  height?: number;
}

export declare const ArgonChart: Component<SvelteChartProps>;
export declare const LineChart: Component<SvelteChartProps>;
export declare const BarChart: Component<SvelteChartProps>;
export declare const PieChart: Component<SvelteChartProps>;
export declare const DoughnutChart: Component<SvelteChartProps>;
