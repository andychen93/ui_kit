<script lang="ts">
  import type { BreadcrumbItem } from "@argon-kit/core";

  let {
    items,
    onnavigate,
  }: {
    items: BreadcrumbItem[];
    onnavigate?: (item: BreadcrumbItem, index: number) => void;
  } = $props();
</script>

<nav class="ag-breadcrumb" aria-label="面包屑">
  {#each items as item, i (`${item.label}-${i}`)}
    <span style="display: inline-flex; align-items: center; gap: 8px">
      {#if i > 0}<span class="ag-breadcrumb__sep">/</span>{/if}
      {#if i < items.length - 1}
        <button type="button" onclick={() => onnavigate?.(item, i)}>{item.label}</button>
      {:else}
        <span>{item.label}</span>
      {/if}
    </span>
  {/each}
</nav>
