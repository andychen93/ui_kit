<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { Button, type ButtonVariant } from "@argon-kit/vue";

const solids: ButtonVariant[] = [
  "primary",
  "info",
  "success",
  "warning",
  "danger",
  "default",
];
const gradients: ButtonVariant[] = [
  "gradient-primary",
  "gradient-info",
  "gradient-success",
  "gradient-warning",
  "gradient-danger",
  "gradient-default",
];
</script>

<template>
  <div style="max-width: 960px; margin: 0 auto; padding: 32px">
    <p style="color: var(--ag-gray-600); font-size: 13px; margin: 0">Vue playground</p>
    <h1 style="color: var(--ag-heading); font-size: 20px; margin: 4px 0 32px">Argon Button</h1>

    <section style="margin-bottom: 32px">
      <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">实心</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 12px">
        <Button v-for="v in solids" :key="v" :variant="v">{{ v }}</Button>
      </div>
    </section>

    <section style="margin-bottom: 32px">
      <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">渐变</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 12px">
        <Button v-for="v in gradients" :key="v" :variant="v">
          {{ v.replace("gradient-", "") }}
        </Button>
      </div>
    </section>

    <section style="margin-bottom: 32px">
      <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">中性 / 描边 / 链接 / 禁用 / 加载</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 12px">
        <Button variant="neutral">Neutral</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="link">Link</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </div>
    </section>

    <section style="margin-bottom: 32px">
      <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">尺寸与图标</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 12px">
        <Button size="sm">
          <template #icon><Plus :size="16" /></template>
          Small
        </Button>
        <Button>
          <template #icon><Plus :size="16" /></template>
          Default
        </Button>
        <Button size="lg">
          <template #icon><Plus :size="16" /></template>
          Large
        </Button>
        <Button icon-only aria-label="add">
          <template #icon><Plus :size="16" /></template>
        </Button>
      </div>
    </section>

    <section>
      <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">社交登录</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 12px">
        <Button variant="social-github">GitHub</Button>
        <Button variant="social-google">Google</Button>
        <Button variant="social-wechat">微信</Button>
        <Button variant="social-github" icon-only aria-label="GitHub" />
      </div>
    </section>
  </div>
</template>
