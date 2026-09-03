<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";

  export interface DropdownItem {
    key: string;
    label: string;
    danger?: boolean;
    disabled?: boolean;
  }

  let {
    items,
    children,
    onselect,
  }: {
    items: DropdownItem[];
    children?: Snippet;
    onselect?: (key: string) => void;
  } = $props();

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
    <div class="ag-dropdown" role="menu">
      {#each items as it}
        <button
          type="button"
          role="menuitem"
          disabled={it.disabled}
          class={["ag-dropdown__item", it.danger ? "is-danger" : ""].filter(Boolean).join(" ")}
          onclick={() => {
            if (it.disabled) return;
            onselect?.(it.key);
            open = false;
          }}
        >
          {it.label}
        </button>
      {/each}
    </div>
  {/if}
</div>
