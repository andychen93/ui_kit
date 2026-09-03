<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import Button from "../button/Button.svelte";
  import Glyph from "../glyph/Glyph.svelte";

  let {
    open = false,
    title,
    width = 520,
    confirmLoading = false,
    hideFooter = false,
    onclose,
    onconfirm,
    children,
    footer,
  }: {
    open?: boolean;
    title?: string;
    /** 弹窗宽度 px */
    width?: number;
    /** 确认按钮 loading（防重复提交） */
    confirmLoading?: boolean;
    /** 隐藏底部（纯展示弹窗） */
    hideFooter?: boolean;
    onclose?: () => void;
    onconfirm?: () => void;
    children?: Snippet;
    footer?: Snippet;
  } = $props();

  onMount(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onclose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }
</script>

{#if open}
  <div class="ag-mask" use:portal onclick={onclose} role="presentation">
    <div
      class="ag-modal"
      style="width:min({width}px, 100%)"
      role="dialog"
      aria-modal="true"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="ag-modal__header">
        <h3 class="ag-modal__title">{title}</h3>
        <button type="button" class="ag-modal__close" aria-label="关闭" onclick={onclose}>
          <Glyph name="x" />
        </button>
      </div>
      <div class="ag-modal__body">{@render children?.()}</div>
      {#if !hideFooter}
        <div class="ag-modal__footer">
          {#if footer}
            {@render footer()}
          {:else}
            <Button variant="neutral" onclick={onclose}>取消</Button>
            <Button loading={confirmLoading} onclick={() => onconfirm?.()}>确定</Button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
