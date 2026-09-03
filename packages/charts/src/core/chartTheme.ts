/**
 * Argon 图表主题 —— 照抄 argon-dashboard-pro-react/src/variables/charts.js 的
 * 视觉规则，翻译为 Chart.js 4 原生配置（v4 用 borderRadius 替代 Argon 的
 * Rectangle.prototype.draw 猴子补丁）。
 */
import type { Chart, ChartOptions } from "chart.js";
import { agGray, agPalette } from "@argon-kit/styles/tokens";

/** Argon 色板（单一来源：@argon-kit/styles/tokens） */
export const chartColors = {
  gray: agGray,
  theme: {
    default: agPalette.default,
    primary: agPalette.primary,
    secondary: "#f4f5f7",
    info: agPalette.info,
    success: agPalette.success,
    danger: agPalette.danger,
    warning: agPalette.warning,
  },
} as const;

/** 图表默认调色板（数据集未指定颜色时按序取用） */
export const palette = [
  chartColors.theme.primary,
  chartColors.theme.info,
  chartColors.theme.success,
  chartColors.theme.warning,
  chartColors.theme.danger,
  chartColors.gray[500],
  chartColors.theme.default,
];

const FONT_FAMILY = "'Open Sans', 'PingFang SC', system-ui, sans-serif";

/** 图表类型（与三框架组件 kind prop 对应） */
export type ChartKind = "line" | "bar" | "pie" | "doughnut";

/** 按 kind 取对应基础 options */
export function baseOptionsFor(kind: ChartKind): ChartOptions {
  if (kind === "pie") return pieOptions(false);
  if (kind === "doughnut") return pieOptions(true);
  if (kind === "bar") return barOptions();
  return lineBarOptions();
}

/** 折线 options（Argon 视觉：圆点隐藏、圆头粗线、虚线网格） */
export function lineBarOptions(): ChartOptions<"line" | "bar"> {
  return lineOptions();
}

/** 柱状 options（在折线基础上加 Argon 圆角柱） */
export function barOptions(): ChartOptions<"bar"> {
  return {
    ...lineOptions(),
    elements: {
      ...lineOptions().elements,
      rectangle: { borderRadius: 6, borderSkipped: "bottom" },
    } as ChartOptions<"bar">["elements"],
  };
}

function lineOptions(): ChartOptions<"line" | "bar"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: chartColors.gray[800],
        titleFont: { family: FONT_FAMILY, size: 13 },
        bodyFont: { family: FONT_FAMILY, size: 13 },
        padding: 10,
        cornerRadius: 4,
        boxPadding: 4,
      },
    },
    elements: {
      point: { radius: 0, hoverRadius: 5 },
      line: {
        tension: 0.4,
        borderWidth: 3,
        borderCapStyle: "round",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawTicks: false,
          offset: false,
        },
        ticks: {
          color: chartColors.gray[600],
          font: { family: FONT_FAMILY, size: 13 },
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        border: { display: false, dash: [2], dashOffset: 2 },
        grid: {
          color: chartColors.gray[300],
          drawTicks: false,
          lineWidth: 1,
        },
        ticks: {
          color: chartColors.gray[600],
          font: { family: FONT_FAMILY, size: 13 },
          padding: 10,
          maxTicksLimit: 6,
        },
      },
    },
  };
}

/** 饼/环 options（doughnut cutout 83% 是 Argon 标志性视觉） */
export function pieOptions(doughnut = false): ChartOptions<"pie" | "doughnut"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: { usePointStyle: true, padding: 16 },
      },
      tooltip: {
        backgroundColor: chartColors.gray[800],
        bodyFont: { family: FONT_FAMILY, size: 13 },
        padding: 10,
        cornerRadius: 4,
      },
    },
    ...(doughnut ? { cutout: "83%" } : {}),
  };
}

/** 应用 Argon defaults 到 Chart 全局（一次性调用；幂等；收 Chart 类本身） */
export function applyChartDefaults(chartClass: typeof Chart): void {
  const d = chartClass.defaults as unknown as Record<string, unknown> & {
    __argonApplied?: boolean;
  };
  if (d.__argonApplied) return;
  d.__argonApplied = true;

  Object.assign(d, {
    font: { family: FONT_FAMILY, size: 13, ...(d.font as object) },
    color: chartColors.gray[600],
    borderColor: chartColors.gray[200],
  });
  d.plugins = {
    ...((d.plugins as object) ?? {}),
    legend: { display: false },
  };
}

/** 给数据集数组按 palette 补默认色（手动指定色的数据集不消耗调色板索引） */
export function withPalette<T extends { backgroundColor?: unknown }>(
  datasets: T[],
): T[] {
  let idx = 0;
  return datasets.map((ds) => ({
    ...ds,
    backgroundColor:
      ds.backgroundColor === undefined ? palette[idx++ % palette.length] : ds.backgroundColor,
  }));
}
