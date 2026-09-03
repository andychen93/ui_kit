<script lang="ts">
  import type { Snippet } from "svelte";
  import type { TabItem } from "@argon-kit/core";

  let {
    items,
    active,
    onchange,
    center = false,
    children,
  }: {
    items: TabItem[];
    active: string;
    onchange?: (key: string) => void;
    center?: boolean;
    children?: Snippet;
  } = $props();
</script>

<div class="ag-tabs">
  <div class={["ag-tabs__nav", center ? "is-center" : ""].filter(Boolean).join(" ")} role="tablist">
    {#each items as it}
      <button
        type="button"
        role="tab"
        aria-selected={it.key === active}
        disabled={it.disabled}
        class={["ag-tabs__tab", it.key === active ? "is-active" : ""].filter(Boolean).join(" ")}
        onclick={() => onchange?.(it.key)}
      >
        {it.label}
      </button>
    {/each}
  </div>
  {#if children}
    <div class="ag-tabs__panel">{@render children()}</div>
  {/if}
</div>
