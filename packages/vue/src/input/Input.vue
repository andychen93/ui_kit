<script setup lang="ts">
import { computed, useSlots } from "vue";
import type { FieldStatus } from "./types";

const model = defineModel<string>({ default: "" });

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    disabled?: boolean;
    status?: FieldStatus;
    hint?: string;
    type?: string;
  }>(),
  { type: "text", disabled: false },
);

const slots = useSlots();
const wrapClass = computed(() =>
  [
    "ag-input-wrap",
    props.status ? `is-${props.status}` : "",
    props.disabled ? "is-disabled" : "",
  ]
    .filter(Boolean)
    .join(" "),
);
</script>

<template>
  <div class="ag-field">
    <div :class="wrapClass">
      <span v-if="slots.prefix" class="ag-input__addon"><slot name="prefix" /></span>
      <input
        v-model="model"
        class="ag-input"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <span v-if="slots.suffix" class="ag-input__addon"><slot name="suffix" /></span>
    </div>
    <p v-if="hint" :class="['ag-field__hint', status ? `is-${status}` : '']">{{ hint }}</p>
  </div>
</template>
