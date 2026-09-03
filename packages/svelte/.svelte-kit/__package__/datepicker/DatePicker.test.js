import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import DatePicker from "./DatePicker.svelte";
import { fireEvent } from "@testing-library/svelte";
describe("DatePicker", () => {
    it("picks a day", async () => {
        const { container } = render(DatePicker, { props: { value: "2026-08-01" } });
        await fireEvent.click(container.querySelector('[role="combobox"]'));
        const day = [...container.querySelectorAll(".ag-calendar__day")].find((el) => el.textContent === "28");
        await fireEvent.click(day);
        expect(container.querySelector(".ag-select__value").textContent?.trim()).toBe("2026-08-28");
    });
});
