<script setup lang="ts">
import type { StepItem } from "@argon-kit/core";

withDefaults(
  defineProps<{
    items: StepItem[];
    current?: number;
    direction?: "horizontal" | "vertical";
  }>(),
  { current: 0, direction: "horizontal" },
);
</script>

<template>
  <div class="ag-steps" :class="direction === 'vertical' ? 'ag-steps--vertical' : ''">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="ag-steps__item"
      :class="{
        'is-finish': i < current,
        'is-active': i === current,
      }"
    >
      <span class="ag-steps__marker">
        <template v-if="i < current">✓</template>
        <template v-else>{{ i + 1 }}</template>
      </span>
      <div class="ag-steps__meta">
        <div class="ag-steps__title">{{ item.title }}</div>
        <div v-if="item.description" class="ag-steps__desc">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>
