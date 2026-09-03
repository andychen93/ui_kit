<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider, TagsInput } from "@argon-kit/plugins/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const price = ref(250);
const range = ref<[number, number]>([200, 400]);
const tags = ref<string[]>(["高速公路", "夜间"]);

const sliderCodes = {
  vue: `<RangeSlider v-model="price" :min="100" :max="500" :step="10" />
<RangeSlider v-model="range" :min="0" :max="1000" tooltips />`,
  react: `<RangeSlider value={price} min={100} max={500} step={10} onChange={setPrice} />
<RangeSlider value={range} min={0} max={1000} tooltips onChange={setRange} />`,
  svelte: `<RangeSlider bind:value={price} min={100} max={500} step={10} />
<RangeSlider bind:value={range} min={0} max={1000} tooltips />`,
};
const tagsCodes = {
  vue: `<TagsInput v-model="tags" :max-tags="5" only-unique placeholder="输入标签后回车" />`,
  react: `<TagsInput value={tags} maxTags={5} onlyUnique placeholder="输入标签后回车" onChange={setTags} />`,
  svelte: `<TagsInput bind:value={tags} maxTags={5} onlyUnique placeholder="输入标签后回车" />`,
};
</script>

<template>
  <h1>RangeSlider / TagsInput</h1>
  <p class="doc-lead">
    noUiSlider 底座的滑杆（主色填充 + 白底圆拇指）与自研标签输入。
    独立包 <code>@argon-kit/plugins</code>。
  </p>

  <h2>RangeSlider</h2>
  <DemoBlock title="单值与双滑块" :codes="sliderCodes">
    <div style="padding: 8px 4px 20px">
      <p style="margin: 0 0 8px; font-size: 13px; color: var(--ag-gray-600)">油价阈值：{{ price }} 元</p>
      <RangeSlider v-model="price" :min="100" :max="500" :step="10" />
    </div>
    <div style="padding: 8px 4px">
      <p style="margin: 0 0 8px; font-size: 13px; color: var(--ag-gray-600)">
        里程区间：{{ range[0] }} – {{ range[1] }} km
      </p>
      <RangeSlider v-model="range" :min="0" :max="1000" :step="20" tooltips />
    </div>
  </DemoBlock>

  <h2>TagsInput</h2>
  <DemoBlock title="回车添加 / Backspace 删除末项" :codes="tagsCodes">
    <TagsInput v-model="tags" :max-tags="5" only-unique placeholder="输入标签后回车" />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['value（Slider）', '单值或 [start, end]', 'number | [number, number]', '0'],
      ['min / max / step（Slider）', '范围与步长', 'number', '0 / 100 / 1'],
      ['tooltips（Slider）', '气泡提示', 'boolean', 'false'],
      ['value（Tags）', '标签数组（v-model）', 'string[]', '[]'],
      ['maxTags / onlyUnique（Tags）', '数量上限 / 去重', 'number / boolean', '∞ / false'],
    ]"
  />
</template>
