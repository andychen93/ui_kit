<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import DropzoneLib from "dropzone";
import "dropzone/dist/dropzone.css";
import { DZ_PREVIEW_TEMPLATE } from "../../core/dropzoneInner";
import type { DropzoneProps } from "../../core/types";

const props = withDefaults(defineProps<DropzoneProps>(), {
  url: "/",
  acceptedFiles: "image/*",
  maxFiles: 1,
  maxFilesize: 5,
  multiple: false,
  disabled: false,
  hint: "拖拽文件到此处，或点击上传",
});

const elRef = ref<HTMLDivElement | null>(null);
let dz: DropzoneLib | null = null;

onMounted(() => {
  if (!elRef.value || props.disabled) return;
  DropzoneLib.autoDiscover = false;
  dz = new DropzoneLib(elRef.value, {
    url: props.url,
    acceptedFiles: props.acceptedFiles,
    maxFiles: props.multiple ? props.maxFiles : 1,
    maxFilesize: props.maxFilesize,
    addRemoveLinks: true,
    previewTemplate: DZ_PREVIEW_TEMPLATE,
    clickable: ".ag-dz__click",
    init() {
      this.on("addedfile", (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
          props.onAdded?.({ name: file.name, size: file.size, dataUrl: String(reader.result) });
        };
        reader.readAsDataURL(file);
      });
      this.on("removedfile", () => props.onRemoved?.());
    },
  });
});

onBeforeUnmount(() => dz?.destroy());
</script>

<template>
  <div ref="elRef" class="ag-dz" :class="{ 'ag-dz--disabled': disabled }">
    <div class="ag-dz__click">
      <div class="ag-dz__inner">
        <span class="ag-dz__icon-wrap">
          <svg class="ag-dz__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 8 5-5 5 5" />
            <path d="M12 3v12" />
          </svg>
        </span>
        <p class="ag-dz__title">{{ hint }}</p>
        <p class="ag-dz__sub">单文件不超过 {{ maxFilesize }}MB，支持 {{ acceptedFiles === "image/*" ? "图片" : "指定类型" }}格式</p>
      </div>
    </div>
  </div>
</template>
