<script setup lang="ts">
import { ref } from "vue";
import { DatePicker, RangePicker } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const day = ref<string | null>("2026-08-28");
const range = ref<[string, string] | null>(null);
const dateCodes = {
  vue: `<DatePicker v-model="day" allow-clear />
<RangePicker v-model="range" />`,
  react: `<DatePicker value={day} onChange={setDay} allowClear />
<RangePicker value={range} onChange={setRange} />`,
  svelte: `<DatePicker bind:value={day} allowClear />
<RangePicker bind:value={range} />`,
};
</script>

<template>
  <h1>DatePicker 日期</h1>
  <p class="doc-lead">自研月历，值格式 YYYY-MM-DD。RangePicker 点两次完成起止，不依赖 antd。</p>

  <DemoBlock title="日期与范围" stack :codes="dateCodes">
    <DatePicker v-model="day" allow-clear />
    <RangePicker v-model="range" />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型']"
    :rows="[
      ['value', 'DatePicker 为 YYYY-MM-DD；RangePicker 为 [start, end]', 'string | [string, string] | null'],
      ['allowClear', '允许清空（DatePicker）', 'boolean'],
      ['placeholder', '占位', 'string'],
    ]"
  />
</template>
