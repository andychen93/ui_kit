<script setup lang="ts">
defineProps<{
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string | number;
}>();
const emit = defineEmits<{ change: [checked: boolean] }>();
</script>

<template>
  <label :class="['ag-check', disabled ? 'is-disabled' : '']">
    <input
      type="radio"
      class="ag-check__input"
      :name="name"
      :checked="checked"
      :disabled="disabled"
      @change="emit('change', ($event.target as HTMLInputElement).checked)"
    />
    <span class="ag-radio__dot" />
    <span v-if="$slots.default"><slot /></span>
  </label>
</template>
