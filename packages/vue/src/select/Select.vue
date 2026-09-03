<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import Glyph from "../glyph/Glyph.vue";
import type { FieldStatus } from "../input/types";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

const model = defineModel<string | number | null>({ default: null });
const props = withDefaults(
  defineProps<{
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    status?: FieldStatus;
    hint?: string;
  }>(),
  { placeholder: "请选择", disabled: false, allowClear: false },
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const selected = computed(() => props.options.find((o) => o.value === model.value));

const onDoc = (e: MouseEvent) => {
  if (!root.value?.contains(e.target as Node)) open.value = false;
};
onMounted(() => document.addEventListener("mousedown", onDoc));
onUnmounted(() => document.removeEventListener("mousedown", onDoc));

function pick(opt: SelectOption) {
  if (opt.disabled) return;
  model.value = opt.value;
  open.value = false;
}
</script>

<template>
  <div ref="root" class="ag-field">
    <div class="ag-select">
      <div
        role="combobox"
        :aria-expanded="open"
        :tabindex="disabled ? -1 : 0"
        :class="[
          'ag-input-wrap',
          'ag-select__trigger',
          status ? `is-${status}` : '',
          disabled ? 'is-disabled' : '',
        ]"
        @click="!disabled && (open = !open)"
      >
        <span :class="['ag-select__value', selected ? '' : 'is-placeholder']">
          {{ selected?.label ?? placeholder }}
        </span>
        <button
          v-if="allowClear && selected"
          type="button"
          class="ag-input__addon-btn"
          aria-label="清除"
          @click.stop="model = null"
        >
          <Glyph name="x" />
        </button>
        <Glyph v-else name="chevronDown" />
      </div>
      <ul v-if="open" class="ag-select__dropdown" role="listbox">
        <li
          v-for="opt in options"
          :key="String(opt.value)"
          role="option"
          :class="[
            'ag-select__option',
            opt.value === model ? 'is-active' : '',
            opt.disabled ? 'is-disabled' : '',
          ]"
          @click="pick(opt)"
        >
          {{ opt.label }}
        </li>
      </ul>
    </div>
    <p v-if="hint" :class="['ag-field__hint', status ? `is-${status}` : '']">{{ hint }}</p>
  </div>
</template>
