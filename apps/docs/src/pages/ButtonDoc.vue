<script setup lang="ts">
import { Button } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const solids = ["primary", "info", "success", "warning", "danger", "default"] as const;
const gradients = [
  "gradient-primary",
  "gradient-info",
  "gradient-success",
  "gradient-warning",
  "gradient-danger",
  "gradient-default",
] as const;
const socials = [
  "github",
  "google",
  "wechat",
  "facebook",
  "twitter",
  "pinterest",
  "linkedin",
  "dribbble",
  "youtube",
  "instagram",
  "reddit",
  "tumblr",
  "behance",
  "vimeo",
  "slack",
] as const;

const basicCodes = {
  vue: `<Button variant="primary">primary</Button>`,
  react: `<Button variant="primary">primary</Button>`,
  svelte: `<Button variant="primary">primary</Button>`,
  html: `<button id="btn">primary</button>
<script type="module">
  import { Button } from '@argon-kit/html'
  new Button('#btn', { variant: 'primary' })
<\/script>`,
};
const socialCodes = {
  vue: `<Button variant="social-facebook">Facebook</Button>\n<Button variant="social-twitter">Twitter</Button>`,
  react: `<Button variant="social-facebook">Facebook</Button>\n<Button variant="social-twitter">Twitter</Button>`,
  svelte: `<Button variant="social-facebook">Facebook</Button>\n<Button variant="social-twitter">Twitter</Button>`,
  html: `<button id="fb">Facebook</button>\n<button id="tw">Twitter</button>
<script type="module">
  import { Button } from '@argon-kit/html'
  new Button('#fb', { variant: 'social-facebook' })
  new Button('#tw', { variant: 'social-twitter' })
<\/script>`,
};
const gradientCodes = {
  vue: `<Button variant="gradient-primary">primary</Button>`,
  react: `<Button variant="gradient-primary">primary</Button>`,
  svelte: `<Button variant="gradient-primary">primary</Button>`,
  html: `<button id="btn">primary</button>
<script type="module">
  import { Button } from '@argon-kit/html'
  new Button('#btn', { variant: 'gradient-primary' })
<\/script>`,
};
</script>

<template>
  <h1>Button 按钮</h1>
  <p class="doc-lead">实心、渐变、描边、社交登录。三框架 class 均为 ag-btn--*。</p>

  <h2>实心</h2>
  <DemoBlock title="基础用法" :codes="basicCodes">
    <Button v-for="v in solids" :key="v" :variant="v">{{ v }}</Button>
  </DemoBlock>

  <h2>渐变</h2>
  <DemoBlock title="Argon 87deg 渐变" :codes="gradientCodes">
    <Button v-for="v in gradients" :key="v" :variant="v">{{ v.replace('gradient-', '') }}</Button>
  </DemoBlock>

  <h2>其它</h2>
  <DemoBlock title="Neutral / Outline / Loading">
    <Button variant="neutral">Neutral</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="link">Link</Button>
    <Button loading>Loading</Button>
  </DemoBlock>

  <h2>社交按钮</h2>
  <DemoBlock title="15 个品牌（Argon 官方色）" :codes="socialCodes">
    <Button v-for="s in socials" :key="s" :variant="`social-${s}`" style="margin: 0 8px 8px 0">
      {{ s }}
    </Button>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['variant', '视觉变体', 'primary / info / … / social-wechat', 'primary'],
      ['size', '尺寸', 'sm / md / lg', 'md'],
      ['loading', '加载中并禁用', 'boolean', 'false'],
      ['block', '块级', 'boolean', 'false'],
      ['iconOnly', '方形图标按钮', 'boolean', 'false'],
    ]"
  />
</template>
