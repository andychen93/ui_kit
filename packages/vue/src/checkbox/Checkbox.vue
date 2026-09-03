<script setup lang="ts">
import Glyph from "../glyph/Glyph.vue";

const checked = defineModel<boolean>({ default: false });
defineProps<{ disabled?: boolean }>();
</script>

<template>
  <label :class="['ag-check', disabled ? 'is-disabled' : '']">
    <input
      v-model="checked"
      type="checkbox"
      class="ag-check__input"
      :disabled="disabled"
    />
    <span class="ag-checkbox__box">
      <Glyph v-if="checked" name="check" />
    </span>
    <span v-if="$slots.default"><slot /></span>
  </label>
</template>
