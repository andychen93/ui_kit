<script lang="ts">
  import { onMount } from "svelte";
  import type { ColumnDef, PageQuery, PageResult } from "@argon-kit/core";
  import Glyph from "../glyph/Glyph.svelte";
  import Input from "../input/Input.svelte";
  import Pagination from "../table/Pagination.svelte";
  import Table from "../table/Table.svelte";

  const SEARCH_DEBOUNCE_MS = 300;

  let {
    value = $bindable<Record<string, unknown> | null>(null),
    service,
    columns,
    rowKey,
    labelField,
    placeholder = "请选择",
    searchField,
    pageSize = 5,
    popoverWidth = 480,
    allowClear = false,
    cacheKey: _cacheKey,
  }: {
    value?: Record<string, unknown> | null;
    service: (params: PageQuery) => Promise<PageResult<Record<string, unknown>>>;
    columns: ColumnDef[];
    rowKey: string;
    labelField: string;
    placeholder?: string;
    searchField?: string;
    pageSize?: number;
    popoverWidth?: number;
    allowClear?: boolean;
    cacheKey?: string;
  } = $props();

  let open = $state(false);
  let text = $state("");
  let keyword = $state("");
  let page = $state(1);
  let size = $state(pageSize);
  let list = $state<Record<string, unknown>[]>([]);
  let total = $state(0);
  let loading = $state(false);
  let root: HTMLDivElement | undefined;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const selectedLabel = $derived(value ? String(value[labelField] ?? "") : "");
  const activeKey = $derived(value ? String(value[rowKey]) : undefined);

  $effect(() => {
    text = selectedLabel;
  });

  $effect(() => {
    const t = text;
    if (t === selectedLabel) return;
    scheduleSearch(t);
    open = true;
  });

  $effect(() => {
    keyword;
    page = 1;
  });

  $effect(() => {
    if (!open) return;
    const p = page;
    const s = size;
    const kw = keyword;
    let cancelled = false;
    loading = true;
    service({
      pageNum: p,
      pageSize: s,
      ...(searchField ? { [searchField]: kw } : {}),
    })
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

  function cancelSearch() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function scheduleSearch(kw: string) {
    cancelSearch();
    timer = setTimeout(() => {
      keyword = kw;
    }, SEARCH_DEBOUNCE_MS);
  }

  function onFocusIn() {
    if (!open) {
      keyword = "";
      page = 1;
    }
    open = true;
  }

  function handleSelect(record: Record<string, unknown>) {
    cancelSearch();
    value = record;
    text = String(record[labelField] ?? "");
    open = false;
    keyword = "";
  }

  function clear() {
    cancelSearch();
    value = null;
    text = "";
    keyword = "";
    open = false;
  }

  onMount(() => {
    const onDoc = (e: MouseEvent) => {
      if (root?.contains(e.target as Node)) return;
      cancelSearch();
      open = false;
      keyword = "";
      text = selectedLabel;
    };
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      cancelSearch();
    };
  });
</script>

<div class="ag-page-select" bind:this={root} onfocusin={onFocusIn}>
  <Input bind:value={text} {placeholder}>
    {#snippet suffix()}
      {#if allowClear && text}
        <button type="button" class="ag-input__addon-btn" aria-label="清除" onclick={(e) => { e.stopPropagation(); clear(); }}>
          <Glyph name="x" />
        </button>
      {:else}
        <Glyph name="search" />
      {/if}
    {/snippet}
  </Input>
  {#if open}
    <div class="ag-page-select__panel" style="width:{popoverWidth}px">
      <Table
        {columns}
        data={list}
        {rowKey}
        {loading}
        clickable
        {activeKey}
        onrowclick={handleSelect}
      />
      <Pagination current={page} pageSize={size} {total} onchange={(p, ps) => { page = p; size = ps; }} />
    </div>
  {/if}
</div>
