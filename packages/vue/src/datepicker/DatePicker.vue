<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  WEEKDAYS,
  addMonths,
  compareYMD,
  formatYMD,
  monthGrid,
  ymd,
} from "@argon-kit/core";
import Glyph from "../glyph/Glyph.vue";

const model = defineModel<string | null>({ default: null });
defineProps<{
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  status?: "error" | "success";
  hint?: string;
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const today = formatYMD(new Date());
const seed = computed(() => {
  if (model.value) return new Date(model.value + "T00:00:00");
  return new Date();
});
const cursor = ref({ year: seed.value.getFullYear(), month: seed.value.getMonth() });
const cells = computed(() => monthGrid(cursor.value.year, cursor.value.month));

const onDoc = (e: MouseEvent) => {
  if (!root.value?.contains(e.target as Node)) open.value = false;
};
onMounted(() => document.addEventListener("mousedown", onDoc));
onUnmounted(() => document.removeEventListener("mousedown", onDoc));

function pick(day: number) {
  model.value = ymd(cursor.value.year, cursor.value.month, day);
  open.value = false;
}
</script>

<template>
  <div ref="root" class="ag-field">
    <div class="ag-datepicker">
      <div
        role="combobox"
        :aria-expanded="open"
        :class="['ag-input-wrap', 'ag-select__trigger', disabled ? 'is-disabled' : '', status ? `is-${status}` : '']"
        @click="!disabled && (open = !open)"
      >
        <span :class="['ag-select__value', model ? '' : 'is-placeholder']">
          {{ model ?? placeholder ?? "选择日期" }}
        </span>
        <button
          v-if="allowClear && model"
          type="button"
          class="ag-input__addon-btn"
          aria-label="清除"
          @click.stop="model = null"
        >
          <Glyph name="x" />
        </button>
        <Glyph v-else name="chevronDown" />
      </div>
      <div v-if="open" class="ag-calendar">
        <div class="ag-calendar__head">
          <button
            type="button"
            class="ag-calendar__nav"
            aria-label="上一月"
            @click="cursor = addMonths(cursor.year, cursor.month, -1)"
          >
            <Glyph name="chevronLeft" />
          </button>
          <span>{{ cursor.year }} 年 {{ cursor.month + 1 }} 月</span>
          <button
            type="button"
            class="ag-calendar__nav"
            aria-label="下一月"
            @click="cursor = addMonths(cursor.year, cursor.month, 1)"
          >
            <Glyph name="chevronRight" />
          </button>
        </div>
        <div class="ag-calendar__week">
          <span v-for="w in WEEKDAYS" :key="w">{{ w }}</span>
        </div>
        <div class="ag-calendar__grid">
          <button
            v-for="(day, i) in cells"
            :key="i"
            type="button"
            class="ag-calendar__day"
            :class="{
              'is-today': day ? ymd(cursor.year, cursor.month, day) === today : false,
              'is-selected': day ? ymd(cursor.year, cursor.month, day) === model : false,
            }"
            :disabled="!day"
            @click="day && pick(day)"
          >
            {{ day }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
