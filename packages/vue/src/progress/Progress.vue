<script setup lang="ts">
import { computed } from "vue";

export type ProgressVariant =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "gradient-primary"
  | "gradient-info"
  | "gradient-success"
  | "gradient-warning"
  | "gradient-danger";

const props = withDefaults(
  defineProps<{
    percent?: number;
    variant?: ProgressVariant;
    thin?: boolean;
    striped?: boolean;
    showLabel?: boolean;
  }>(),
  { percent: 0, variant: "primary", thin: false, striped: false, showLabel: false },
);

const clamped = computed(() => Math.min(100, Math.max(0, props.percent)));
const className = computed(() =>
  [
    "ag-progress",
    `ag-progress--${props.variant}`,
    props.thin ? "ag-progress--thin" : "",
    props.striped ? "ag-progress--striped" : "",
  ]
    .filter(Boolean)
    .join(" "),
);
</script>

<template>
  <div :class="className" role="progressbar" :aria-valuenow="clamped" aria-valuemin="0" aria-valuemax="100">
    <div class="ag-progress__track">
      <div class="ag-progress__bar" :style="{ width: clamped + '%' }" />
    </div>
    <span v-if="showLabel" class="ag-progress__label">{{ clamped }}%</span>
  </div>
</template>
