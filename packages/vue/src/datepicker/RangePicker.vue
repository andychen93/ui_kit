<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { WEEKDAYS, addMonths, compareYMD, monthGrid, ymd } from "@argon-kit/core";
import Glyph from "../glyph/Glyph.vue";

const model = defineModel<[string, string] | null>({ default: null });
defineProps<{ placeholder?: string; disabled?: boolean; status?: "error" | "success"; hint?: string }>();

const open = ref(false);
const draft = ref<string | null>(null);
const root = ref<HTMLElement | null>(null);
const cursor = ref({ year: new Date().getFullYear(), month: new Date().getMonth() });
const next = computed(() => addMonths(cursor.value.year, cursor.value.month, 1));
const cellsA = computed(() => monthGrid(cursor.value.year, cursor.value.month));
const cellsB = computed(() => monthGrid(next.value.year, next.value.month));

const onDoc = (e: MouseEvent) => {
  if (!root.value?.contains(e.target as Node)) open.value = false;
};
onMounted(() => document.addEventListener("mousedown", onDoc));
onUnmounted(() => document.removeEventListener("mousedown", onDoc));

function pick(year: number, month: number, day: number) {
  const value = ymd(year, month, day);
  if (!draft.value) {
    draft.value = value;
    return;
  }
  const start = compareYMD(draft.value, value) <= 0 ? draft.value : value;
  const end = compareYMD(draft.value, value) <= 0 ? value : draft.value;
  model.value = [start, end];
  draft.value = null;
  open.value = false;
}

function dayClass(year: number, month: number, day: number | null) {
  if (!day) return {};
  const value = ymd(year, month, day);
  const start = draft.value ?? model.value?.[0];
  const end = draft.value ? null : model.value?.[1];
  return {
    "is-selected": value === start || value === end,
    "is-in-range": !!(start && end && compareYMD(value, start) >= 0 && compareYMD(value, end) <= 0),
  };
}
</script>

<template>
  <div ref="root" class="ag-field">
    <div class="ag-datepicker">
      <div
        role="combobox"
        :class="['ag-input-wrap', 'ag-select__trigger', disabled ? 'is-disabled' : '', status ? `is-${status}` : '']"
        @click="!disabled && (open = !open)"
      >
        <span :class="['ag-select__value', model ? '' : 'is-placeholder']">
          {{ model ? `${model[0]} ~ ${model[1]}` : placeholder ?? "开始日期 ~ 结束日期" }}
        </span>
        <Glyph name="chevronDown" />
      </div>
      <div v-if="open" class="ag-calendar ag-calendar--range">
        <div class="ag-calendar__panel">
          <div class="ag-calendar__head">
            <button type="button" class="ag-calendar__nav" aria-label="上一月" @click="cursor = addMonths(cursor.year, cursor.month, -1)">
              <Glyph name="chevronLeft" />
            </button>
            <span>{{ cursor.year }} 年 {{ cursor.month + 1 }} 月</span>
            <span />
          </div>
          <div class="ag-calendar__week"><span v-for="w in WEEKDAYS" :key="w">{{ w }}</span></div>
          <div class="ag-calendar__grid">
            <button
              v-for="(day, i) in cellsA"
              :key="'a' + i"
              type="button"
              class="ag-calendar__day"
              :class="dayClass(cursor.year, cursor.month, day)"
              :disabled="!day"
              @click="day && pick(cursor.year, cursor.month, day)"
            >
              {{ day }}
            </button>
          </div>
        </div>
        <div class="ag-calendar__panel">
          <div class="ag-calendar__head">
            <span />
            <span>{{ next.year }} 年 {{ next.month + 1 }} 月</span>
            <button type="button" class="ag-calendar__nav" aria-label="下一月" @click="cursor = addMonths(cursor.year, cursor.month, 1)">
              <Glyph name="chevronRight" />
            </button>
          </div>
          <div class="ag-calendar__week"><span v-for="w in WEEKDAYS" :key="'b' + w">{{ w }}</span></div>
          <div class="ag-calendar__grid">
            <button
              v-for="(day, i) in cellsB"
              :key="'b' + i"
              type="button"
              class="ag-calendar__day"
              :class="dayClass(next.year, next.month, day)"
              :disabled="!day"
              @click="day && pick(next.year, next.month, day)"
            >
              {{ day }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
