<script setup lang="ts">
import { ArgonCalendar } from "@argon-kit/calendar/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const events = [
  { id: "1", title: "车辆年检", start: "2026-08-05", variant: "warning" as const },
  { id: "2", title: "保养提醒", start: "2026-08-12", variant: "info" as const },
  { id: "3", title: "车队安全培训", start: "2026-08-18", variant: "primary" as const },
  { id: "4", title: "保险续期", start: "2026-08-25", variant: "danger" as const },
];

const codes = {
  vue: `import { ArgonCalendar } from "@argon-kit/calendar/vue";

<ArgonCalendar
  :events="[{ title: '保养', start: '2026-08-12', variant: 'info' }]"
  selectable
  @date-click="onDateClick"
/>`,
  react: `import { ArgonCalendar } from "@argon-kit/calendar/react";

<ArgonCalendar
  events={[{ title: "保养", start: "2026-08-12", variant: "info" }]}
  selectable
  onDateClick={onDateClick}
/>`,
  svelte: `import { ArgonCalendar } from "@argon-kit/calendar/svelte";

<ArgonCalendar
  events={[{ title: '保养', start: '2026-08-12', variant: 'info' }]}
  selectable
  ondateclick={onDateClick}
/>`,
};
</script>

<template>
  <h1>Calendar 日历</h1>
  <p class="doc-lead">
    FullCalendar 6 底座 + Argon 皮肤（灰底表头、主色今日、圆角事件）。
    独立包 <code>@argon-kit/calendar</code>。
  </p>

  <DemoBlock title="月视图 + 语义色事件" :codes="codes">
    <ArgonCalendar :events="events" />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['events', '事件列表', '{ title / start / end? / variant? }[]', '[]'],
      ['variant', '事件语义色', 'primary / info / success / warning / danger', 'primary'],
      ['initialView', '初始视图', 'dayGridMonth 等', 'dayGridMonth'],
      ['selectable / editable', '可框选 / 可拖拽', 'boolean', 'false'],
      ['dateClick / eventClick / eventDrop', '交互回调', 'event', '—'],
      ['options', '透传 FullCalendar options', 'object', '—'],
    ]"
  />
</template>
