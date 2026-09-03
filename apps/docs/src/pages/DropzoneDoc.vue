<script setup lang="ts">
import { Dropzone } from "@argon-kit/plugins/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const codes = {
  vue: `import { Dropzone } from "@argon-kit/plugins/vue";

<Dropzone
  url="/upload"
  accepted-files="image/*"
  :max-filesize="5"
  hint="拖拽图片到此处，或点击选择"
  @added="onAdded"
/>`,
  react: `import { Dropzone } from "@argon-kit/plugins/react";

<Dropzone url="/upload" acceptedFiles="image/*" maxFilesize={5} onAdded={onAdded} />`,
  svelte: `import { Dropzone } from "@argon-kit/plugins/svelte";

<Dropzone url="/upload" acceptedFiles="image/*" maxFilesize={5} onadded={onAdded} />`,
};
</script>

<template>
  <h1>Dropzone 拖拽上传</h1>
  <p class="doc-lead">
    dropzone 底座 + Argon 皮肤（虚线框 hover 主色）。独立包 <code>@argon-kit/plugins</code>。
  </p>

  <DemoBlock title="单文件图片上传" :codes="codes">
    <div>
      <Dropzone url="/upload" accepted-files="image/*" :max-filesize="5" hint="拖拽图片到此处，或点击选择" />
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['url', '上传地址（本地预览可给占位）', 'string', '/'],
      ['acceptedFiles', '接受类型', 'string', 'image/*'],
      ['maxFiles / maxFilesize', '数量上限 / 单文件 MB 上限', 'number', '1 / 5'],
      ['multiple', '多文件模式', 'boolean', 'false'],
      ['hint', '提示文案', 'string', '拖拽文件到此处，或点击选择'],
      ['added / removed', '文件加入（含 dataUrl 预览）/ 移除回调', 'event', '—'],
    ]"
  />
</template>
