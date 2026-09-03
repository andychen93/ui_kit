<script setup lang="ts">
import type { TreeNode } from "@argon-kit/core";
import Glyph from "../glyph/Glyph.vue";
import TreeNodes from "./TreeNodes.vue";

defineProps<{
  nodes: TreeNode[];
  expanded: Set<string>;
  selected: string | number | null;
}>();

const emit = defineEmits<{
  toggle: [id: string | number];
  select: [node: TreeNode];
}>();
</script>

<template>
  <ul class="ag-tree">
    <li v-for="n in nodes" :key="String(n.id)">
      <div
        :class="['ag-tree__node', n.id === selected ? 'is-active' : '', n.disabled ? 'is-disabled' : '']"
        @click="!n.disabled && emit('select', n)"
      >
        <button
          v-if="n.children?.length"
          type="button"
          :class="['ag-tree__twist', expanded.has(String(n.id)) ? 'is-open' : '']"
          :aria-label="expanded.has(String(n.id)) ? '收起' : '展开'"
          @click.stop="emit('toggle', n.id)"
        >
          <Glyph name="chevronRight" />
        </button>
        <span v-else class="ag-tree__leaf" />
        {{ n.label }}
      </div>
      <TreeNodes
        v-if="n.children?.length && expanded.has(String(n.id))"
        :nodes="n.children"
        :expanded="expanded"
        :selected="selected"
        @toggle="emit('toggle', $event)"
        @select="emit('select', $event)"
      />
    </li>
  </ul>
</template>
