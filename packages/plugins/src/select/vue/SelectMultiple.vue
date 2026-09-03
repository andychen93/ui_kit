<script setup lang="ts">
import type { SelectMultipleProps } from "../../core/types";

const props = withDefaults(defineProps<SelectMultipleProps>(), {
  value: () => [],
  placeholder: "请选择",
  disabled: false,
});

const emit = defineEmits<{ "update:modelValue": [string[]] }>();

function toggle(v: string) {
  if (props.disabled) return;
  const next = props.value.includes(v)
    ? props.value.filter((x) => x !== v)
    : [...props.value, v];
  emit("update:modelValue", next);
  props.onChange?.(next);
}

function remove(v: string) {
  if (props.disabled) return;
  const next = props.value.filter((x) => x !== v);
  emit("update:modelValue", next);
  props.onChange?.(next);
}
</script>

<template>
  <div class="ag-multiselect">
    <div v-if="value.length" class="ag-multiselect__chips">
      <span v-for="v in value" :key="v" class="ag-multiselect__chip">
        {{ options.find((o) => o.value === v)?.label ?? v }}
        <button type="button" aria-label="remove" @click="remove(v)">×</button>
      </span>
    </div>
    <div v-else class="ag-multiselect__placeholder">{{ placeholder }}</div>
    <ul class="ag-multiselect__list">
      <li
        v-for="opt in options"
        :key="opt.value"
        :class="{
          'is-selected': value.includes(opt.value),
          'is-disabled': opt.disabled,
        }"
      >
        <label>
          <input
            type="checkbox"
            :checked="value.includes(opt.value)"
            :disabled="opt.disabled || disabled"
            @change="toggle(opt.value)"
          />
          {{ opt.label }}
        </label>
      </li>
    </ul>
  </div>
</template>
