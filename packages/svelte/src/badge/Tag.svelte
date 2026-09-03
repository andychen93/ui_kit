<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    variant = "default",
    dot = true,
    closable = false,
    children,
    onclose,
  }: {
    variant?: "default" | "primary" | "info" | "success" | "warning" | "danger";
    dot?: boolean;
    closable?: boolean;
    children?: Snippet;
    onclose?: (e: MouseEvent) => void;
  } = $props();

  const className = $derived(
    variant === "default" ? "ag-tag" : `ag-tag ag-tag--${variant}`,
  );
</script>

<span class={className}>
  {#if dot}<span class="ag-tag__dot"></span>{/if}
  {@render children?.()}
  {#if closable}
    <button
      type="button"
      class="ag-tag__close"
      aria-label="close"
      onclick={(e) => onclose?.(e)}
    >×</button>
  {/if}
</span>
