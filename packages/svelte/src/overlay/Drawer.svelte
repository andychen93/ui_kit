<script lang="ts">
  import type { Snippet } from "svelte";
  import Glyph from "../glyph/Glyph.svelte";

  let {
    open = false,
    title,
    onclose,
    children,
  }: {
    open?: boolean;
    title?: string;
    onclose?: () => void;
    children?: Snippet;
  } = $props();

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy() { node.remove(); } };
  }
</script>

{#if open}
  <div class="ag-drawer-mask" use:portal onclick={onclose}></div>
  <aside class="ag-drawer" use:portal role="dialog" aria-modal="true">
    <div class="ag-drawer__header">
      <h3 class="ag-drawer__title">{title}</h3>
      <button type="button" class="ag-drawer__close" aria-label="关闭" onclick={onclose}>
        <Glyph name="x" />
      </button>
    </div>
    <div class="ag-drawer__body">{@render children?.()}</div>
  </aside>
{/if}
