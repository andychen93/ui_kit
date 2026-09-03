<script setup lang="ts">
import { ref } from "vue";
import { Tree, type TreeNode } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const id = ref<string | number | null>(null);
const data: TreeNode[] = [
  {
    id: "org",
    label: "组织",
    children: [
      {
        id: "rd",
        label: "研发",
        children: [
          { id: "fe", label: "前端" },
          { id: "be", label: "后端" },
        ],
      },
      { id: "prod", label: "产品" },
    ],
  },
];
const codes = {
  vue: `<Tree v-model="id" :data="data" />`,
  react: `<Tree value={id} onChange={setId} data={data} />`,
  svelte: `<Tree bind:value={id} {data} />`,
};
</script>

<template>
  <h1>Tree 树</h1>
  <p class="doc-lead">展开 / 选中。下拉选择请用 TreeSelect；穿梭请用 Transfer。</p>

  <DemoBlock title="基础" :codes="codes">
    <div style="width: 100%">
      <Tree v-model="id" :data="data" />
      <p v-if="id != null" class="doc-lead" style="margin-top: 12px">已选：{{ id }}</p>
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型']"
    :rows="[
      ['data', '树数据', 'TreeNode[]'],
      ['value', '选中节点 id', 'string | number | null'],
    ]"
  />
</template>
