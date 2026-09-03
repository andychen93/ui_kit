<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ColumnDef, PageQuery, PageResult, QueryField } from "@argon-kit/core";
  import Pagination from "../table/Pagination.svelte";
  import Table from "../table/Table.svelte";
  import QueryForm from "./QueryForm.svelte";

  let {
    service,
    columns,
    rowKey,
    querySchema,
    pageSize = 10,
    toolbar,
    cell,
  }: {
    service: (params: PageQuery) => Promise<PageResult<Record<string, unknown>>>;
    columns: ColumnDef[];
    rowKey: string;
    querySchema?: QueryField[];
    pageSize?: number;
    toolbar?: Snippet;
    cell?: Snippet<
      [{ column: ColumnDef; record: Record<string, unknown>; value: unknown; index: number }]
    >;
  } = $props();

  let filters = $state<Record<string, unknown>>({});
  let page = $state(1);
  let size = $state(pageSize);
  let list = $state<Record<string, unknown>[]>([]);
  let total = $state(0);
  let loading = $state(false);

  $effect(() => {
    const p = page;
    const s = size;
    const f = filters;
    let cancelled = false;
    loading = true;
    service({ pageNum: p, pageSize: s, ...f })
      .then((res) => {
        if (cancelled) return;
        list = res.list;
        total = res.total;
      })
      .finally(() => {
        if (!cancelled) loading = false;
      });
    return () => {
      cancelled = true;
    };
  });

  function applyFilters(next: Record<string, unknown>) {
    filters = next;
    page = 1;
  }
</script>

{#if querySchema?.length}
  <QueryForm fields={querySchema} onsearch={applyFilters} />
{/if}
<div class="ag-card">
  {#if toolbar}
    <div class="ag-toolbar">{@render toolbar()}</div>
  {/if}
  <Table {columns} data={list} {rowKey} {loading} {cell} />
  <Pagination
    current={page}
    pageSize={size}
    {total}
    showSizeChanger
    onchange={(p, ps) => {
      page = p;
      size = ps;
    }}
  />
</div>
