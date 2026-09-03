import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import DatePicker from "./DatePicker.vue";

describe("DatePicker", () => {
  it("picks a day", async () => {
    const wrapper = mount(DatePicker, { props: { modelValue: "2026-08-01" } });
    await wrapper.find('[role="combobox"]').trigger("click");
    const days = wrapper.findAll(".ag-calendar__day").filter((b) => b.text() === "28");
    await days[0].trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["2026-08-28"]);
  });
});
