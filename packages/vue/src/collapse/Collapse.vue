<script setup lang="ts">
import { computed, provide } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    accordion?: boolean;
  }>(),
  { modelValue: () => [], accordion: false },
);

const emit = defineEmits<{ "update:modelValue": [string[]] }>();

const activeKeys = computed(() => props.modelValue);

function toggle(key: string) {
  const active = activeKeys.value;
  let next: string[];
  if (props.accordion) {
    next = active.includes(key) ? [] : [key];
  } else {
    next = active.includes(key) ? active.filter((k) => k !== key) : [...active, key];
  }
  emit("update:modelValue", next);
}

function isActive(key: string) {
  return activeKeys.value.includes(key);
}

provide("agCollapse", { toggle, isActive });
</script>

<template>
  <div class="ag-collapse">
    <slot />
  </div>
</template>
