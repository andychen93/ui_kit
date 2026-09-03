<script setup lang="ts">
import { useSlots } from "vue";

withDefaults(
  defineProps<{
    description?: string;
  }>(),
  { description: "暂无数据" },
);

const slots = useSlots();
</script>

<template>
  <div class="ag-empty">
    <div class="ag-empty__image">
      <slot name="image">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 13V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6" />
          <path d="M2 13h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
          <path d="M6 20v.01M10 20v.01M14 20v.01M18 20v.01" />
        </svg>
      </slot>
    </div>
    <p class="ag-empty__desc">{{ description }}</p>
    <div v-if="slots.extra || $slots.extra" class="ag-empty__extra">
      <slot name="extra" />
    </div>
  </div>
</template>
