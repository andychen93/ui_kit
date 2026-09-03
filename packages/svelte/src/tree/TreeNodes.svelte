<script lang="ts">
  import type { TreeNode } from "@argon-kit/core";
  import Glyph from "../glyph/Glyph.svelte";
  import TreeNodes from "./TreeNodes.svelte";

  let {
    nodes,
    expanded,
    selected,
    ontoggle,
    onselect,
  }: {
    nodes: TreeNode[];
    expanded: Set<string>;
    selected: string | number | null;
    ontoggle?: (id: string | number) => void;
    onselect?: (node: TreeNode) => void;
  } = $props();
</script>

<ul class="ag-tree">
  {#each nodes as n (n.id)}
    <li>
      <div
        class={[
          "ag-tree__node",
          n.id === selected ? "is-active" : "",
          n.disabled ? "is-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onclick={() => !n.disabled && onselect?.(n)}
      >
        {#if n.children?.length}
          <button
            type="button"
            class={["ag-tree__twist", expanded.has(String(n.id)) ? "is-open" : ""].filter(Boolean).join(" ")}
            aria-label={expanded.has(String(n.id)) ? "收起" : "展开"}
            onclick={(e) => {
              e.stopPropagation();
              ontoggle?.(n.id);
            }}
          >
            <Glyph name="chevronRight" />
          </button>
        {:else}
          <span class="ag-tree__leaf"></span>
        {/if}
        {n.label}
      </div>
      {#if n.children?.length && expanded.has(String(n.id))}
        <TreeNodes nodes={n.children} {expanded} {selected} {ontoggle} {onselect} />
      {/if}
    </li>
  {/each}
</ul>
