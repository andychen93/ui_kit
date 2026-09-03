<script setup lang="ts">
import { VectorMap } from "@argon-kit/plugins/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const fleetByRegion = { NA: 120, SA: 45, EU: 210, AF: 30, AS: 380, SE: 95, OC: 25 };

const codes = {
  vue: `import { VectorMap } from "@argon-kit/plugins/vue";

<VectorMap :data="{ NA: 120, EU: 210, AS: 380 }" :height="320" />`,
  react: `import { VectorMap } from "@argon-kit/plugins/react";

<VectorMap data={{ NA: 120, EU: 210, AS: 380 }} height={320} />`,
  svelte: `import { VectorMap } from "@argon-kit/plugins/svelte";

<VectorMap data={{ NA: 120, EU: 210, AS: 380 }} height={320} />`,
};
</script>

<template>
  <h1>VectorMap 世界地图</h1>
  <p class="doc-lead">
    自研 SVG 低精度世界地图（零依赖，规避 jvectormap 的 AGPL 许可）：
    区域数据按 primary→info 色阶着色，hover 显示数值。独立包 <code>@argon-kit/plugins</code>。
  </p>

  <DemoBlock title="各大洲车辆分布" :codes="codes">
    <VectorMap :data="fleetByRegion" :height="340" />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['data', '区域数值（NA/SA/EU/AF/AS/SE/OC → value）', 'Record<string, number>', '{}'],
      ['height', '高度 px', 'number', '320'],
      ['regionClick', '区域点击回调', 'event (code, name)', '—'],
    ]"
  />
</template>
