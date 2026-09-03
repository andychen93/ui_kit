<script lang="ts">
  import { onMount } from "svelte";
  import { Chart, registerables, type ChartConfiguration, type ChartType } from "chart.js";
  import {
    applyChartDefaults,
    baseOptionsFor,
    withPalette,
    type ChartKind,
  } from "../core/chartTheme";

  Chart.register(...registerables);
  applyChartDefaults(Chart);

  let {
    kind = "line",
    labels,
    datasets,
    options = {},
    height = 300,
  }: {
    kind?: ChartKind;
    labels: string[];
    datasets: Array<Record<string, unknown>>;
    options?: Record<string, unknown>;
    height?: number;
  } = $props();

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;
  let currentKind: ChartKind = kind;

  function buildConfig(): ChartConfiguration {
    return {
      type: kind as ChartType,
      data: {
        labels,
        datasets: withPalette(datasets as Array<{ backgroundColor?: unknown }>) as never,
      },
      options: { ...baseOptionsFor(kind), ...options },
    };
  }

  onMount(() => {
    currentKind = kind;
    chart = canvas ? new Chart(canvas, buildConfig()) : null;
    return () => chart?.destroy();
  });

  // kind 变化 → 重建
  $effect(() => {
    if (kind === currentKind) return;
    currentKind = kind;
    chart?.destroy();
    chart = canvas ? new Chart(canvas, buildConfig()) : null;
  });

  // 数据/options 变化 → 原地更新
  $effect(() => {
    void labels;
    void datasets;
    void options;
    if (!chart || kind !== currentKind) return;
    chart.data.labels = labels;
    chart.data.datasets = withPalette(datasets as Array<{ backgroundColor?: unknown }>) as never;
    chart.options = { ...baseOptionsFor(kind), ...options };
    chart.update();
  });
</script>

<div class="ag-chart" style="height:{height}px">
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <canvas bind:this={canvas}></canvas>
</div>
