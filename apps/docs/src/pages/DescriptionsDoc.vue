<script setup lang="ts">
import { Descriptions, Tag } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const items = [
  { label: "车牌号", content: "京A·12345" },
  { label: "车型", content: "东风天龙 KL 460" },
  { label: "当前状态", content: "行驶中" },
  { label: "所属车队", content: "华北一队" },
  { label: "累计里程", content: "182,400 km" },
];

const demoCodes = {
  vue: `<Descriptions title="车辆详情" :items="items" border />`,
  react: `<Descriptions title="车辆详情" items={items} border />`,
  svelte: `<Descriptions title="车辆详情" items={items} border />`,
  html: `<div id="desc"></div>
<script type="module">
  import { Descriptions } from '@argon-kit/html'
  const desc = new Descriptions('#desc', { title: '车辆详情', bordered: true })
  desc.addItem({ label: '车牌号', content: '京A·12345' })
  desc.addItem({ label: '车型', content: '东风天龙 KL 460' })
<\/script>`,
};
</script>

<template>
  <h1>Descriptions 描述列表</h1>
  <p class="doc-lead">键值对详情视图（rbac 详情页模式），支持标题与带边框模式。</p>

  <DemoBlock title="车辆详情" :codes="demoCodes">
    <Descriptions title="车辆详情" :items="items" border />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['title', '标题', 'string', '—'],
      ['items', '条目', 'DescriptionItem[]（label / content）', '必填'],
      ['border', '带边框（label 灰底）', 'boolean', 'false'],
    ]"
  />
</template>
