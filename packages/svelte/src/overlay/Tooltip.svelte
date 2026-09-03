<script lang="ts">
  let { title, children }: { title: string; children?: import("svelte").Snippet } = $props();
  let show = $state(false);
</script>

<span class="ag-overlay-root" onmouseenter={() => (show = true)} onmouseleave={() => (show = false)}>
  {@render children?.()}
  {#if show}<span class="ag-tooltip" role="tooltip">{title}</span>{/if}
</span>
