<script setup lang="ts">
import { Progress } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const basicCodes = {
  vue: `<Progress :percent="62" variant="primary" show-label />`,
  react: `<Progress percent={62} variant="primary" showLabel />`,
  svelte: `<Progress percent={62} variant="primary" showLabel />`,
  html: `<div id="progress"></div>
<script type="module">
  import { Progress } from '@argon-kit/html'
  new Progress('#progress', {
    percent: 62,
    variant: 'primary',
    format: (p) => p + '%',
  })
<\/script>`,
};
const styleCodes = {
  vue: `<Progress :percent="70" variant="gradient-primary" thin />`,
  react: `<Progress percent={70} variant="gradient-primary" thin />`,
  svelte: `<Progress percent={70} variant="gradient-primary" thin />`,
  html: `<div id="progress"></div>
<script type="module">
  import { Progress } from '@argon-kit/html'
  new Progress('#progress', { percent: 70, variant: 'gradient-primary' })
<\/script>`,
};
</script>

<template>
  <h1>Progress 进度条</h1>
  <p class="doc-lead">语义色与渐变、细条（StatCard 同款 3px）、条纹、百分比标签。</p>

  <h2>基础</h2>
  <DemoBlock title="语义色" :codes="basicCodes" :stack="true">
    <Progress :percent="62" variant="primary" show-label />
    <Progress :percent="88" variant="success" show-label />
    <Progress :percent="35" variant="warning" show-label />
    <Progress :percent="12" variant="danger" show-label />
  </DemoBlock>

  <h2>渐变与样式</h2>
  <DemoBlock title="gradient / thin / striped" :codes="styleCodes" :stack="true">
    <Progress :percent="70" variant="gradient-primary" />
    <Progress :percent="45" variant="gradient-info" thin />
    <Progress :percent="55" variant="primary" striped />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['percent', '百分比 0-100', 'number', '0'],
      ['variant', '语义色 / gradient-*', 'primary / … / gradient-danger', 'primary'],
      ['thin', '3px 细条', 'boolean', 'false'],
      ['striped', '条纹背景', 'boolean', 'false'],
      ['showLabel', '显示百分比', 'boolean', 'false'],
    ]"
  />
</template>
