<script setup lang="ts">
import { ArgonChart } from "@argon-kit/charts/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const months = ["1月", "2月", "3月", "4月", "5月", "6月"];

const lineCodes = {
  vue: `import { ArgonChart } from "@argon-kit/charts/vue";

<ArgonChart kind="line" :labels="months" :datasets="[{ label: '里程', data: [65, 59, 80, 81, 56, 55] }]" />`,
  react: `import { ArgonChart } from "@argon-kit/charts/react";

<ArgonChart kind="line" labels={months} datasets={[{ label: "里程", data: [65, 59, 80, 81, 56, 55] }]} />`,
  svelte: `import { ArgonChart } from "@argon-kit/charts/svelte";

<ArgonChart kind="line" {labels} datasets={[{ label: '里程', data: [65, 59, 80, 81, 56, 55] }]} />`,
};
const barCodes = {
  vue: `<ArgonChart kind="bar" :labels="months" :datasets="[{ label: '油耗', data: [40, 55, 47, 62, 58, 70] }]" />`,
  react: `<ArgonChart kind="bar" labels={months} datasets={[{ label: "油耗", data: [40, 55, 47, 62, 58, 70] }]} />`,
  svelte: `<ArgonChart kind="bar" {labels} datasets={[{ label: '油耗', data: [40, 55, 47, 62, 58, 70] }]} />`,
};
const doughnutCodes = {
  vue: `<ArgonChart kind="doughnut" :labels="['行驶', '怠速', '离线']" :datasets="[{ data: [62, 18, 20] }]" :height="240" />`,
  react: `<ArgonChart kind="doughnut" labels={["行驶", "怠速", "离线"]} datasets={[{ data: [62, 18, 20] }]} height={240} />`,
  svelte: `<ArgonChart kind="doughnut" labels={['行驶', '怠速', '离线']} datasets={[{ data: [62, 18, 20] }]} height={240} />`,
};
</script>

<template>
  <h1>Charts 图表</h1>
  <p class="doc-lead">
    Chart.js 4 底座 + Argon 主题（圆角柱、虚线网格、83% 环形切割、Open Sans 字体）。
    独立包 <code>@argon-kit/charts</code>，主包之外按需引入。
  </p>

  <h2>折线图</h2>
  <DemoBlock title="月度里程" :codes="lineCodes">
    <ArgonChart kind="line" :labels="months" :datasets="[{ label: '里程', data: [65, 59, 80, 81, 56, 55] }]" />
  </DemoBlock>

  <h2>柱状图</h2>
  <DemoBlock title="Argon 标志性圆角柱" :codes="barCodes">
    <ArgonChart kind="bar" :labels="months" :datasets="[{ label: '油耗', data: [40, 55, 47, 62, 58, 70] }]" />
  </DemoBlock>

  <h2>环形图</h2>
  <DemoBlock title="83% cutout" :codes="doughnutCodes">
    <ArgonChart kind="doughnut" :labels="['行驶', '怠速', '离线']" :datasets="[{ data: [62, 18, 20] }]" :height="240" />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['kind', '图表类型', 'line / bar / pie / doughnut', 'line'],
      ['labels', '横轴标签', 'string[]', '必填'],
      ['datasets', '数据集（未指定色时按 Argon 调色板顺序取色）', 'object[]', '必填'],
      ['options', '透传 Chart.js options（覆盖默认主题）', 'object', '—'],
      ['height', '容器高度 px', 'number', '300'],
    ]"
  />
</template>
