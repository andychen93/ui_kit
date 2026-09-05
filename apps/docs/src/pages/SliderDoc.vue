<script setup lang="ts">
import { ref } from "vue";
import { Slider } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const value = ref(30);
const speed = ref(80);

const demoCodes = {
  vue: `<Slider v-model="value" />`,
  react: `<Slider value={value} onChange={setValue} />`,
  svelte: `<Slider bind:value />`,
  html: `<div id="slider"></div>
<script type="module">
  import { Slider } from '@argon-kit/html'
  const slider = new Slider('#slider', {
    value: 30,
    min: 0,
    max: 100,
    step: 1,
    onChange: (v) => console.log(v),
  })
<\/script>`,
};
</script>

<template>
  <h1>Slider 滑块</h1>
  <p class="doc-lead">原生 range 输入的 Argon 化样式，主色填充轨道 + 白底圆形拇指。</p>

  <DemoBlock title="基础" :codes="demoCodes" :stack="true">
    <Slider v-model="value" />
    <Slider v-model="speed" :min="0" :max="120" :step="10" />
    <Slider :model-value="50" disabled />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['modelValue', '当前值（v-model）', 'number', '0'],
      ['min / max / step', '范围与步长', 'number', '0 / 100 / 1'],
      ['disabled', '禁用', 'boolean', 'false'],
    ]"
  />
</template>
