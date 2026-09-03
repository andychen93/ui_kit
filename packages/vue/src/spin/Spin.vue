<script setup lang="ts">
import { useSlots } from "vue";

export type SpinSize = "sm" | "md" | "lg";

withDefaults(
  defineProps<{
    spinning?: boolean;
    size?: SpinSize;
    text?: string;
  }>(),
  { spinning: true, size: "md", text: "" },
);

const slots = useSlots();
</script>

<template>
  <div
    v-if="slots.default || $slots.default"
    class="ag-spin ag-spin--wrap"
    :class="size !== 'md' ? `ag-spin--${size}` : ''"
  >
    <slot />
    <div v-if="spinning" class="ag-spin__mask">
      <span class="ag-spin__spinner" />
      <span v-if="text" class="ag-spin__text">{{ text }}</span>
    </div>
  </div>
  <div
    v-else
    class="ag-spin"
    :class="[size !== 'md' ? `ag-spin--${size}` : '', text ? 'ag-spin--with-text' : '']"
  >
    <span class="ag-spin__spinner" />
    <span v-if="text" class="ag-spin__text">{{ text }}</span>
  </div>
</template>
