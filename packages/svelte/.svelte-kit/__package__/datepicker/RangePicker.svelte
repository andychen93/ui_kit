<script lang="ts">
  import { onMount } from "svelte";
  import { WEEKDAYS, addMonths, compareYMD, monthGrid, ymd } from "@argon-kit/core";
  import Glyph from "../glyph/Glyph.svelte";

  let {
    value = $bindable<[string, string] | null>(null),
    placeholder = "开始日期 ~ 结束日期",
    disabled = false,
    status,
  }: {
    value?: [string, string] | null;
    placeholder?: string;
    disabled?: boolean;
    status?: "error" | "success";
  } = $props();

  let open = $state(false);
  let draft = $state<string | null>(null);
  let root: HTMLDivElement | undefined;
  let cursor = $state({ year: new Date().getFullYear(), month: new Date().getMonth() });
  const next = $derived(addMonths(cursor.year, cursor.month, 1));
  const cellsA = $derived(monthGrid(cursor.year, cursor.month));
  const cellsB = $derived(monthGrid(next.year, next.month));

  onMount(() => {
    const onDoc = (e: MouseEvent) => {
      if (!root?.contains(e.target as Node)) open = false;
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  });

  function pick(year: number, month: number, day: number) {
    const v = ymd(year, month, day);
    if (!draft) {
      draft = v;
      return;
    }
    const start = compareYMD(draft, v) <= 0 ? draft : v;
    const end = compareYMD(draft, v) <= 0 ? v : draft;
    value = [start, end];
    draft = null;
    open = false;
  }

  function cls(year: number, month: number, day: number | null) {
    if (!day) return "ag-calendar__day";
    const v = ymd(year, month, day);
    const start = draft ?? value?.[0];
    const end = draft ? null : value?.[1];
    return [
      "ag-calendar__day",
      v === start || v === end ? "is-selected" : "",
      start && end && compareYMD(v, start) >= 0 && compareYMD(v, end) <= 0 ? "is-in-range" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }
</script>

<div class="ag-field" bind:this={root}>
  <div class="ag-datepicker">
    <div
      role="combobox"
      class={["ag-input-wrap", "ag-select__trigger", disabled ? "is-disabled" : "", status ? `is-${status}` : ""].filter(Boolean).join(" ")}
      onclick={() => !disabled && (open = !open)}
    >
      <span class={["ag-select__value", value ? "" : "is-placeholder"].filter(Boolean).join(" ")}>
        {value ? `${value[0]} ~ ${value[1]}` : placeholder}
      </span>
      <Glyph name="chevronDown" />
    </div>
    {#if open}
      <div class="ag-calendar ag-calendar--range">
        <div class="ag-calendar__panel">
          <div class="ag-calendar__head">
            <button type="button" class="ag-calendar__nav" aria-label="上一月" onclick={() => (cursor = addMonths(cursor.year, cursor.month, -1))}>
              <Glyph name="chevronLeft" />
            </button>
            <span>{cursor.year} 年 {cursor.month + 1} 月</span>
            <span></span>
          </div>
          <div class="ag-calendar__week">{#each WEEKDAYS as w}<span>{w}</span>{/each}</div>
          <div class="ag-calendar__grid">
            {#each cellsA as day, i}
              <button type="button" class={cls(cursor.year, cursor.month, day)} disabled={!day} onclick={() => day && pick(cursor.year, cursor.month, day)}>{day}</button>
            {/each}
          </div>
        </div>
        <div class="ag-calendar__panel">
          <div class="ag-calendar__head">
            <span></span>
            <span>{next.year} 年 {next.month + 1} 月</span>
            <button type="button" class="ag-calendar__nav" aria-label="下一月" onclick={() => (cursor = addMonths(cursor.year, cursor.month, 1))}>
              <Glyph name="chevronRight" />
            </button>
          </div>
          <div class="ag-calendar__week">{#each WEEKDAYS as w}<span>{w}</span>{/each}</div>
          <div class="ag-calendar__grid">
            {#each cellsB as day}
              <button type="button" class={cls(next.year, next.month, day)} disabled={!day} onclick={() => day && pick(next.year, next.month, day)}>{day}</button>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
