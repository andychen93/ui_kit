<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    current: number;
    pageSize: number;
    total: number;
    showTotal?: boolean;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
  }>(),
  {
    showTotal: true,
    showSizeChanger: false,
    pageSizeOptions: () => [10, 20, 50],
  },
);

const emit = defineEmits<{
  change: [page: number, pageSize: number];
}>();

function pages() {
  return Math.max(1, Math.ceil(props.total / Math.max(props.pageSize, 1)));
}

function items() {
  const n = pages();
  const cur = props.current;
  const out: number[] = [];
  if (n <= 7) {
    for (let i = 1; i <= n; i++) out.push(i);
    return out;
  }
  const start = Math.max(1, Math.min(cur - 2, n - 4));
  const end = Math.min(n, start + 4);
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}
</script>

<template>
  <div class="ag-pagination">
    <span v-if="showTotal">共 {{ total }} 条</span>
    <select
      v-if="showSizeChanger"
      class="ag-pagination__size"
      :value="pageSize"
      aria-label="每页条数"
      @change="emit('change', 1, Number(($event.target as HTMLSelectElement).value))"
    >
      <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }} 条/页</option>
    </select>
    <button
      type="button"
      class="ag-pagination__btn"
      :disabled="current <= 1"
      @click="emit('change', current - 1, pageSize)"
    >
      ‹
    </button>
    <button
      v-for="p in items()"
      :key="p"
      type="button"
      :class="['ag-pagination__btn', p === current ? 'is-active' : '']"
      @click="emit('change', p, pageSize)"
    >
      {{ p }}
    </button>
    <button
      type="button"
      class="ag-pagination__btn"
      :disabled="current >= pages()"
      @click="emit('change', current + 1, pageSize)"
    >
      ›
    </button>
  </div>
</template>
