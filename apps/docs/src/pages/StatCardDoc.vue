<script setup lang="ts">
import { StatCard } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const codes = {
  vue: `<StatCard variant="primary" label="车辆" :value="1280" :progress="72" hint="较昨日 +4%" />`,
  react: `<StatCard variant="primary" label="车辆" value={1280} progress={72} hint="较昨日 +4%" />`,
  svelte: `<StatCard variant="primary" label="车辆" value={1280} progress={72} hint="较昨日 +4%" />`,
};
</script>

<template>
  <h1>StatCard 指标卡</h1>
  <p class="doc-lead">渐变 KPI 卡，数值 28px / 700。value 由调用方传入，组件库不做数据拉取。</p>

  <DemoBlock title="六色" :codes="codes">
    <div class="ag-stat-grid" style="width: 100%">
      <StatCard variant="primary" label="车辆" :value="1280" :progress="72" hint="较昨日 +4%" />
      <StatCard variant="info" label="在线" :value="860" :progress="55" />
      <StatCard variant="success" label="告警已处理" :value="96" :progress="90" />
      <StatCard variant="warning" label="待办" :value="12" :progress="30" />
      <StatCard variant="danger" label="故障" :value="3" :progress="8" />
      <StatCard variant="default" label="用户" :value="420" />
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型']"
    :rows="[
      ['variant', 'primary / info / success / warning / danger / default', 'string'],
      ['label', '小写标签', 'string'],
      ['value', '主数值', 'string | number'],
      ['progress', '0-100 进度条', 'number'],
      ['hint', '底部说明', 'string'],
    ]"
  />
</template>
