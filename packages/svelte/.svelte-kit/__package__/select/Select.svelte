<script lang="ts">
  import { onMount } from "svelte";
  import Glyph from "../glyph/Glyph.svelte";
  import type { FieldStatus } from "../input/types";

  export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
  }

  let {
    value = $bindable<string | number | null>(null),
    options,
    placeholder = "请选择",
    disabled = false,
    allowClear = false,
    status,
    hint,
  }: {
    value?: string | number | null;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    status?: FieldStatus;
    hint?: string;
  } = $props();

  let open = $state(false);
  let root: HTMLDivElement | undefined;
  const selected = $derived(options.find((o) => o.value === value));

  onMount(() => {
    const onDoc = (e: MouseEvent) => {
      if (!root?.contains(e.target as Node)) open = false;
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  });
</script>

<div class="ag-field" bind:this={root}>
  <div class="ag-select">
    <div
      role="combobox"
      aria-expanded={open}
      tabindex={disabled ? -1 : 0}
      class={[
        "ag-input-wrap",
        "ag-select__trigger",
        status ? `is-${status}` : "",
        disabled ? "is-disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onclick={() => !disabled && (open = !open)}
    >
      <span class={["ag-select__value", selected ? "" : "is-placeholder"].filter(Boolean).join(" ")}>
        {selected?.label ?? placeholder}
      </span>
      {#if allowClear && selected}
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
      <ul class="ag-select__dropdown" role="listbox">
        {#each options as opt}
          <li
            role="option"
            aria-selected={opt.value === value}
            class={[
              "ag-select__option",
              opt.value === value ? "is-active" : "",
              opt.disabled ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onclick={() => {
              if (opt.disabled) return;
              value = opt.value;
              open = false;
            }}
          >
            {opt.label}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  {#if hint}
    <p class={["ag-field__hint", status ? `is-${status}` : ""].filter(Boolean).join(" ")}>
      {hint}
    </p>
  {/if}
</div>
