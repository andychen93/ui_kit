<script setup lang="ts">
import { useSlots } from "vue";

withDefaults(
  defineProps<{
    title?: string;
    noBody?: boolean;
  }>(),
  { noBody: false },
);

const slots = useSlots();
</script>

<template>
  <div class="ag-card">
    <div v-if="title || slots.extra || $slots.extra" class="ag-card__header">
      <h3 class="ag-card__title">{{ title }}</h3>
      <div v-if="slots.extra || $slots.extra" class="ag-card__extra">
        <slot name="extra" />
      </div>
    </div>
    <div v-if="!noBody" class="ag-card__body">
      <slot />
    </div>
    <slot v-else />
    <div v-if="slots.footer || $slots.footer" class="ag-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
