<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
  }>(),
  { modelValue: 0, min: 0, max: 100, step: 1, disabled: false },
);

const emit = defineEmits<{ "update:modelValue": [number] }>();

const percent = computed(() =>
  ((props.modelValue - props.min) / (props.max - props.min)) * 100,
);

function onInput(e: Event) {
  emit("update:modelValue", Number((e.target as HTMLInputElement).value));
}
</script>

<template>
  <div class="ag-slider" :class="{ 'ag-slider--disabled': disabled }">
    <input
      type="range"
      class="ag-slider__input"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :disabled="disabled"
      :style="{ '--ag-slider-percent': percent + '%' }"
      @input="onInput"
    />
    <span class="ag-slider__value">{{ modelValue }}</span>
  </div>
</template>
