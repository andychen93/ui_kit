import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Input from "./Input.vue";

describe("Input", () => {
  it("shows error hint", () => {
    const wrapper = mount(Input, {
      props: { placeholder: "姓名", status: "error", hint: "必填" },
    });
    expect(wrapper.find(".ag-field__hint").text()).toBe("必填");
    expect(wrapper.find(".ag-field__hint").classes()).toContain("is-error");
  });
});
