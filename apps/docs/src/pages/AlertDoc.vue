<script setup lang="ts">
import { Alert } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const variants = ["primary", "info", "success", "warning", "danger"] as const;

const basicCodes = {
  vue: `<Alert variant="success"><strong>成功！</strong> 这是一条成功提示。</Alert>`,
  react: `<Alert variant="success"><strong>成功！</strong> 这是一条成功提示。</Alert>`,
  svelte: `<Alert variant="success"><strong>成功！</strong> 这是一条成功提示。</Alert>`,
};
const dismissibleCodes = {
  vue: `<Alert variant="danger" dismissible @close="onClose">可关闭的危险提示</Alert>`,
  react: `<Alert variant="danger" dismissible onClose={onClose}>可关闭的危险提示</Alert>`,
  svelte: `<Alert variant="danger" dismissible onclose={onClose}>可关闭的危险提示</Alert>`,
};
</script>

<template>
  <h1>Alert 警告提示</h1>
  <p class="doc-lead">常用于展示关键信息，支持五种语义色、图标插槽与可关闭。</p>

  <h2>变体</h2>
  <DemoBlock title="五种语义色" :codes="basicCodes">
    <Alert v-for="v in variants" :key="v" :variant="v" style="margin-bottom: 8px">
      <strong>{{ v }}</strong> — 这是一条 {{ v }} 提示。
    </Alert>
  </DemoBlock>

  <h2>可关闭</h2>
  <DemoBlock title="dismissible" :codes="dismissibleCodes">
    <Alert variant="danger" dismissible>点右上角 × 可关闭本条提示</Alert>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['variant', '语义变体', 'default / primary / info / success / warning / danger', 'default'],
      ['dismissible', '显示关闭按钮', 'boolean', 'false'],
      ['close', '关闭时回调', 'event', '—'],
    ]"
  />
</template>
