<script lang="ts">
  import { getContext } from "svelte";
  import type { Snippet } from "svelte";

  let {
    panelKey,
    title,
    disabled = false,
    children,
  }: {
    panelKey: string;
    title?: string;
    disabled?: boolean;
    children?: Snippet;
  } = $props();

  const ctx = getContext<{
    toggle: (key: string) => void;
    isActive: (key: string) => boolean;
  }>("agCollapse");

  const open = $derived(ctx?.isActive(panelKey) ?? false);
</script>

<div class="ag-collapse__panel">
  <button
    type="button"
    class="ag-collapse__header"
    {disabled}
    onclick={() => !disabled && ctx?.toggle(panelKey)}
  >
    {title}
    <span class={"ag-collapse__arrow" + (open ? " is-open" : "")}>›</span>
  </button>
  {#if open}<div class="ag-collapse__body">{@render children?.()}</div>{/if}
</div>
