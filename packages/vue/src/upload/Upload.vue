<script setup lang="ts">
import { ref } from "vue";
import Button from "../button/Button.vue";

const files = defineModel<File[]>({ default: () => [] });
defineProps<{
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  buttonText?: string;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

function onPick(e: Event) {
  files.value = Array.from((e.target as HTMLInputElement).files ?? []);
}
</script>

<template>
  <div class="ag-upload">
    <input
      ref="inputRef"
      class="ag-upload__input"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onPick"
    />
    <Button variant="neutral" :disabled="disabled" @click="inputRef?.click()">
      {{ buttonText ?? "选择文件" }}
    </Button>
    <ul v-if="files.length" class="ag-upload__list">
      <li v-for="f in files" :key="f.name + f.size" class="ag-upload__item">{{ f.name }}</li>
    </ul>
  </div>
</template>
