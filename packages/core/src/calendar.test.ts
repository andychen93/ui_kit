import { describe, expect, it } from "vitest";
import { formatYMD, monthGrid, parseYMD, ymd } from "./calendar";

describe("calendar", () => {
  it("formats and parses", () => {
    expect(formatYMD(new Date(2026, 7, 28))).toBe("2026-08-28");
    expect(parseYMD("2026-08-28")?.getDate()).toBe(28);
  });

  it("builds August 2026 grid starting Saturday", () => {
    const g = monthGrid(2026, 7);
    expect(g[6]).toBe(1);
    expect(ymd(2026, 7, 28)).toBe("2026-08-28");
  });
});
