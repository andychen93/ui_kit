<script setup lang="ts">
import Radio from "./Radio.vue";

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

const model = defineModel<string | number | null>({ default: null });
defineProps<{
  options: RadioOption[];
  name?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <div role="radiogroup" style="display: flex; gap: 16px; flex-wrap: wrap">
    <Radio
      v-for="opt in options"
      :key="String(opt.value)"
      :name="name"
      :checked="opt.value === model"
      :disabled="disabled || opt.disabled"
      @change="model = opt.value"
    >
      {{ opt.label }}
    </Radio>
  </div>
</template>
