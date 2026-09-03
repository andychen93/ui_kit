<script setup lang="ts">
import { ref } from "vue";
import Input from "./Input.vue";
import Glyph from "../glyph/Glyph.vue";
import type { FieldStatus } from "./types";

const model = defineModel<string>({ default: "" });
defineProps<{
  placeholder?: string;
  disabled?: boolean;
  status?: FieldStatus;
  hint?: string;
}>();
const visible = ref(false);
</script>

<template>
  <Input
    v-model="model"
    :type="visible ? 'text' : 'password'"
    :placeholder="placeholder"
    :disabled="disabled"
    :status="status"
    :hint="hint"
  >
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
    <template #suffix>
      <button
        type="button"
        class="ag-input__addon-btn"
        :aria-label="visible ? '隐藏密码' : '显示密码'"
        @click="visible = !visible"
      >
        <Glyph :name="visible ? 'eyeOff' : 'eye'" />
      </button>
    </template>
  </Input>
</template>
