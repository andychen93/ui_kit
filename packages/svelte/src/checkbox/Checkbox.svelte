<script lang="ts">
  import type { Snippet } from "svelte";
  import Glyph from "../glyph/Glyph.svelte";

  let {
    checked = $bindable(false),
    disabled = false,
    children,
  }: {
    checked?: boolean;
    disabled?: boolean;
    children?: Snippet;
  } = $props();
</script>

<label class={["ag-check", disabled ? "is-disabled" : ""].filter(Boolean).join(" ")}>
  <input class="ag-check__input" type="checkbox" {disabled} bind:checked />
  <span class="ag-checkbox__box">
    {#if checked}<Glyph name="check" />{/if}
  </span>
  {#if children}<span>{@render children()}</span>{/if}
</label>
