<script lang="ts">
  import { onMount } from "svelte";
  import type { TreeNode } from "@argon-kit/core";
  import Glyph from "../glyph/Glyph.svelte";
  import TreeNodes from "./TreeNodes.svelte";

  let {
    value = $bindable<string | number | null>(null),
    data,
    placeholder = "请选择",
    allowClear = false,
    status,
    onchange,
  }: {
    value?: string | number | null;
    data: TreeNode[];
    placeholder?: string;
    allowClear?: boolean;
    status?: "error" | "success";
    onchange?: (id: string | number | null, node?: TreeNode | null) => void;
  } = $props();

  let open = $state(false);
  let expanded = $state(new Set<string>());
  let root: HTMLDivElement | undefined;

  function findLabel(nodes: TreeNode[], id: string | number | null): string {
    if (id == null) return "";
    for (const n of nodes) {
      if (n.id === id) return n.label;
      if (n.children) {
        const hit = findLabel(n.children, id);
        if (hit) return hit;
      }
    }
    return "";
  }

  const label = $derived(findLabel(data, value));

  function toggle(id: string | number) {
    const key = String(id);
    const next = new Set(expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    expanded = next;
  }

  function pick(node: TreeNode) {
    value = node.id;
    onchange?.(node.id, node);
    open = false;
  }

  onMount(() => {
    const onDoc = (e: MouseEvent) => {
      if (!root?.contains(e.target as Node)) open = false;
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  });
</script>

<div class="ag-field" bind:this={root}>
  <div class="ag-select">
    <div
      role="combobox"
      aria-expanded={open}
      class={["ag-input-wrap", "ag-select__trigger", status ? `is-${status}` : ""].filter(Boolean).join(" ")}
      onclick={() => (open = !open)}
    >
      <span class={["ag-select__value", label ? "" : "is-placeholder"].filter(Boolean).join(" ")}>
        {label || placeholder}
      </span>
      {#if allowClear && value != null}
        <button
          type="button"
          class="ag-input__addon-btn"
          aria-label="清除"
          onclick={(e) => {
            e.stopPropagation();
            value = null;
            onchange?.(null, null);
          }}
        >
          <Glyph name="x" />
        </button>
      {:else}
        <Glyph name="chevronDown" />
      {/if}
    </div>
    {#if open}
      <div class="ag-select__dropdown" style="padding: 8px; max-height: 280px; overflow: auto">
        <TreeNodes nodes={data} {expanded} selected={value} ontoggle={toggle} onselect={pick} />
      </div>
    {/if}
  </div>
</div>
