import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import Collapse from "./Collapse.vue";
import CollapsePanel from "./CollapsePanel.vue";

describe("Collapse", () => {
  it("renders panels and toggles open state via v-model", async () => {
    const active = ref<string[]>([]);
    const wrapper = mount(Collapse, {
      props: {
        modelValue: active.value,
        "onUpdate:modelValue": (v: string[]) => {
          active.value = v;
          wrapper.setProps({ modelValue: v });
        },
      },
      slots: {
        default: `
          <CollapsePanel panel-key="a" title="面板 A">内容 A</CollapsePanel>
          <CollapsePanel panel-key="b" title="面板 B">内容 B</CollapsePanel>
        `,
      },
      global: { components: { CollapsePanel } },
    });

    expect(wrapper.findAll(".ag-collapse__panel")).toHaveLength(2);
    expect(wrapper.find(".ag-collapse__body").exists()).toBe(false);

    await wrapper.findAll(".ag-collapse__header")[0].trigger("click");
    expect(wrapper.find(".ag-collapse__body").text()).toBe("内容 A");
    expect(wrapper.find(".ag-collapse__arrow").classes()).toContain("is-open");
  });

  it("accordion mode keeps only one panel open", async () => {
    const active = ref<string[]>(["a"]);
    const wrapper = mount(Collapse, {
      props: {
        modelValue: active.value,
        accordion: true,
        "onUpdate:modelValue": (v: string[]) => {
          active.value = v;
          wrapper.setProps({ modelValue: v });
        },
      },
      slots: {
        default: `
          <CollapsePanel panel-key="a" title="A">A</CollapsePanel>
          <CollapsePanel panel-key="b" title="B">B</CollapsePanel>
        `,
      },
      global: { components: { CollapsePanel } },
    });

    expect(wrapper.findAll(".ag-collapse__body")).toHaveLength(1);

    await wrapper.findAll(".ag-collapse__header")[1].trigger("click");
    const bodies = wrapper.findAll(".ag-collapse__body");
    expect(bodies).toHaveLength(1);
    expect(bodies[0].text()).toBe("B");
  });
});
