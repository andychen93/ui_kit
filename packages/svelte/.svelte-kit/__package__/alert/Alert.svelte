<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    variant = "default",
    dismissible = false,
    icon,
    children,
    onclose,
  }: {
    variant?: "default" | "primary" | "info" | "success" | "warning" | "danger";
    dismissible?: boolean;
    icon?: Snippet;
    children?: Snippet;
    onclose?: () => void;
  } = $props();

  let visible = $state(true);
  const className = $derived(
    variant === "default" ? "ag-alert" : `ag-alert ag-alert--${variant}`,
  );

  function close() {
    visible = false;
    onclose?.();
  }
</script>

{#if visible}
  <div class={className} role="alert">
    {#if icon}<span class="ag-alert__icon">{@render icon()}</span>{/if}
    <div class="ag-alert__content">{@render children?.()}</div>
    {#if dismissible}
      <button type="button" class="ag-alert__close" aria-label="close" onclick={close}>×</button>
    {/if}
  </div>
{/if}
