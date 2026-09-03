<script setup lang="ts">
import { ref } from "vue";

defineProps<{ title: string }>();
const show = ref(false);
</script>

<template>
  <span
    class="ag-overlay-root"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <slot />
    <span v-if="show" class="ag-tooltip" role="tooltip">{{ title }}</span>
  </span>
</template>
