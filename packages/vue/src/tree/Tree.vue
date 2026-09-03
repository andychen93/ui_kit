<script setup lang="ts">
import { ref } from "vue";
import type { TreeNode } from "@argon-kit/core";
import TreeNodes from "./TreeNodes.vue";

const model = defineModel<string | number | null>({ default: null });
defineProps<{ data: TreeNode[] }>();
const emit = defineEmits<{ change: [id: string | number, node: TreeNode] }>();
const expanded = ref(new Set<string>());

function toggle(id: string | number) {
  const key = String(id);
  const next = new Set(expanded.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  expanded.value = next;
}

function pick(node: TreeNode) {
  model.value = node.id;
  emit("change", node.id, node);
}
</script>

<template>
  <div class="ag-tree-panel">
    <TreeNodes
      :nodes="data"
      :expanded="expanded"
      :selected="model"
      @toggle="toggle"
      @select="pick"
    />
  </div>
</template>
