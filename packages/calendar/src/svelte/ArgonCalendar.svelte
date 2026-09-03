<script lang="ts">
  import { onMount } from "svelte";
  import { Calendar } from "@fullcalendar/core";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import {
    argonCalendarDefaults,
    toFullCalendarEvents,
    type ArgonCalendarProps,
  } from "../core/config";

  let {
    events = [],
    initialView,
    selectable = false,
    editable = false,
    options,
    ondateclick,
    oneventclick,
    oneventdrop,
  }: ArgonCalendarProps & {
    ondateclick?: ArgonCalendarProps["onDateClick"];
    oneventclick?: ArgonCalendarProps["onEventClick"];
    oneventdrop?: ArgonCalendarProps["onEventDrop"];
  } = $props();

  let el: HTMLDivElement;

  onMount(() => {
    if (!el) return;
    const calendar = new Calendar(el, {
      plugins: [dayGridPlugin, interactionPlugin],
      ...argonCalendarDefaults,
      initialView,
      selectable,
      editable,
      events: toFullCalendarEvents(events),
      dateClick: (info) => ondateclick?.({ dateStr: info.dateStr }),
      eventClick: (info) =>
        oneventclick?.({
          id: info.event.id || undefined,
          title: info.event.title,
          startStr: info.event.startStr,
        }),
      eventDrop: (info) =>
        oneventdrop?.({
          id: info.event.id || undefined,
          title: info.event.title,
          startStr: info.event.startStr,
        }),
      ...options,
    });
    calendar.render();
    return () => calendar.destroy();
  });
</script>

<div bind:this={el} class="ag-fc"></div>
