<script setup lang="ts">
import ArgonChart from "./Chart.vue";

withDefaults(
  defineProps<{
    labels: string[];
    datasets: Array<Record<string, unknown>>;
    options?: Record<string, unknown>;
    height?: number;
  }>(),
  { height: 300 },
);
</script>

<template>
  <ArgonChart kind="doughnut" :labels="labels" :datasets="datasets" :options="options" :height="height" />
</template>
