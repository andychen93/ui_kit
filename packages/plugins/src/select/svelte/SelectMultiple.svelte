<script lang="ts">
  import type { SelectMultipleProps } from "../../core/types";

  let {
    options,
    value = $bindable([]),
    placeholder = "请选择",
    disabled = false,
    onchange,
  }: SelectMultipleProps & { value?: string[] } = $props();

  function toggle(v: string) {
    if (disabled) return;
    value = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    onchange?.(value);
  }

  function remove(v: string) {
    if (disabled) return;
    value = value.filter((x) => x !== v);
    onchange?.(value);
  }
</script>

<div class="ag-multiselect">
  {#if value.length}
    <div class="ag-multiselect__chips">
      {#each value as v (v)}
        <span class="ag-multiselect__chip">
          {options.find((o) => o.value === v)?.label ?? v}
          <button type="button" aria-label="remove" onclick={() => remove(v)}>×</button>
        </span>
      {/each}
    </div>
  {:else}
    <div class="ag-multiselect__placeholder">{placeholder}</div>
  {/if}
  <ul class="ag-multiselect__list">
    {#each options as opt (opt.value)}
      <li
        class={(value.includes(opt.value) ? "is-selected" : "")
          + (opt.disabled ? " is-disabled" : "")}
      >
        <label>
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            disabled={opt.disabled || disabled}
            onchange={() => toggle(opt.value)}
          />
          {opt.label}
        </label>
      </li>
    {/each}
  </ul>
</div>
