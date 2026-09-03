<script setup lang="ts">
import Input from "./Input.vue";
import type { FieldStatus } from "./types";

const model = defineModel<string>({ default: "" });
defineProps<{
  placeholder?: string;
  disabled?: boolean;
  status?: FieldStatus;
  hint?: string;
}>();
</script>

<template>
  <Input
    v-model="model"
    type="number"
    :placeholder="placeholder"
    :disabled="disabled"
    :status="status"
    :hint="hint"
  />
</template>
