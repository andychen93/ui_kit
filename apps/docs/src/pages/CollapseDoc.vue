<script setup lang="ts">
import { ref } from "vue";
import { Collapse, CollapsePanel } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const active = ref<string[]>(["a"]);
const accordionActive = ref<string[]>(["x"]);

const basicCodes = {
  vue: `<Collapse v-model="active">\n  <CollapsePanel panel-key="a" title="面板 A">内容 A</CollapsePanel>\n</Collapse>`,
  react: `<Collapse activeKeys={active} onChange={setActive}>\n  <CollapsePanel panelKey="a" title="面板 A">内容 A</CollapsePanel>\n</Collapse>`,
  svelte: `<Collapse bind:value={active}>\n  <CollapsePanel panelKey="a" title="面板 A">内容 A</CollapsePanel>\n</Collapse>`,
  html: `<div id="collapse"></div>
<script type="module">
  import { Collapse } from '@argon-kit/html'
  const collapse = new Collapse('#collapse')
  collapse.addPanel('车辆基本信息', '车牌号京A·12345，车型东风天龙 KL 460。')
  collapse.addPanel('驾驶行为', '近 30 天急加速 12 次、急刹车 8 次。')
<\/script>`,
};
const accordionCodes = {
  vue: `<Collapse v-model="acc" accordion>…</Collapse>`,
  react: `<Collapse accordion activeKeys={acc} onChange={setAcc}>…</Collapse>`,
  svelte: `<Collapse bind:value={acc} accordion>…</Collapse>`,
  html: `<div id="collapse"></div>
<script type="module">
  import { Collapse } from '@argon-kit/html'
  const collapse = new Collapse('#collapse', { accordion: true })
  collapse.addPanel('今日里程', '1,284 km')
  collapse.addPanel('今日油耗', '412 L')
<\/script>`,
};
</script>

<template>
  <h1>Collapse 折叠面板</h1>
  <p class="doc-lead">手风琴或多开模式，v-model 控制展开的 panelKey 数组。</p>

  <h2>多开模式</h2>
  <DemoBlock title="v-model 数组" :codes="basicCodes">
    <Collapse v-model="active">
      <CollapsePanel panel-key="a" title="车辆基本信息">
        车牌号京A·12345，车型东风天龙 KL 460，2024 年 3 月入队。
      </CollapsePanel>
      <CollapsePanel panel-key="b" title="驾驶行为">
        近 30 天急加速 12 次、急刹车 8 次、超速 3 次。
      </CollapsePanel>
      <CollapsePanel panel-key="c" title="维保记录" disabled>
        需要更高权限查看。
      </CollapsePanel>
    </Collapse>
  </DemoBlock>

  <h2>手风琴</h2>
  <DemoBlock title="accordion 同时只开一个" :codes="accordionCodes">
    <Collapse v-model="accordionActive" accordion>
      <CollapsePanel panel-key="x" title="今日里程">1,284 km</CollapsePanel>
      <CollapsePanel panel-key="y" title="今日油耗">412 L</CollapsePanel>
      <CollapsePanel panel-key="z" title="今日报警">3 起</CollapsePanel>
    </Collapse>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['modelValue', '展开面板 key 数组', 'string[]', '[]'],
      ['accordion', '手风琴模式', 'boolean', 'false'],
      ['panelKey（Panel）', '面板唯一 key', 'string', '必填'],
      ['disabled（Panel）', '禁用面板', 'boolean', 'false'],
    ]"
  />
</template>
