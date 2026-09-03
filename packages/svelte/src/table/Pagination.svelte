<script lang="ts">
  let {
    current,
    pageSize,
    total,
    showTotal = true,
    showSizeChanger = false,
    pageSizeOptions = [10, 20, 50],
    onchange,
  }: {
    current: number;
    pageSize: number;
    total: number;
    showTotal?: boolean;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    onchange?: (page: number, pageSize: number) => void;
  } = $props();

  const pages = $derived(Math.max(1, Math.ceil(total / Math.max(pageSize, 1))));
  const items = $derived.by(() => {
    const n = pages;
    const out: number[] = [];
    if (n <= 7) {
      for (let i = 1; i <= n; i++) out.push(i);
      return out;
    }
    const start = Math.max(1, Math.min(current - 2, n - 4));
    const end = Math.min(n, start + 4);
    for (let i = start; i <= end; i++) out.push(i);
    return out;
  });
</script>

<div class="ag-pagination">
  {#if showTotal}<span>共 {total} 条</span>{/if}
  {#if showSizeChanger}
    <select
      class="ag-pagination__size"
      value={pageSize}
      aria-label="每页条数"
      onchange={(e) => onchange?.(1, Number((e.currentTarget as HTMLSelectElement).value))}
    >
      {#each pageSizeOptions as n}
        <option value={n}>{n} 条/页</option>
      {/each}
    </select>
  {/if}
  <button
    type="button"
    class="ag-pagination__btn"
    disabled={current <= 1}
    onclick={() => onchange?.(current - 1, pageSize)}
  >
    ‹
  </button>
  {#each items as p}
    <button
      type="button"
      class={["ag-pagination__btn", p === current ? "is-active" : ""].filter(Boolean).join(" ")}
      onclick={() => onchange?.(p, pageSize)}
    >
      {p}
    </button>
  {/each}
  <button
    type="button"
    class="ag-pagination__btn"
    disabled={current >= pages}
    onclick={() => onchange?.(current + 1, pageSize)}
  >
    ›
  </button>
</div>
