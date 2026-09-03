import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import TagsInput from "./tags/vue/TagsInput.vue";
import SelectMultipleVue from "./select/vue/SelectMultiple.vue";
import CarouselVue from "./carousel/vue/Carousel.vue";
import { regionColor, regionStats, worldRegions } from "./core/worldMap";

describe("TagsInput (vue)", () => {
  it("adds a tag on Enter and removes via × (controlled)", async () => {
    let current: string[] = [];
    const wrapper = mount(TagsInput, {
      props: {
        value: current,
        "onUpdate:modelValue": (v: string[]) => {
          current = v;
          wrapper.setProps({ value: v });
        },
      },
    });
    const input = wrapper.find("input");
    await input.setValue("前端");
    await input.trigger("keydown", { key: "Enter" });
    expect(current).toEqual(["前端"]);
    await wrapper.setProps({ value: current });
    expect(wrapper.findAll(".ag-tags__tag")).toHaveLength(1);

    await wrapper.find(".ag-tags__remove").trigger("click");
    expect(current).toEqual([]);
  });

  it("enforces onlyUnique", async () => {
    const updates: string[][] = [];
    const wrapper = mount(TagsInput, {
      props: {
        value: ["a"],
        onlyUnique: true,
        "onUpdate:modelValue": (v: string[]) => updates.push(v),
      },
    });
    await wrapper.find("input").setValue("a");
    await wrapper.find("input").trigger("keydown", { key: "Enter" });
    expect(updates).toHaveLength(0); // 重复值不加入
  });
});

describe("SelectMultiple (vue)", () => {
  it("toggles options and renders chips (controlled)", async () => {
    let current: string[] = [];
    const wrapper = mount(SelectMultipleVue, {
      props: {
        options: [
          { value: "a", label: "选项 A" },
          { value: "b", label: "选项 B" },
        ],
        value: current,
        "onUpdate:modelValue": (v: string[]) => {
          current = v;
          wrapper.setProps({ value: v });
        },
      },
    });
    expect(wrapper.find(".ag-multiselect__placeholder").exists()).toBe(true);
    await wrapper.findAll('input[type="checkbox"]')[0].setValue(true);
    expect(current).toEqual(["a"]);
    await wrapper.setProps({ value: current });
    expect(wrapper.find(".ag-multiselect__placeholder").exists()).toBe(false);
    expect(wrapper.findAll(".ag-multiselect__chip")).toHaveLength(1);
  });
});

describe("Carousel (vue)", () => {
  it("renders slides and switches via controls", async () => {
    const wrapper = mount(CarouselVue, {
      props: {
        interval: 0,
        items: [
          { key: "1", content: "一" },
          { key: "2", content: "二" },
          { key: "3", content: "三" },
        ],
      },
    });
    expect(wrapper.findAll(".ag-carousel__item")).toHaveLength(3);
    await wrapper.find(".ag-carousel__control--next").trigger("click");
    expect(wrapper.find(".ag-carousel__indicator.is-active")).toBeTruthy();
  });
});

describe("worldMap core", () => {
  it("maps values onto the primary→info color ramp", () => {
    expect(regionColor(undefined, 100)).toBe("#e9ecef");
    expect(regionColor(0, 100)).toBe("rgb(94, 114, 228)");
    expect(regionColor(100, 100)).toBe("rgb(17, 205, 239)");
  });

  it("computes stats and has 7 regions", () => {
    expect(worldRegions).toHaveLength(7);
    expect(regionStats({ NA: 10, EU: 30 })).toEqual({ max: 30, total: 40 });
    expect(regionStats(undefined)).toEqual({ max: 0, total: 0 });
  });
});
