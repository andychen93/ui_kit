<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Chart, registerables, type ChartConfiguration, type ChartType } from "chart.js";
import {
  applyChartDefaults,
  baseOptionsFor,
  withPalette,
  type ChartKind,
} from "../core/chartTheme";

Chart.register(...registerables);
applyChartDefaults(Chart);

const props = withDefaults(
  defineProps<{
    kind?: ChartKind;
    labels: string[];
    datasets: Array<Record<string, unknown>>;
    options?: Record<string, unknown>;
    height?: number;
  }>(),
  { kind: "line", height: 300 },
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

function buildConfig(): ChartConfiguration {
  return {
    type: props.kind as ChartType,
    data: {
      labels: props.labels,
      datasets: withPalette(
        props.datasets as Array<{ backgroundColor?: unknown }>,
      ) as never,
    },
    options: {
      ...baseOptionsFor(props.kind),
      ...props.options,
    },
  };
}

onMounted(() => {
  if (!canvasRef.value) return;
  chart = new Chart(canvasRef.value, buildConfig());
});

// kind 变化 → 重建（类型不同无法原地改）
watch(
  () => props.kind,
  () => {
    chart?.destroy();
    chart = canvasRef.value ? new Chart(canvasRef.value, buildConfig()) : null;
  },
);

// 数据/options 变化 → 原地更新（高频刷新场景不重建 canvas）
watch(
  () => [props.labels, props.datasets, props.options] as const,
  () => {
    if (!chart) return;
    chart.data.labels = props.labels;
    chart.data.datasets = withPalette(
      props.datasets as Array<{ backgroundColor?: unknown }>,
    ) as never;
    chart.options = { ...baseOptionsFor(props.kind), ...props.options };
    chart.update();
  },
  { deep: true },
);

onBeforeUnmount(() => chart?.destroy());
</script>

<template>
  <div class="ag-chart" :style="{ height: height + 'px' }">
    <canvas ref="canvasRef" />
  </div>
</template>
