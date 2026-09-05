<script setup lang="ts">
import { ref } from "vue";
import { Steps, Button } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const items = [
  { title: "填写基本信息", description: "车牌、车型、VIN" },
  { title: "绑定设备", description: "选择终端与 SIM" },
  { title: "指派车队", description: "" },
  { title: "完成" },
];
const current = ref(1);

const basicCodes = {
  vue: `<Steps :items="items" :current="1" />`,
  react: `<Steps items={items} current={1} />`,
  svelte: `<Steps items={items} current={1} />`,
  html: `<div id="steps"></div>
<script type="module">
  import { Steps } from '@argon-kit/html'
  const steps = new Steps('#steps', { current: 1 })
  steps.addItem({ title: '填写基本信息', description: '车牌、车型、VIN' })
  steps.addItem({ title: '绑定设备', description: '选择终端与 SIM' })
  steps.addItem({ title: '指派车队' })
  steps.addItem({ title: '完成' })
<\/script>`,
};
const verticalCodes = {
  vue: `<Steps :items="items" :current="2" direction="vertical" />`,
  react: `<Steps items={items} current={2} direction="vertical" />`,
  svelte: `<Steps items={items} current={2} direction="vertical" />`,
  html: `<div id="steps-v"></div>
<script type="module">
  import { Steps } from '@argon-kit/html'
  const steps = new Steps('#steps-v', { current: 2, direction: 'vertical' })
  steps.addItem({ title: '填写基本信息', description: '车牌、车型、VIN' })
  steps.addItem({ title: '绑定设备', description: '选择终端与 SIM' })
  steps.addItem({ title: '指派车队' })
  steps.addItem({ title: '完成' })
<\/script>`,
};
</script>

<template>
  <h1>Steps 步骤条</h1>
  <p class="doc-lead">横向 / 竖向步骤条，current 高亮当前步，已完成显示 ✓。</p>

  <DemoBlock title="横向步骤条" :codes="basicCodes">
    <div style="margin-bottom: 16px; display: flex; gap: 8px">
      <Button size="sm" :disabled="current === 0" @click="current--">上一步</Button>
      <Button size="sm" :disabled="current === items.length - 1" @click="current++">下一步</Button>
    </div>
    <Steps :items="items" :current="current" />
  </DemoBlock>

  <DemoBlock title="竖向步骤条" :codes="verticalCodes">
    <Steps :items="items" :current="2" direction="vertical" />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['items', '步骤条目', 'StepItem[]（title / description）', '必填'],
      ['current', '当前步索引', 'number', '0'],
      ['direction', '方向', 'horizontal / vertical', 'horizontal'],
    ]"
  />
</template>
