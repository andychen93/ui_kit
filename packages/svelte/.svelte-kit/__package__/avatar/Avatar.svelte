<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    src,
    alt = "",
    size = "md",
    square = false,
    children,
  }: {
    src?: string;
    alt?: string;
    size?: "sm" | "md" | "lg";
    square?: boolean;
    children?: Snippet;
  } = $props();

  const className = $derived(
    [
      "ag-avatar",
      size !== "md" ? `ag-avatar--${size}` : "",
      square ? "ag-avatar--square" : "",
    ]
      .filter(Boolean)
      .join(" "),
  );
</script>

<span class={className}>
  {#if src}<img {src} {alt} />{:else}{@render children?.()}{/if}
</span>
