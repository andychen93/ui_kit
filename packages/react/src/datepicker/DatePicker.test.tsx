import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("picks a day", () => {
    const onChange = vi.fn();
    render(<DatePicker value="2026-08-01" onChange={onChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("button", { name: "28" }));
    expect(onChange).toHaveBeenCalledWith("2026-08-28");
  });
});
