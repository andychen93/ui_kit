<script setup lang="ts">
import { Avatar, AvatarGroup } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const basicCodes = {
  vue: `<Avatar src="/img/u1.png" />\n<Avatar size="lg">陈</Avatar>`,
  react: `<Avatar src="/img/u1.png" />\n<Avatar size="lg">陈</Avatar>`,
  svelte: `<Avatar src="/img/u1.png" />\n<Avatar size="lg">陈</Avatar>`,
  html: `<div id="a1"></div>\n<div id="a2"></div>
<script type="module">
  import { Avatar } from '@argon-kit/html'
  new Avatar('#a1', { src: '/img/u1.png' })
  new Avatar('#a2', { size: 'lg', alt: '陈' })
<\/script>`,
};
const groupCodes = {
  vue: `<AvatarGroup>\n  <Avatar>陈</Avatar>\n  <Avatar>李</Avatar>\n</AvatarGroup>`,
  react: `<AvatarGroup>\n  <Avatar>陈</Avatar>\n  <Avatar>李</Avatar>\n</AvatarGroup>`,
  svelte: `<AvatarGroup>\n  <Avatar>陈</Avatar>\n  <Avatar>李</Avatar>\n</AvatarGroup>`,
  html: `<div id="group">
  <div class="ag-avatar"></div>
  <div class="ag-avatar"></div>
</div>
<script type="module">
  import { Avatar, AvatarGroup } from '@argon-kit/html'
  document.querySelectorAll('#group > .ag-avatar').forEach((el, i) => {
    new Avatar(el as HTMLDivElement, { alt: ['陈', '李'][i] })
  })
  new AvatarGroup('#group', { max: 3 })
<\/script>`,
};
</script>

<template>
  <h1>Avatar 头像</h1>
  <p class="doc-lead">图片 / 文字 / 插槽回退，三种尺寸，AvatarGroup 堆叠展示。</p>

  <h2>基础</h2>
  <DemoBlock title="尺寸与回退" :codes="basicCodes">
    <Avatar size="sm" style="margin-right: 8px">小</Avatar>
    <Avatar style="margin-right: 8px">中</Avatar>
    <Avatar size="lg">大</Avatar>
  </DemoBlock>

  <h2>头像组</h2>
  <DemoBlock title="AvatarGroup 堆叠" :codes="groupCodes">
    <AvatarGroup>
      <Avatar>陈</Avatar>
      <Avatar>李</Avatar>
      <Avatar>王</Avatar>
      <Avatar>赵</Avatar>
      <Avatar>+9</Avatar>
    </AvatarGroup>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['src', '图片地址（优先渲染）', 'string', '—'],
      ['size', '尺寸', 'sm / md / lg', 'md'],
      ['square', '方形', 'boolean', 'false'],
    ]"
  />
</template>
