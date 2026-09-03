<script setup lang="ts">
import type { StatVariant } from "@argon-kit/core";

withDefaults(
  defineProps<{
    variant?: StatVariant;
    label: string;
    value?: string | number;
    progress?: number;
    hint?: string;
  }>(),
  { variant: "primary" },
);
</script>

<template>
  <div :class="['ag-stat-card', `ag-stat-card--${variant}`]">
    <div class="ag-stat-card__label">{{ label }}</div>
    <div class="ag-stat-card__value">
      {{ typeof value === "number" ? value.toLocaleString("en-US") : (value ?? "—") }}
    </div>
    <div v-if="progress != null" class="ag-stat-card__progress">
      <div class="ag-stat-card__bar" :style="{ width: progress + '%' }" />
    </div>
    <div v-if="hint || $slots.hint" class="ag-stat-card__hint">
      <slot name="hint">{{ hint }}</slot>
    </div>
  </div>
</template>
