import { describe, expect, it } from "vitest";
import { argonCalendarDefaults, toFullCalendarEvents } from "./config";

describe("calendar config", () => {
  it("defaults use dayGridMonth and monday start", () => {
    expect(argonCalendarDefaults.initialView).toBe("dayGridMonth");
    expect(argonCalendarDefaults.firstDay).toBe(1);
  });

  it("maps variant to ag-fc-event class names", () => {
    const out = toFullCalendarEvents([
      { title: "保养", start: "2026-08-28", variant: "success" },
      { title: "普通", start: "2026-08-29" },
    ]);
    expect(out[0].classNames).toEqual(["ag-fc-event--success"]);
    expect(out[1].classNames).toBeUndefined();
  });
});
