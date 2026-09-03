<script setup lang="ts">
import { computed } from "vue";

export type BadgeVariant =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type BadgeSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant;
    pill?: boolean;
    size?: BadgeSize;
    circle?: boolean;
  }>(),
  { variant: "default", pill: false, size: "sm", circle: false },
);

const className = computed(() =>
  [
    "ag-badge",
    props.variant !== "default" ? `ag-badge--${props.variant}` : "",
    props.circle ? "ag-badge--circle" : "",
    props.size !== "sm" ? `ag-badge--${props.size}` : "",
    props.pill ? "ag-badge--pill" : "",
  ]
    .filter(Boolean)
    .join(" "),
);
</script>

<template>
  <span :class="className"><slot /></span>
</template>
