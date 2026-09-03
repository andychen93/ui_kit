<script lang="ts">
  import type { Snippet } from "svelte";
  import Spin from "../spin/Spin.svelte";

  let {
    items = [],
    loading = false,
    bordered = false,
    header,
    footer,
    renderItem,
  }: {
    items?: Array<{ key?: string; title?: string; description?: string }>;
    loading?: boolean;
    bordered?: boolean;
    header?: Snippet;
    footer?: Snippet;
    renderItem?: Snippet<[{ key?: string; title?: string; description?: string }, number]>;
  } = $props();
</script>

<div class={"ag-list"
  + (bordered ? " ag-list--bordered" : "")
  + (loading ? " ag-list--loading" : "")}>
  {#if header}<div class="ag-list__header">{@render header()}</div>{/if}
  {#if loading}
    <div class="ag-list__spin"><Spin /></div>
  {:else}
    <ul class="ag-list__items">
      {#each items as item, i (item.key ?? i)}
        <li class="ag-list__item">
          {#if renderItem}
            {@render renderItem(item, i)}
          {:else}
            <span>{item.title}</span>
            {#if item.description}
              <span style="margin-left:auto;color:var(--ag-gray-500);font-size:13px">{item.description}</span>
            {/if}
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
  {#if footer}<div class="ag-list__footer">{@render footer()}</div>{/if}
</div>
