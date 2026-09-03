<script setup lang="ts">
defineProps<{
  max?: number;
}>();
</script>

<template>
  <span class="ag-avatar-group">
    <slot />
    <span v-if="max != null && $slots.more" class="ag-avatar ag-avatar-group__more">
      <slot name="more" />
    </span>
  </span>
</template>
