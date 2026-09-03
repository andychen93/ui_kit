<script setup lang="ts">
import { onMounted, ref } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { defaultToolbar, type RichTextProps } from "../core/toolbar";

const props = withDefaults(defineProps<RichTextProps>(), {
  modelValue: "",
  placeholder: "请输入内容…",
  toolbar: () => defaultToolbar,
  readonly: false,
  height: 220,
});

const emit = defineEmits<{ "update:modelValue": [string] }>();

const elRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!elRef.value) return;
  const quill = new Quill(elRef.value, {
    theme: "snow",
    placeholder: props.placeholder,
    readOnly: props.readonly,
    modules: { toolbar: props.toolbar as never },
  });
  // 经 clipboard 转 Delta 设置初始内容（直接 innerHTML 会被 Quill 规范化清洗丢内容）
  if (props.modelValue) {
    quill.clipboard.dangerouslyPasteHTML(props.modelValue);
    quill.setSelection(null);
  }
  quill.on("text-change", () => {
    const html = quill.root.innerHTML;
    emit("update:modelValue", html);
    props.onChange?.(html);
  });
});
</script>

<template>
  <div class="ag-quill" :class="{ 'is-readonly': readonly }">
    <div ref="elRef" :style="{ minHeight: height + 'px' }" />
  </div>
</template>
