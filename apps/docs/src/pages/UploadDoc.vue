<script setup lang="ts">
import { ref } from "vue";
import { Upload } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const files = ref<File[]>([]);
const uploadCodes = {
  vue: `<Upload v-model="files" multiple />`,
  react: `<Upload files={files} onChange={setFiles} multiple />`,
  svelte: `<Upload bind:files multiple />`,
  html: `<div id="upload"></div>
<script type="module">
  import { Upload } from '@argon-kit/html'
  const upload = new Upload('#upload', {
    multiple: true,
    onUpload: (files) => console.log(files),
  })
<\/script>`,
};
</script>

<template>
  <h1>Upload 上传</h1>
  <p class="doc-lead">选择本地文件并回传 File 列表，不内置上传协议。</p>

  <DemoBlock
    title="选择文件"
    stack
    :codes="uploadCodes"
  >
    <Upload v-model="files" multiple />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['files / v-model', '已选文件', 'File[]', '[]'],
      ['multiple', '多选', 'boolean', 'false'],
      ['accept', 'MIME / 扩展名', 'string', '—'],
      ['buttonText', '按钮文案', 'string', '选择文件'],
    ]"
  />
</template>
