<script setup lang="ts">
import { ref } from "vue";
import { TreeSelect, type TreeNode } from "@argon-kit/vue";
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

const treeCodes = {
  vue: `<TreeSelect v-model="id" :data="data" allow-clear />`,
  react: `<TreeSelect value={id} onChange={setId} data={data} allowClear />`,
  svelte: `<TreeSelect bind:value={id} {data} allowClear />`,
  html: `<div id="dept"></div>
<script type="module">
  import { TreeSelect } from '@argon-kit/html'
  new TreeSelect('#dept', {
    placeholder: '选择部门',
    treeData: [
      {
        key: 'org',
        title: '组织',
        children: [
          { key: 'rd', title: '研发', children: [{ key: 'fe', title: '前端' }, { key: 'be', title: '后端' }] },
          { key: 'prod', title: '产品' },
        ],
      },
    ],
    onChange: (value) => console.log(value),
  })
<\/script>`,
};
</script>

<template>
  <h1>TreeSelect 树选择</h1>
  <p class="doc-lead">展开/选中树节点。值是节点 id，需要整棵子树数据请自己在业务侧按 id 查找。</p>

  <DemoBlock title="基础" :codes="treeCodes">
    <div style="min-height: 240px; width: 100%">
      <TreeSelect v-model="id" :data="data" allow-clear placeholder="选择部门" />
      <p v-if="id != null" class="doc-lead" style="margin-top: 12px">已选 id：{{ id }}</p>
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['data', '树数据 { id, label, children?, disabled? }', 'TreeNode[]', '[]'],
      ['value', '选中节点 id', 'string | number | null', 'null'],
      ['allowClear', '允许清空', 'boolean', 'false'],
      ['placeholder', '占位', 'string', '请选择'],
    ]"
  />
</template>
