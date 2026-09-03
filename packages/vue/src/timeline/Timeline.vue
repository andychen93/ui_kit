<script setup lang="ts">
import type { TimelineItem } from "@argon-kit/core";

defineProps<{
  items: TimelineItem[];
}>();
</script>

<template>
  <ul class="ag-timeline">
    <li v-for="(item, i) in items" :key="i" class="ag-timeline__item">
      <span class="ag-timeline__dot" :class="item.color ? `ag-timeline__dot--${item.color}` : ''" />
      <div class="ag-timeline__content">{{ item.content }}</div>
      <div v-if="item.time" class="ag-timeline__time">{{ item.time }}</div>
    </li>
  </ul>
</template>
