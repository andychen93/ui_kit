<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const onDoc = (e: MouseEvent) => {
  if (!root.value?.contains(e.target as Node)) open.value = false;
};
onMounted(() => document.addEventListener("mousedown", onDoc));
onUnmounted(() => document.removeEventListener("mousedown", onDoc));
</script>

<template>
  <div ref="root" class="ag-overlay-root">
    <span @click="open = !open"><slot /></span>
    <div v-if="open" class="ag-popover"><slot name="content" /></div>
  </div>
</template>
