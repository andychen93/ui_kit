<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "../button/Button.svelte";

  let {
    title = "确认操作？",
    onconfirm,
    children,
  }: {
    title?: string;
    onconfirm?: () => void;
    children?: Snippet;
  } = $props();

  let open = $state(false);
</script>

<div class="ag-overlay-root">
  <span onclick={() => (open = !open)}>{@render children?.()}</span>
  {#if open}
    <div class="ag-popconfirm">
      <p class="ag-popconfirm__title">{title}</p>
      <div class="ag-popconfirm__actions">
        <Button size="sm" variant="neutral" onclick={() => (open = false)}>取消</Button>
        <Button
          size="sm"
          variant="danger"
          onclick={() => {
            onconfirm?.();
            open = false;
          }}
        >
          确定
        </Button>
      </div>
    </div>
  {/if}
</div>
