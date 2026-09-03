<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    noBody = false,
    extra,
    footer,
    children,
  }: {
    title?: string;
    noBody?: boolean;
    extra?: Snippet;
    footer?: Snippet;
    children?: Snippet;
  } = $props();
</script>

<div class="ag-card">
  {#if title || extra}
    <div class="ag-card__header">
      <h3 class="ag-card__title">{title}</h3>
      {#if extra}<div class="ag-card__extra">{@render extra()}</div>{/if}
    </div>
  {/if}
  {#if noBody}
    {@render children?.()}
  {:else}
    <div class="ag-card__body">{@render children?.()}</div>
  {/if}
  {#if footer}<div class="ag-card__footer">{@render footer()}</div>{/if}
</div>
