<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import type { TreeNode } from "@argon-kit/core";
import Glyph from "../glyph/Glyph.vue";
import TreeNodes from "./TreeNodes.vue";

const model = defineModel<string | number | null>({ default: null });
const props = withDefaults(
  defineProps<{
    data: TreeNode[];
    placeholder?: string;
    allowClear?: boolean;
    status?: "error" | "success";
  }>(),
  { placeholder: "请选择", allowClear: false },
);

const emit = defineEmits<{
  change: [id: string | number | null, node: TreeNode | null];
}>();

const open = ref(false);
const expanded = ref(new Set<string>());
const root = ref<HTMLElement | null>(null);

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
  open.value = false;
}

function clear() {
  model.value = null;
  emit("change", null, null);
}

const onDoc = (e: MouseEvent) => {
  if (!root.value?.contains(e.target as Node)) open.value = false;
};
onMounted(() => document.addEventListener("mousedown", onDoc));
onUnmounted(() => document.removeEventListener("mousedown", onDoc));
</script>

<template>
  <div ref="root" class="ag-field">
    <div class="ag-select">
      <div
        role="combobox"
        :aria-expanded="open"
        :class="['ag-input-wrap', 'ag-select__trigger', status ? `is-${status}` : '']"
        @click="open = !open"
      >
        <span :class="['ag-select__value', findLabel(data, model) ? '' : 'is-placeholder']">
          {{ findLabel(data, model) || placeholder }}
        </span>
        <button
          v-if="allowClear && model != null"
          type="button"
          class="ag-input__addon-btn"
          aria-label="清除"
          @click.stop="clear"
        >
          <Glyph name="x" />
        </button>
        <Glyph v-else name="chevronDown" />
      </div>
      <div v-if="open" class="ag-select__dropdown" style="padding: 8px; max-height: 280px; overflow: auto">
        <TreeNodes
          :nodes="data"
          :expanded="expanded"
          :selected="model"
          @toggle="toggle"
          @select="pick"
        />
      </div>
    </div>
  </div>
</template>
