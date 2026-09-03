<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    spinning = true,
    size = "md",
    text = "",
    children,
  }: {
    spinning?: boolean;
    size?: "sm" | "md" | "lg";
    text?: string;
    children?: Snippet;
  } = $props();

  const sizeClass = $derived(size !== "md" ? ` ag-spin--${size}` : "");
</script>

{#if children}
  <div class={"ag-spin ag-spin--wrap" + sizeClass}>
    {@render children()}
    {#if spinning}
      <div class="ag-spin__mask">
        <span class="ag-spin__spinner"></span>
        {#if text}<span class="ag-spin__text">{text}</span>{/if}
      </div>
    {/if}
  </div>
{:else}
  <div class={"ag-spin" + sizeClass}>
    <span class="ag-spin__spinner"></span>
    {#if text}<span class="ag-spin__text">{text}</span>{/if}
  </div>
{/if}
