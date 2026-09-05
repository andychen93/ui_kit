<script setup lang="ts">
import { ref } from "vue";
import { Select } from "@argon-kit/vue";
import { RouterLink } from "vue-router";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const city = ref<string | number | null>(null);
const options = [
  { label: "北京", value: "bj" },
  { label: "上海", value: "sh" },
  { label: "深圳", value: "sz" },
];
const selectCodes = {
  vue: `<Select v-model="city" :options="options" allow-clear />`,
  react: `<Select value={city} onChange={setCity} options={options} allowClear />`,
  svelte: `<Select bind:value={city} {options} allowClear />`,
  html: `<select id="city"></select>
<script type="module">
  import { Select } from '@argon-kit/html'
  new Select('#city', {
    options: [
      { label: '北京', value: 'bj' },
      { label: '上海', value: 'sh' },
      { label: '深圳', value: 'sz' },
    ],
    placeholder: '选择城市',
    onChange: (v) => console.log(v),
  })
<\/script>`,
};
</script>

<template>
  <h1>Select 选择器</h1>
  <p class="doc-lead">
    普通 options 下拉。远程分页「下拉是表格」请用
    <RouterLink to="/components/page-select">PageSelect</RouterLink>，不要把全量数据塞进 Select。
  </p>

  <h2>基础</h2>
  <DemoBlock
    title="单选"
    stack
    :codes="selectCodes"
  >
    <Select v-model="city" :options="options" allow-clear placeholder="选择城市" />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['options', '选项', '{ label, value, disabled? }[]', '[]'],
      ['value', '当前值', 'string | number | null', 'null'],
      ['allowClear', '允许清空', 'boolean', 'false'],
      ['placeholder', '占位', 'string', '请选择'],
    ]"
  />
</template>
