<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";

  let { children, content }: { children?: Snippet; content?: Snippet } = $props();
  let open = $state(false);
  let root: HTMLDivElement | undefined;

  onMount(() => {
    const onDoc = (e: MouseEvent) => {
      if (!root?.contains(e.target as Node)) open = false;
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  });
</script>

<div class="ag-overlay-root" bind:this={root}>
  <span onclick={() => (open = !open)}>{@render children?.()}</span>
  {#if open}
    <div class="ag-popover">{@render content?.()}</div>
  {/if}
</div>
