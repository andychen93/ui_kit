<script setup lang="ts">
import Glyph from "../glyph/Glyph.vue";

defineProps<{
  open: boolean;
  title?: string;
}>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <template v-if="open">
      <div class="ag-drawer-mask" @click="emit('close')" />
      <aside class="ag-drawer" role="dialog" aria-modal="true">
        <div class="ag-drawer__header">
          <h3 class="ag-drawer__title">{{ title }}</h3>
          <button type="button" class="ag-drawer__close" aria-label="关闭" @click="emit('close')">
            <Glyph name="x" />
          </button>
        </div>
        <div class="ag-drawer__body"><slot /></div>
      </aside>
    </template>
  </Teleport>
</template>
