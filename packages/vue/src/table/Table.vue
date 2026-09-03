<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref } from "vue";
import type { SortableColumn } from "./types";

const props = defineProps<{
  columns: SortableColumn<T>[];
  data: T[];
  rowKey: keyof T | string;
  loading?: boolean;
  striped?: boolean;
  clickable?: boolean;
  activeKey?: string | number;
  scrollX?: number;
}>();

const emit = defineEmits<{
  rowClick: [record: T];
}>();

/** 本地排序状态（null=原始顺序） */
const sortKey = ref<string | null>(null);
const sortAsc = ref(true);

function toggleSort(col: SortableColumn<T>) {
  if (!col.sorter) return;
  if (sortKey.value === col.key) {
    if (sortAsc.value) sortAsc.value = false;
    else {
      sortKey.value = null; // 第三次点击恢复原始顺序
      sortAsc.value = true;
    }
  } else {
    sortKey.value = col.key;
    sortAsc.value = true;
  }
}

const sortedData = computed(() => {
  if (!sortKey.value) return props.data;
  const col = props.columns.find((c) => c.key === sortKey.value);
  if (!col?.sorter) return props.data;
  const arr = [...props.data];
  arr.sort(col.sorter);
  return sortAsc.value ? arr : arr.reverse();
});

function rowId(record: T) {
  return String(record[props.rowKey as string]);
}

function cellValue(record: T, dataIndex?: string) {
  if (!dataIndex) return "";
  const v = record[dataIndex];
  return v == null ? "" : String(v);
}

/** 固定列的 sticky 偏移：left 列累积前面的列宽，right 列累积后面的列宽 */
const stickyStyle = computed(() => {
  const leftOffsets = new Map<string, string>();
  const rightOffsets = new Map<string, string>();
  let acc = 0;
  for (const c of props.columns) {
    if (c.fixed === "left") {
      leftOffsets.set(c.key, `${acc}px`);
      acc += Number(c.width ?? 160);
    }
  }
  acc = 0;
  for (let i = props.columns.length - 1; i >= 0; i--) {
    const c = props.columns[i];
    if (c.fixed === "right") {
      rightOffsets.set(c.key, `${acc}px`);
      acc += Number(c.width ?? 160);
    }
  }
  return { leftOffsets, rightOffsets };
});

function cellStyle(c: SortableColumn<T>) {
  const s: Record<string, string> = {};
  if (c.width) s.width = typeof c.width === "number" ? `${c.width}px` : c.width;
  if (c.fixed === "left") s.left = stickyStyle.value.leftOffsets.get(c.key) ?? "0px";
  if (c.fixed === "right") s.right = stickyStyle.value.rightOffsets.get(c.key) ?? "0px";
  if (c.align) s.textAlign = c.align;
  return s;
}
</script>

<template>
  <div :class="['ag-table-wrap', loading ? 'is-loading' : '']">
    <div class="ag-table-scroll" :style="scrollX ? { minWidth: scrollX + 'px' } : undefined">
      <table :class="['ag-table', striped ? 'ag-table--striped' : '']">
        <thead>
          <tr>
            <th
              v-for="c in columns"
              :key="c.key"
              :class="[
                c.fixed ? `ag-table__cell--fixed ag-table__cell--fixed-${c.fixed}` : '',
                c.sorter ? 'ag-table__th-sorter' : '',
                sortKey === c.key ? 'is-sorted' : '',
                c.align ? `is-align-${c.align}` : '',
              ]"
              :style="cellStyle(c)"
              :aria-sort="sortKey === c.key ? (sortAsc ? 'ascending' : 'descending') : undefined"
              @click="toggleSort(c)"
            >
              <span :class="c.ellipsis ? 'ag-table__ellipsis' : ''">{{ c.title }}</span>
              <span v-if="c.sorter" class="ag-table__sorter">
                {{ sortKey === c.key ? (sortAsc ? "↑" : "↓") : "⇅" }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sortedData.length === 0">
            <td class="ag-table__empty" :colspan="columns.length">
              {{ loading ? "加载中…" : "暂无数据" }}
            </td>
          </tr>
          <tr
            v-for="(record, index) in sortedData"
            :key="rowId(record)"
            :class="{
              'is-clickable': clickable,
              'is-active': activeKey != null && String(activeKey) === rowId(record),
            }"
            @click="emit('rowClick', record)"
          >
            <td
              v-for="c in columns"
              :key="c.key"
              :class="[
                c.fixed ? `ag-table__cell--fixed ag-table__cell--fixed-${c.fixed}` : '',
                c.align ? `is-align-${c.align}` : '',
              ]"
              :style="cellStyle(c)"
            >
              <slot
                :name="`cell-${c.key}`"
                :record="record"
                :value="record[c.dataIndex ?? '']"
                :index="index"
              >
                <span :class="c.ellipsis ? 'ag-table__ellipsis' : ''">
                  {{ cellValue(record, c.dataIndex) }}
                </span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
