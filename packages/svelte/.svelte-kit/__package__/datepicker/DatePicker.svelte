<script lang="ts">
  import { onMount } from "svelte";
  import { WEEKDAYS, addMonths, formatYMD, monthGrid, ymd } from "@argon-kit/core";
  import Glyph from "../glyph/Glyph.svelte";

  let {
    value = $bindable<string | null>(null),
    placeholder = "选择日期",
    disabled = false,
    allowClear = false,
    status,
  }: {
    value?: string | null;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    status?: "error" | "success";
  } = $props();

  let open = $state(false);
  let root: HTMLDivElement | undefined;
  const today = formatYMD(new Date());
  const seed = value ? new Date(value + "T00:00:00") : new Date();
  let cursor = $state({ year: seed.getFullYear(), month: seed.getMonth() });
  const cells = $derived(monthGrid(cursor.year, cursor.month));

  onMount(() => {
    const onDoc = (e: MouseEvent) => {
      if (!root?.contains(e.target as Node)) open = false;
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  });
</script>

<div class="ag-field" bind:this={root}>
  <div class="ag-datepicker">
    <div
      role="combobox"
      aria-expanded={open}
      class={["ag-input-wrap", "ag-select__trigger", disabled ? "is-disabled" : "", status ? `is-${status}` : ""]
        .filter(Boolean)
        .join(" ")}
      onclick={() => !disabled && (open = !open)}
    >
      <span class={["ag-select__value", value ? "" : "is-placeholder"].filter(Boolean).join(" ")}>
        {value ?? placeholder}
      </span>
      {#if allowClear && value}
        <button
          type="button"
          class="ag-input__addon-btn"
          aria-label="清除"
          onclick={(e) => {
            e.stopPropagation();
            value = null;
          }}
        >
          <Glyph name="x" />
        </button>
      {:else}
        <Glyph name="chevronDown" />
      {/if}
    </div>
    {#if open}
      <div class="ag-calendar">
        <div class="ag-calendar__head">
          <button
            type="button"
            class="ag-calendar__nav"
            aria-label="上一月"
            onclick={() => (cursor = addMonths(cursor.year, cursor.month, -1))}
          >
            <Glyph name="chevronLeft" />
          </button>
          <span>{cursor.year} 年 {cursor.month + 1} 月</span>
          <button
            type="button"
            class="ag-calendar__nav"
            aria-label="下一月"
            onclick={() => (cursor = addMonths(cursor.year, cursor.month, 1))}
          >
            <Glyph name="chevronRight" />
          </button>
        </div>
        <div class="ag-calendar__week">
          {#each WEEKDAYS as w}
            <span>{w}</span>
          {/each}
        </div>
        <div class="ag-calendar__grid">
          {#each cells as day, i}
            <button
              type="button"
              class={[
                "ag-calendar__day",
                day && ymd(cursor.year, cursor.month, day) === today ? "is-today" : "",
                day && ymd(cursor.year, cursor.month, day) === value ? "is-selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={!day}
              onclick={() => {
                if (!day) return;
                value = ymd(cursor.year, cursor.month, day);
                open = false;
              }}
            >
              {day}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
