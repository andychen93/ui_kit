<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

export interface DropdownItem {
  key: string;
  label: string;
  danger?: boolean;
  disabled?: boolean;
}

const props = defineProps<{ items: DropdownItem[] }>();
const emit = defineEmits<{ select: [key: string] }>();
const open = ref(false);
const root = ref<HTMLElement | null>(null);
const onDoc = (e: MouseEvent) => {
  if (!root.value?.contains(e.target as Node)) open.value = false;
};
onMounted(() => document.addEventListener("mousedown", onDoc));
onUnmounted(() => document.removeEventListener("mousedown", onDoc));

function pick(it: DropdownItem) {
  if (it.disabled) return;
  emit("select", it.key);
  open.value = false;
}
</script>

<template>
  <div ref="root" class="ag-overlay-root">
    <span @click="open = !open"><slot /></span>
    <div v-if="open" class="ag-dropdown" role="menu">
      <button
        v-for="it in props.items"
        :key="it.key"
        type="button"
        role="menuitem"
        :disabled="it.disabled"
        :class="['ag-dropdown__item', it.danger ? 'is-danger' : '']"
        @click="pick(it)"
      >
        {{ it.label }}
      </button>
    </div>
  </div>
</template>
