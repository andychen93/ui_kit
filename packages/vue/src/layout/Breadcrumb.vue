<script setup lang="ts">
import type { BreadcrumbItem } from "@argon-kit/core";

defineProps<{ items: BreadcrumbItem[] }>();
const emit = defineEmits<{ navigate: [item: BreadcrumbItem, index: number] }>();
</script>

<template>
  <nav class="ag-breadcrumb" aria-label="面包屑">
    <span v-for="(item, i) in items" :key="item.label + i" style="display: inline-flex; align-items: center; gap: 8px">
      <span v-if="i > 0" class="ag-breadcrumb__sep">/</span>
      <button v-if="i < items.length - 1" type="button" @click="emit('navigate', item, i)">{{ item.label }}</button>
      <span v-else>{{ item.label }}</span>
    </span>
  </nav>
</template>
