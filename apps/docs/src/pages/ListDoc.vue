<script setup lang="ts">
import { ref } from "vue";
import { List, Empty, Button } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const items = [
  { key: "1", title: "京A·12345", description: "行驶中 · 华北一队" },
  { key: "2", title: "京B·67890", description: "怠速 · 华北二队" },
  { key: "3", title: "冀A·24680", description: "离线 · 华北一队" },
];
const loading = ref(false);

const listCodes = {
  vue: `<List :items="items" header="车辆列表" bordered />`,
  react: `<List items={items} header="车辆列表" bordered />`,
  svelte: `<List items={items} bordered>{#snippet header()}车辆列表{/snippet}</List>`,
};
const loadingCodes = {
  vue: `<List :items="[]" loading />`,
  react: `<List items={[]} loading />`,
  svelte: `<List items={[]} loading />`,
};
const emptyCodes = {
  vue: `<Empty description="暂无车辆">\n  <template #extra><Button size="sm">新增车辆</Button></template>\n</Empty>`,
  react: `<Empty description="暂无车辆" extra={<Button size="sm">新增车辆</Button>} />`,
  svelte: `<Empty description="暂无车辆">\n  {#snippet extra()}<Button size="sm">新增车辆</Button>{/snippet}\n</Empty>`,
};
</script>

<template>
  <h1>List 列表 / Empty 空态</h1>
  <p class="doc-lead">通用列表（header/footer/loading）与空状态占位。</p>

  <h2>List</h2>
  <DemoBlock title="基础列表" :codes="listCodes">
    <List :items="items" header="在队车辆（3）" bordered />
  </DemoBlock>

  <DemoBlock title="加载中" :codes="loadingCodes">
    <Button size="sm" style="margin-bottom: 12px" @click="loading = !loading">
      {{ loading ? '关闭' : '打开' }} loading
    </Button>
    <List :items="loading ? [] : items" :loading="loading" />
  </DemoBlock>

  <h2>Empty</h2>
  <DemoBlock title="空状态" :codes="emptyCodes">
    <Empty description="暂无车辆">
      <template #extra>
        <Button size="sm">新增车辆</Button>
      </template>
    </Empty>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['items（List）', '列表条目', '{ key / title / description }[]', '[]'],
      ['loading（List）', '加载态', 'boolean', 'false'],
      ['description（Empty）', '空态文案', 'string', '暂无数据'],
    ]"
  />
</template>
