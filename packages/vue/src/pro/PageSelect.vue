<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import type { ColumnDef, PageQuery, PageResult } from "@argon-kit/core";
import Glyph from "../glyph/Glyph.vue";
import Input from "../input/Input.vue";
import Pagination from "../table/Pagination.vue";
import Table from "../table/Table.vue";

const SEARCH_DEBOUNCE_MS = 300;

const model = defineModel<T | null>({ default: null });
const props = withDefaults(
  defineProps<{
    service: (params: PageQuery) => Promise<PageResult<T>>;
    columns: ColumnDef[];
    rowKey: keyof T | string;
    labelField: keyof T | string;
    placeholder?: string;
    searchField?: keyof T | string;
    pageSize?: number;
    popoverWidth?: number;
    allowClear?: boolean;
    cacheKey?: string;
  }>(),
  { placeholder: "请选择", pageSize: 5, popoverWidth: 480, allowClear: false },
);

const open = ref(false);
const text = ref("");
const keyword = ref("");
const page = ref(1);
const size = ref(props.pageSize);
const list = ref<T[]>([]);
const total = ref(0);
const loading = ref(false);
const root = ref<HTMLElement | null>(null);
let timer: ReturnType<typeof setTimeout> | null = null;

const selectedLabel = computed(() =>
  model.value ? String(model.value[props.labelField as string] ?? "") : "",
);
const activeKey = computed(() =>
  model.value ? String(model.value[props.rowKey as string]) : undefined,
);

watch(selectedLabel, (v) => {
  text.value = v;
}, { immediate: true });

watch(keyword, () => {
  page.value = 1;
});

watch(
  () => [open.value, page.value, size.value, keyword.value] as const,
  async () => {
    if (!open.value) return;
    loading.value = true;
    try {
      const res = await props.service({
        pageNum: page.value,
        pageSize: size.value,
        ...(props.searchField ? { [String(props.searchField)]: keyword.value } : {}),
      });
      list.value = res.list;
      total.value = res.total;
    } finally {
      loading.value = false;
    }
  },
);

function cancelSearch() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function scheduleSearch(kw: string) {
  cancelSearch();
  timer = setTimeout(() => {
    keyword.value = kw;
  }, SEARCH_DEBOUNCE_MS);
}

function onDoc(e: MouseEvent) {
  if (root.value?.contains(e.target as Node)) return;
  cancelSearch();
  open.value = false;
  keyword.value = "";
  text.value = selectedLabel.value;
}

onMounted(() => document.addEventListener("mousedown", onDoc));
onUnmounted(() => {
  document.removeEventListener("mousedown", onDoc);
  cancelSearch();
});

function onFocusIn() {
  if (!open.value) {
    keyword.value = "";
    page.value = 1;
  }
  open.value = true;
}

function onInput(v: string | undefined) {
  const next = v ?? "";
  text.value = next;
  scheduleSearch(next);
  open.value = true;
}

// Table 泛型事件经模板 UnwrapRefSimple<T> 包装，此处收 any 后 cast 回 T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleSelect(record: any) {
  cancelSearch();
  model.value = record as T;
  text.value = String((record as T)[props.labelField as string] ?? "");
  open.value = false;
  keyword.value = "";
}

function clear() {
  cancelSearch();
  model.value = null;
  text.value = "";
  keyword.value = "";
  open.value = false;
}
</script>

<template>
  <div ref="root" class="ag-page-select" @focusin="onFocusIn">
    <Input
      :model-value="text"
      :placeholder="placeholder"
      @update:model-value="onInput"
    >
      <template #suffix>
        <button
          v-if="allowClear && text"
          type="button"
          class="ag-input__addon-btn"
          aria-label="清除"
          @click.stop="clear"
        >
          <Glyph name="x" />
        </button>
        <Glyph v-else name="search" />
      </template>
    </Input>
    <div v-if="open" class="ag-page-select__panel" :style="{ width: popoverWidth + 'px' }">
      <Table
        :columns="columns"
        :data="list"
        :row-key="rowKey as string"
        :loading="loading"
        clickable
        :active-key="activeKey"
        @row-click="handleSelect"
      />
      <Pagination
        :current="page"
        :page-size="size"
        :total="total"
        @change="(p, ps) => { page = p; size = ps; }"
      />
    </div>
  </div>
</template>
