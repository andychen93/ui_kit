import { useEffect, useRef } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  argonCalendarDefaults,
  toFullCalendarEvents,
  type ArgonCalendarProps,
} from "../core/config";

export function ArgonCalendar({
  events = [],
  initialView,
  selectable = false,
  editable = false,
  options,
  onDateClick,
  onEventClick,
  onEventDrop,
}: ArgonCalendarProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const cbRef = useRef({ onDateClick, onEventClick, onEventDrop });
  cbRef.current = { onDateClick, onEventClick, onEventDrop };

  useEffect(() => {
    if (!elRef.current) return;
    const calendar = new Calendar(elRef.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      ...argonCalendarDefaults,
      initialView,
      selectable,
      editable,
      events: toFullCalendarEvents(events),
      dateClick: (info) => cbRef.current.onDateClick?.({ dateStr: info.dateStr }),
      eventClick: (info) =>
        cbRef.current.onEventClick?.({
          id: info.event.id || undefined,
          title: info.event.title,
          startStr: info.event.startStr,
        }),
      eventDrop: (info) =>
        cbRef.current.onEventDrop?.({
          id: info.event.id || undefined,
          title: info.event.title,
          startStr: info.event.startStr,
        }),
      ...options,
    });
    calendar.render();
    return () => calendar.destroy();
  }, [events, initialView, selectable, editable, options]);

  return <div ref={elRef} className="ag-fc" />;
}
