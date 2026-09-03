<script setup lang="ts">
import { ref } from "vue";
import { SelectMultiple, Carousel } from "@argon-kit/plugins/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const selected = ref<string[]>(["a"]);
const options = [
  { value: "a", label: "华北一队" },
  { value: "b", label: "华北二队" },
  { value: "c", label: "华东一队" },
  { value: "d", label: "华南一队", disabled: true },
];

const slides = [
  { key: "1", content: "安全行驶 30 天", caption: "安全运营", description: "全队零事故" },
  { key: "2", content: "里程 128,400 km", caption: "月度里程", description: "环比 +12%" },
  { key: "3", content: "油耗 -8%", caption: "节能降耗", description: "智能调度见效" },
];

const selectCodes = {
  vue: `<SelectMultiple v-model="selected" :options="options" placeholder="指派车队" />`,
  react: `<SelectMultiple value={selected} options={options} placeholder="指派车队" onChange={setSelected} />`,
  svelte: `<SelectMultiple bind:value={selected} {options} placeholder="指派车队" />`,
};
const carouselCodes = {
  vue: `<Carousel :items="slides" :interval="5000" />`,
  react: `<Carousel items={slides} interval={5000} />`,
  svelte: `<Carousel items={slides} interval={5000} />`,
};
</script>

<template>
  <h1>SelectMultiple / Carousel</h1>
  <p class="doc-lead">多选 chip 化与轮播，均为自研（无第三方依赖）。独立包 <code>@argon-kit/plugins</code>。</p>

  <h2>SelectMultiple</h2>
  <DemoBlock title="chip 多选" :codes="selectCodes">
    <SelectMultiple v-model="selected" :options="options" placeholder="指派车队" />
  </DemoBlock>

  <h2>Carousel</h2>
  <DemoBlock title="渐变卡片轮播（hover 暂停）" :codes="carouselCodes">
    <div>
      <Carousel :items="slides" :interval="5000" />
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['options（Select）', '选项', '{ value / label / disabled? }[]', '必填'],
      ['value（Select）', '已选值（v-model）', 'string[]', '[]'],
      ['items（Carousel）', '轮播项（src 图片或 content 内容 + caption）', 'CarouselItem[]', '必填'],
      ['interval（Carousel）', '自动轮播 ms（0 关闭）', 'number', '5000'],
      ['indicators / controls（Carousel）', '指示器 / 箭头', 'boolean', 'true'],
    ]"
  />
</template>
