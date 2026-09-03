<script setup lang="ts">
import { ref } from "vue";
import { Transfer } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const keys = ref<string[]>(["2"]);
const data = [
  { key: "1", label: "前端" },
  { key: "2", label: "后端" },
  { key: "3", label: "测试" },
  { key: "4", label: "产品" },
];
const codes = {
  vue: `<Transfer v-model="keys" :data="data" />`,
  react: `<Transfer value={keys} onChange={setKeys} data={data} />`,
  svelte: `<Transfer bind:value={keys} {data} />`,
};
</script>

<template>
  <h1>Transfer 穿梭框</h1>
  <p class="doc-lead">左右两栏，勾选后用箭头搬运。受控值为右侧 key 数组。</p>

  <DemoBlock title="基础" :codes="codes">
    <div>
      <Transfer v-model="keys" :data="data" />
      <p class="doc-lead" style="margin-top: 12px">已选：{{ keys.join(", ") || "无" }}</p>
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型']"
    :rows="[
      ['data', '{ key, label, disabled? }[]', 'TransferItem[]'],
      ['value', '右侧 key', 'string[]'],
      ['titles', '左右标题', '[string, string]'],
    ]"
  />
</template>
