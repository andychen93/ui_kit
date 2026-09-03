<script setup lang="ts">
const checked = defineModel<boolean>({ default: false });
defineProps<{ disabled?: boolean }>();
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="checked"
    :disabled="disabled"
    :class="['ag-switch', checked ? 'is-checked' : '']"
    @click="!disabled && (checked = !checked)"
  >
    <span class="ag-switch__thumb" />
  </button>
</template>
