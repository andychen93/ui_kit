<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref, useSlots, watch } from "vue";
import type { ColumnDef, PageQuery, PageResult, QueryField } from "@argon-kit/core";
import Pagination from "../table/Pagination.vue";
import Table from "../table/Table.vue";
import QueryForm from "./QueryForm.vue";

const props = withDefaults(
  defineProps<{
    service: (params: PageQuery) => Promise<PageResult<T>>;
    columns: ColumnDef[];
    rowKey: keyof T | string;
    querySchema?: QueryField[];
    pageSize?: number;
  }>(),
  { pageSize: 10 },
);

const filters = ref<Record<string, unknown>>({});
const page = ref(1);
const size = ref(props.pageSize);
const list = ref<T[]>([]);
const total = ref(0);
const loading = ref(false);
const slots: Record<string, unknown> = useSlots() as Record<string, unknown>;
const cellSlotNames = computed<string[]>(() =>
  Object.keys(slots).filter((n: string) => n.startsWith("cell-")),
);

watch(
  () => [props.service, page.value, size.value, filters.value] as const,
  async () => {
    loading.value = true;
    try {
      const res = await props.service({
        pageNum: page.value,
        pageSize: size.value,
        ...filters.value,
      });
      list.value = res.list;
      total.value = res.total;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);

function applyFilters(next: Record<string, unknown>) {
  filters.value = next;
  page.value = 1;
}
</script>

<template>
  <QueryForm v-if="querySchema?.length" :fields="querySchema" @search="applyFilters" />
  <div class="ag-card">
    <div v-if="$slots.toolbar" class="ag-toolbar">
      <slot name="toolbar" />
    </div>
    <Table :columns="columns" :data="list" :row-key="rowKey as string" :loading="loading">
      <template v-for="name in cellSlotNames" :key="name" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps ?? {}" />
      </template>
    </Table>
    <Pagination
      :current="page"
      :page-size="size"
      :total="total"
      show-size-changer
      @change="(p, ps) => { page = p; size = ps; }"
    />
  </div>
</template>
