<script setup lang="ts">
import { computed } from "vue";

export type TagVariant =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

const props = withDefaults(
  defineProps<{
    variant?: TagVariant;
    dot?: boolean;
    closable?: boolean;
  }>(),
  { variant: "default", dot: true, closable: false },
);

const emit = defineEmits<{ close: [MouseEvent] }>();

const className = computed(() =>
  props.variant === "default" ? "ag-tag" : `ag-tag ag-tag--${props.variant}`,
);
</script>

<template>
  <span :class="className">
    <span v-if="dot" class="ag-tag__dot" />
    <slot />
    <button
      v-if="closable"
      type="button"
      class="ag-tag__close"
      aria-label="close"
      @click="emit('close', $event)"
    >
      ×
    </button>
  </span>
</template>
