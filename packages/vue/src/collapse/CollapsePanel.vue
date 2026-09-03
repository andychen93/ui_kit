<script setup lang="ts">
import { computed, inject, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    panelKey: string;
    title?: string;
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const ctx = inject<{ toggle: (key: string) => void; isActive: (key: string) => boolean } | null>(
  "agCollapse",
  null,
);

const slots = useSlots();
const hasTitleSlot = computed(() => Boolean(slots.title));

const open = computed(() => ctx?.isActive(props.panelKey) ?? false);
</script>

<template>
  <div class="ag-collapse__panel">
    <button
      type="button"
      class="ag-collapse__header"
      :disabled="disabled"
      @click="ctx?.toggle(panelKey)"
    >
      <slot name="title">{{ title }}</slot>
      <span class="ag-collapse__arrow" :class="{ 'is-open': open }">›</span>
    </button>
    <div v-if="open" class="ag-collapse__body">
      <slot />
    </div>
  </div>
</template>
