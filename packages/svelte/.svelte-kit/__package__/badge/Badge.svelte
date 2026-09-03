<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    variant = "default",
    pill = false,
    size = "sm",
    circle = false,
    children,
  }: {
    variant?: "default" | "primary" | "info" | "success" | "warning" | "danger";
    pill?: boolean;
    size?: "sm" | "md" | "lg";
    circle?: boolean;
    children?: Snippet;
  } = $props();

  const className = $derived(
    [
      "ag-badge",
      variant !== "default" ? `ag-badge--${variant}` : "",
      circle ? "ag-badge--circle" : "",
      size !== "sm" ? `ag-badge--${size}` : "",
      pill ? "ag-badge--pill" : "",
    ]
      .filter(Boolean)
      .join(" "),
  );
</script>

<span class={className}>{@render children?.()}</span>
