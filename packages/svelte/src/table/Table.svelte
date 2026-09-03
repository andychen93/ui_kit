<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ColumnDef } from "@argon-kit/core";

  export interface SortableColumn extends ColumnDef {
    sorter?: (
      a: Record<string, unknown>,
      b: Record<string, unknown>,
    ) => number;
  }

  let {
    columns,
    data,
    rowKey,
    loading = false,
    striped = false,
    clickable = false,
    activeKey,
    scrollX,
    onrowclick,
    cell,
  }: {
    columns: SortableColumn[];
    data: Record<string, unknown>[];
    rowKey: string;
    loading?: boolean;
    striped?: boolean;
    clickable?: boolean;
    activeKey?: string | number;
    scrollX?: number;
    onrowclick?: (record: Record<string, unknown>) => void;
    cell?: Snippet<
      [{ column: ColumnDef; record: Record<string, unknown>; value: unknown; index: number }]
    >;
  } = $props();

  let sortKey = $state<string | null>(null);
  let sortAsc = $state(true);

  function toggleSort(col: SortableColumn) {
    if (!col.sorter) return;
    if (sortKey === col.key) {
      if (sortAsc) sortAsc = false;
      else {
        sortKey = null;
        sortAsc = true;
      }
    } else {
      sortKey = col.key;
      sortAsc = true;
    }
  }

  const sortedData = $derived.by(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sorter) return data;
    const arr = [...data];
    arr.sort(col.sorter);
    return sortAsc ? arr : arr.reverse();
  });

  const sticky = $derived.by(() => {
    const left = new Map<string, number>();
    const right = new Map<string, number>();
    let acc = 0;
    for (const c of columns) {
      if (c.fixed === "left") {
        left.set(c.key, acc);
        acc += Number(c.width ?? 160);
      }
    }
    acc = 0;
    for (let i = columns.length - 1; i >= 0; i--) {
      const c = columns[i];
      if (c.fixed === "right") {
        right.set(c.key, acc);
        acc += Number(c.width ?? 160);
      }
    }
    return { left, right };
  });

  function cellStyle(c: SortableColumn): string {
    const parts: string[] = [];
    if (c.width) parts.push(`width:${typeof c.width === "number" ? c.width + "px" : c.width}`);
    if (c.fixed === "left") parts.push(`left:${sticky.left.get(c.key) ?? 0}px`);
    if (c.fixed === "right") parts.push(`right:${sticky.right.get(c.key) ?? 0}px`);
    if (c.align) parts.push(`text-align:${c.align}`);
    return parts.join(";");
  }

  function rowId(record: Record<string, unknown>) {
    return String(record[rowKey]);
  }

  function cellValue(record: Record<string, unknown>, dataIndex?: string) {
    if (!dataIndex) return "";
    const v = record[dataIndex];
    return v == null ? "" : String(v);
  }
</script>

<div class={["ag-table-wrap", loading ? "is-loading" : ""].filter(Boolean).join(" ")}>
  <div class="ag-table-scroll" style={scrollX ? `min-width:${scrollX}px` : undefined}>
    <table class={["ag-table", striped ? "ag-table--striped" : ""].filter(Boolean).join(" ")}>
      <thead>
        <tr>
          {#each columns as c (c.key)}
            <th
              class={[
                c.fixed ? `ag-table__cell--fixed ag-table__cell--fixed-${c.fixed}` : "",
                c.sorter ? "ag-table__th-sorter" : "",
                sortKey === c.key ? "is-sorted" : "",
                c.align ? `is-align-${c.align}` : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={cellStyle(c)}
              aria-sort={sortKey === c.key ? (sortAsc ? "ascending" : "descending") : undefined}
              onclick={() => toggleSort(c)}
            >
              <span class={c.ellipsis ? "ag-table__ellipsis" : ""}>{c.title}</span>
              {#if c.sorter}
                <span class="ag-table__sorter">
                  {sortKey === c.key ? (sortAsc ? "↑" : "↓") : "⇅"}
                </span>
              {/if}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if sortedData.length === 0}
          <tr>
            <td class="ag-table__empty" colspan={columns.length}>
              {loading ? "加载中…" : "暂无数据"}
            </td>
          </tr>
        {:else}
          {#each sortedData as record, index (rowId(record))}
            <tr
              class={[
                clickable ? "is-clickable" : "",
                activeKey != null && String(activeKey) === rowId(record) ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onclick={() => onrowclick?.(record)}
            >
              {#each columns as c (c.key)}
                <td
                  class={[
                    c.fixed ? `ag-table__cell--fixed ag-table__cell--fixed-${c.fixed}` : "",
                    c.align ? `is-align-${c.align}` : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={cellStyle(c)}
                >
                  {#if cell}
                    {@render cell({
                      column: c,
                      record,
                      value: c.dataIndex ? record[c.dataIndex] : undefined,
                      index,
                    })}
                  {:else}
                    <span class={c.ellipsis ? "ag-table__ellipsis" : ""}>
                      {cellValue(record, c.dataIndex)}
                    </span>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
