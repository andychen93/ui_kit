<script setup lang="ts">
import { ref } from "vue";
import { Checkbox, RadioGroup } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const agree = ref(false);
const gender = ref<string | number | null>("m");
const checkCodes = {
  vue: `<Checkbox v-model="agree">已阅读协议</Checkbox>`,
  react: `<Checkbox checked={agree} onChange={setAgree}>已阅读协议</Checkbox>`,
  svelte: `<Checkbox bind:checked={agree}>已阅读协议</Checkbox>`,
  html: `<input id="agree" type="checkbox" />
<script type="module">
  import { Checkbox } from '@argon-kit/html'
  new Checkbox('#agree', {
    label: '已阅读协议',
    onChange: (checked) => console.log(checked),
  })
<\/script>`,
};
</script>

<template>
  <h1>Checkbox / Radio</h1>
  <p class="doc-lead">勾选与单选，选中色为 Argon primary。</p>

  <h2>Checkbox</h2>
  <DemoBlock
    title="勾选"
    :codes="checkCodes"
  >
    <Checkbox v-model="agree">已阅读协议</Checkbox>
  </DemoBlock>

  <h2>Radio.Group</h2>
  <DemoBlock title="单选组">
    <RadioGroup
      v-model="gender"
      name="gender"
      :options="[
        { label: '男', value: 'm' },
        { label: '女', value: 'f' },
      ]"
    />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['checked / v-model', 'Checkbox 是否选中', 'boolean', 'false'],
      ['options', 'RadioGroup 选项', '{ label, value }[]', '[]'],
      ['disabled', '禁用', 'boolean', 'false'],
    ]"
  />
</template>
