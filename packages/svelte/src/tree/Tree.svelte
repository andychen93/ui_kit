<script lang="ts">
  import type { TreeNode } from "@argon-kit/core";
  import TreeNodes from "./TreeNodes.svelte";

  let {
    data,
    value = $bindable<string | number | null>(null),
    onchange,
  }: {
    data: TreeNode[];
    value?: string | number | null;
    onchange?: (id: string | number, node: TreeNode) => void;
  } = $props();

  let expanded = $state(new Set<string>());

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
  }
</script>

<div class="ag-tree-panel">
  <TreeNodes nodes={data} {expanded} selected={value} ontoggle={toggle} onselect={pick} />
</div>
