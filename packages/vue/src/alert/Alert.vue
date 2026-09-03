<script setup lang="ts">
import { computed, ref, useSlots } from "vue";

export type AlertVariant =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

const props = withDefaults(
  defineProps<{
    variant?: AlertVariant;
    dismissible?: boolean;
  }>(),
  { variant: "default", dismissible: false },
);

const emit = defineEmits<{ close: [] }>();

const visible = ref(true);
const slots = useSlots();

const className = computed(() =>
  props.variant === "default" ? "ag-alert" : `ag-alert ag-alert--${props.variant}`,
);
</script>

<template>
  <div v-if="visible" :class="className" role="alert">
    <span v-if="slots.icon || $slots.icon" class="ag-alert__icon"><slot name="icon" /></span>
    <div class="ag-alert__content"><slot /></div>
    <button
      v-if="dismissible"
      type="button"
      class="ag-alert__close"
      aria-label="close"
      @click="visible = false; emit('close')"
    >
      ×
    </button>
  </div>
</template>
