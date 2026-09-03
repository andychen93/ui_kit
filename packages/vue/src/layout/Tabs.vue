<script setup lang="ts">
import type { TabItem } from "@argon-kit/core";

defineProps<{
  items: TabItem[];
  active: string;
  center?: boolean;
}>();
const emit = defineEmits<{ change: [key: string] }>();
</script>

<template>
  <div class="ag-tabs">
    <div :class="['ag-tabs__nav', center ? 'is-center' : '']" role="tablist">
      <button
        v-for="it in items"
        :key="it.key"
        type="button"
        role="tab"
        :aria-selected="it.key === active"
        :disabled="it.disabled"
        :class="['ag-tabs__tab', it.key === active ? 'is-active' : '']"
        @click="emit('change', it.key)"
      >
        {{ it.label }}
      </button>
    </div>
    <div class="ag-tabs__panel">
      <slot />
    </div>
  </div>
</template>
