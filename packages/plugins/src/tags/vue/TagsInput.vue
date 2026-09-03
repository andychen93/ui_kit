<script setup lang="ts">
import { computed, ref } from "vue";
import type { TagsInputProps } from "../../core/types";

const props = withDefaults(defineProps<TagsInputProps>(), {
  value: () => [],
  placeholder: "输入后回车添加",
  maxTags: Infinity,
  onlyUnique: false,
  disabled: false,
});

const emit = defineEmits<{ "update:modelValue": [string[]] }>();

const input = ref("");

const canAdd = computed(
  () =>
    !props.disabled &&
    input.value.trim().length > 0 &&
    props.value.length < props.maxTags &&
    (!props.onlyUnique || !props.value.includes(input.value.trim())),
);

function add() {
  if (!canAdd.value) {
    input.value = "";
    return;
  }
  const next = [...props.value, input.value.trim()];
  emit("update:modelValue", next);
  props.onChange?.(next);
  input.value = "";
}

function remove(tag: string) {
  if (props.disabled) return;
  const next = props.value.filter((t) => t !== tag);
  emit("update:modelValue", next);
  props.onChange?.(next);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    add();
  } else if (e.key === "Backspace" && input.value === "" && props.value.length) {
    remove(props.value[props.value.length - 1]);
  }
}
</script>

<template>
  <div class="ag-tags" :class="{ 'is-disabled': disabled }">
    <span v-for="tag in value" :key="tag" class="ag-tags__tag">
      {{ tag }}
      <button
        v-if="!disabled"
        type="button"
        class="ag-tags__remove"
        aria-label="remove"
        @click="remove(tag)"
      >×</button>
    </span>
    <input
      v-model="input"
      class="ag-tags__input"
      :placeholder="value.length ? '' : placeholder"
      :disabled="disabled"
      @keydown="onKeydown"
      @blur="add"
    />
  </div>
</template>
