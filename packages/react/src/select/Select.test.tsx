import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { label: "北京", value: "bj" },
  { label: "上海", value: "sh" },
];

describe("Select", () => {
  it("opens dropdown and selects option", () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} placeholder="城市" />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "上海" }));
    expect(onChange).toHaveBeenCalledWith("sh");
  });
});
