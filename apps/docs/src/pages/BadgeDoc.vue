<script setup lang="ts">
import { Badge, Tag } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const variants = ["primary", "info", "success", "warning", "danger"] as const;

const badgeCodes = {
  vue: `<Badge variant="primary">12</Badge>\n<Badge variant="success" pill>Pill</Badge>`,
  react: `<Badge variant="primary">12</Badge>\n<Badge variant="success" pill>Pill</Badge>`,
  svelte: `<Badge variant="primary">12</Badge>\n<Badge variant="success" pill>Pill</Badge>`,
};
const tagCodes = {
  vue: `<Tag variant="success">启用</Tag>\n<Tag variant="danger" closable @close="onClose">禁用</Tag>`,
  react: `<Tag variant="success">启用</Tag>\n<Tag variant="danger" closable onClose={onClose}>禁用</Tag>`,
  svelte: `<Tag variant="success">启用</Tag>\n<Tag variant="danger" closable onclose={onClose}>禁用</Tag>`,
};
</script>

<template>
  <h1>Badge 徽标 / Tag 标签</h1>
  <p class="doc-lead">Badge 为实心计数徽标；Tag 为 rbac 风格状态标签（前置彩点 + 浅底），可关闭。</p>

  <h2>Badge</h2>
  <DemoBlock title="变体与 pill" :codes="badgeCodes">
    <Badge v-for="v in variants" :key="v" :variant="v" style="margin-right: 8px">{{ v }}</Badge>
    <Badge variant="primary" size="md" style="margin-left: 12px">md</Badge>
    <Badge variant="info" size="lg" style="margin-left: 8px">lg</Badge>
    <Badge variant="success" pill style="margin-left: 8px">Pill 圆角</Badge>
    <Badge variant="danger" circle style="margin-left: 8px" />
  </DemoBlock>

  <h2>Tag 状态标签</h2>
  <DemoBlock title="彩点状态（rbac 模式）" :codes="tagCodes">
    <Tag variant="success" style="margin-right: 8px">启用</Tag>
    <Tag variant="danger" style="margin-right: 8px">禁用</Tag>
    <Tag variant="warning" style="margin-right: 8px">待审核</Tag>
    <Tag variant="primary" style="margin-right: 8px">进行中</Tag>
    <Tag variant="info" closable>可关闭</Tag>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['variant', '语义变体', 'default / primary / info / success / warning / danger', 'default'],
      ['pill（Badge）', '胶囊圆角', 'boolean', 'false'],
      ['size（Badge）', '尺寸', 'sm / md / lg', 'sm'],
      ['dot（Tag）', '前置彩点', 'boolean', 'true'],
      ['closable（Tag）', '可关闭', 'boolean', 'false'],
    ]"
  />
</template>
