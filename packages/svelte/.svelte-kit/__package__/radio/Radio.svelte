<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    checked = false,
    disabled = false,
    name,
    children,
    onchange,
  }: {
    checked?: boolean;
    disabled?: boolean;
    name?: string;
    children?: Snippet;
    onchange?: () => void;
  } = $props();
</script>

<label class={["ag-check", disabled ? "is-disabled" : ""].filter(Boolean).join(" ")}>
  <input
    class="ag-check__input"
    type="radio"
    {name}
    {checked}
    {disabled}
    onchange={() => onchange?.()}
  />
  <span class="ag-radio__dot"></span>
  {#if children}<span>{@render children()}</span>{/if}
</label>
