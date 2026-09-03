<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  argonCalendarDefaults,
  toFullCalendarEvents,
  type ArgonCalendarProps,
} from "../core/config";

const props = withDefaults(defineProps<ArgonCalendarProps>(), {
  events: () => [],
  selectable: false,
  editable: false,
});

const elRef = ref<HTMLElement | null>(null);
let calendar: Calendar | null = null;

onMounted(() => {
  if (!elRef.value) return;
  calendar = new Calendar(elRef.value, {
    plugins: [dayGridPlugin, interactionPlugin],
    ...argonCalendarDefaults,
    initialView: props.initialView,
    selectable: props.selectable,
    editable: props.editable,
    events: toFullCalendarEvents(props.events),
    dateClick: (info) => props.onDateClick?.({ dateStr: info.dateStr }),
    eventClick: (info) =>
      props.onEventClick?.({
        id: info.event.id || undefined,
        title: info.event.title,
        startStr: info.event.startStr,
      }),
    eventDrop: (info) =>
      props.onEventDrop?.({
        id: info.event.id || undefined,
        title: info.event.title,
        startStr: info.event.startStr,
      }),
    ...props.options,
  });
  calendar.render();
});

onBeforeUnmount(() => calendar?.destroy());
</script>

<template>
  <div ref="elRef" class="ag-fc" />
</template>
