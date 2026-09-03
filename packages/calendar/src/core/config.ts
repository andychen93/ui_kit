import type { CalendarOptions } from "@fullcalendar/core";

/** Argon 风格默认配置（对应我们 vendors.css 的 .ag-fc 覆写） */
export const argonCalendarDefaults: CalendarOptions = {
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "title",
    center: "",
    right: "prev,next today",
  },
  height: "auto",
  firstDay: 1,
  dayMaxEventRows: 3,
  fixedWeekCount: false,
};

export interface ArgonCalendarProps {
  events?: Array<{
    id?: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    /** 语义色 class：ag-fc-event--primary/info/success/warning/danger */
    variant?: "primary" | "info" | "success" | "warning" | "danger";
  }>;
  initialView?: string;
  selectable?: boolean;
  editable?: boolean;
  /** 覆盖额外 FullCalendar options */
  options?: CalendarOptions;
  onDateClick?: (info: { dateStr: string }) => void;
  onEventClick?: (info: { id?: string; title: string; startStr?: string }) => void;
  onEventDrop?: (info: { id?: string; title: string; startStr?: string }) => void;
}

export function toFullCalendarEvents(
  events: NonNullable<ArgonCalendarProps["events"]>,
): Array<Record<string, unknown>> {
  return events.map(({ variant, ...rest }) => ({
    ...rest,
    ...(variant ? { classNames: [`ag-fc-event--${variant}`] } : {}),
  }));
}
