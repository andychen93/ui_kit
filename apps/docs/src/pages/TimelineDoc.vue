<script setup lang="ts">
import { Timeline } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const items = [
  { content: "创建工单", time: "2026-08-26 09:30", color: "primary" as const },
  { content: "指派维修班组", time: "2026-08-26 11:00", color: "info" as const },
  { content: "更换刹车片完成", time: "2026-08-27 16:20", color: "success" as const },
  { content: "等待验收", color: "gray" as const },
];

const demoCodes = {
  vue: `<Timeline :items="[\n  { content: '创建工单', time: '09:30', color: 'primary' },\n  { content: '维修完成', color: 'success' },\n]" />`,
  react: `<Timeline items={[\n  { content: '创建工单', time: '09:30', color: 'primary' },\n  { content: '维修完成', color: 'success' },\n]} />`,
  svelte: `<Timeline items={[\n  { content: '创建工单', time: '09:30', color: 'primary' },\n  { content: '维修完成', color: 'success' },\n]} />`,
};
</script>

<template>
  <h1>Timeline 时间线</h1>
  <p class="doc-lead">垂直时间线，每项 content + time + 彩点颜色。</p>

  <DemoBlock title="维修工单流转" :codes="demoCodes">
    <Timeline :items="items" />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['items', '时间线条目', 'TimelineItem[]（content / time / color）', '必填'],
      ['color', '彩点颜色', 'primary / info / success / warning / danger / gray', 'primary'],
    ]"
  />
</template>
