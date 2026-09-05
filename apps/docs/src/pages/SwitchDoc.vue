<script setup lang="ts">
import { ref } from "vue";
import { Switch } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const on = ref(true);
const switchCodes = {
  vue: `<Switch v-model="on" />`,
  react: `<Switch checked={on} onChange={setOn} />`,
  svelte: `<Switch bind:checked={on} />`,
  html: `<div id="sw"></div>
<script type="module">
  import { Switch } from '@argon-kit/html'
  new Switch('#sw', { checked: true, onChange: (checked) => console.log(checked) })
<\/script>`,
};
</script>

<template>
  <h1>Switch 开关</h1>
  <p class="doc-lead">状态切换。带确认的启用/停用（StatusSwitch）在 Pro 层后续提供。</p>

  <DemoBlock
    title="基础"
    :codes="switchCodes"
  >
    <Switch v-model="on" />
    <Switch :model-value="false" disabled />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['checked / v-model', '是否打开', 'boolean', 'false'],
      ['disabled', '禁用', 'boolean', 'false'],
    ]"
  />
</template>
