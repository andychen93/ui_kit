<script setup lang="ts">
import { Card, Button, Tag } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const basicCodes = {
  vue: `<Card title="卡片标题" extra="3 条记录">\n  <p>卡片内容</p>\n  <template #footer>更新于 2026-08-28</template>\n</Card>`,
  react: `<Card title="卡片标题" extra="3 条记录" footer="更新于 2026-08-28">\n  <p>卡片内容</p>\n</Card>`,
  svelte: `<Card title="卡片标题">\n  <p>卡片内容</p>\n  {#snippet footer()}更新于 2026-08-28{/snippet}\n</Card>`,
  html: `<div id="card"></div>
<script type="module">
  import { Card } from '@argon-kit/html'
  const card = new Card('#card', { title: '卡片标题', extra: '3 条记录' })
  card.getElement().querySelector('.ag-card-body')!.textContent = '卡片内容'
<\/script>`,
};
const noBodyCodes = {
  vue: `<Card title="表格卡片" noBody>\n  <Table :columns="cols" :rows="rows" />\n</Card>`,
  react: `<Card title="表格卡片" noBody>\n  <Table columns={cols} rows={rows} />\n</Card>`,
  svelte: `<Card title="表格卡片" noBody>\n  <Table columns={cols} rows={rows} />\n</Card>`,
  html: `<div id="card"></div>
<script type="module">
  import { Card } from '@argon-kit/html'
  const card = new Card('#card', { title: '表格卡片' })
  card.getElement().querySelector('.ag-card-body')!.textContent = '' // noBody：自行填充内容
<\/script>`,
};
</script>

<template>
  <h1>Card 卡片</h1>
  <p class="doc-lead">Argon 白底卡片：header（title + extra）/ body / footer；noBody 用于内嵌 Table、地图。</p>

  <h2>基础</h2>
  <DemoBlock title="带 header 与 footer" :codes="basicCodes">
    <Card title="团队里程统计" extra="更新于 5 分钟前">
      <p style="margin: 0">本月累计里程 128,400 km，环比上升 12%。</p>
      <template #footer>
        <Button variant="link" size="sm">查看明细</Button>
      </template>
    </Card>
  </DemoBlock>

  <h2>noBody 模式</h2>
  <DemoBlock title="内嵌内容无内边距" :codes="noBodyCodes">
    <Card title="车辆状态" noBody>
      <div style="padding: 16px 20px">
        <Tag variant="success">行驶中 12</Tag>
        <Tag variant="warning" style="margin-left: 8px">怠速 3</Tag>
        <Tag variant="danger" style="margin-left: 8px">离线 5</Tag>
      </div>
    </Card>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['title', '标题（可用插槽替代）', 'string', '—'],
      ['noBody', '去掉 body 内边距容器', 'boolean', 'false'],
      ['extra / footer', '头部右侧 / 底部插槽', 'slot', '—'],
    ]"
  />
</template>
