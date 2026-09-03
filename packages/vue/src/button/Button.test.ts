import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Button from "./Button.vue";

describe("Button", () => {
  it("renders primary class by default", () => {
    const wrapper = mount(Button, { slots: { default: "Save" } });
    expect(wrapper.classes()).toContain("ag-btn");
    expect(wrapper.classes()).toContain("ag-btn--primary");
    expect(wrapper.text()).toBe("Save");
  });

  it("applies gradient and size classes", () => {
    const wrapper = mount(Button, {
      props: { variant: "gradient-info", size: "lg" },
      slots: { default: "Go" },
    });
    expect(wrapper.classes()).toContain("ag-btn--gradient-info");
    expect(wrapper.classes()).toContain("ag-btn--lg");
  });

  it("disables and shows loading class", () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: "Wait" },
    });
    expect(wrapper.attributes("disabled")).toBeDefined();
    expect(wrapper.classes()).toContain("ag-btn--loading");
  });

  it("injects brand svg for social variant", () => {
    const wrapper = mount(Button, {
      props: { variant: "social-github" },
      slots: { default: "GitHub" },
    });
    expect(wrapper.find("svg.ag-btn__icon").exists()).toBe(true);
  });
});
