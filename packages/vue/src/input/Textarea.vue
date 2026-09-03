<script setup lang="ts">
import { computed } from "vue";
import type { FieldStatus } from "./types";

const model = defineModel<string>({ default: "" });
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    disabled?: boolean;
    status?: FieldStatus;
    hint?: string;
    rows?: number;
  }>(),
  { disabled: false, rows: 3 },
);

const wrapClass = computed(() =>
  [
    "ag-input-wrap",
    "ag-input-wrap--textarea",
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
      <textarea
        v-model="model"
        class="ag-textarea"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
      />
    </div>
    <p v-if="hint" :class="['ag-field__hint', status ? `is-${status}` : '']">{{ hint }}</p>
  </div>
</template>
