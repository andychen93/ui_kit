import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, reactive, ref } from "vue";
import Form from "./Form.vue";
import FormItem from "./FormItem.vue";
import Input from "../input/Input.vue";

/** 宿主组件：把 model 暴露给模板作用域 */
function makeHost(initial: Record<string, unknown>, rules: Record<string, unknown>) {
  return defineComponent({
    components: { Form, FormItem, Input },
    setup() {
      const model = reactive({ ...initial });
      const formRef = ref<InstanceType<typeof Form> | null>(null);
      return { model, rules, formRef };
    },
    template: `
      <Form ref="formRef" :model="model" :rules="rules">
        <FormItem name="username" label="用户名">
          <Input v-model="model.username" />
        </FormItem>
      </Form>
    `,
  });
}

describe("Form / FormItem", () => {
  it("validate marks errors and auto-clears on fix", async () => {
    const wrapper = mount(
      makeHost({ username: "" }, { username: [{ required: true, message: "请输入用户名" }] }),
    );
    const form = (wrapper.findComponent(Form).vm as unknown as {
      validate: () => Promise<Record<string, unknown>>;
    });

    await expect(form.validate()).rejects.toEqual({ username: "请输入用户名" });
    await new Promise((r) => setTimeout(r, 0));
    expect(wrapper.find(".ag-form-item.is-error").exists()).toBe(true);
    expect(wrapper.find(".ag-form-item__error").text()).toBe("请输入用户名");

    // 修正后自动清错 + 校验通过
    await wrapper.find("input").setValue("陈立");
    await new Promise((r) => setTimeout(r, 10));
    await expect(form.validate()).resolves.toEqual({ username: "陈立" });
    expect(wrapper.find(".ag-form-item.is-error").exists()).toBe(false);
  });

  it("resetFields restores initial snapshot and clears errors", async () => {
    const wrapper = mount(
      makeHost({ username: "初始" }, { username: [{ required: true, message: "必填" }] }),
    );
    const form = wrapper.findComponent(Form).vm as unknown as {
      validate: () => Promise<unknown>;
      resetFields: () => void;
    };

    await wrapper.find("input").setValue("");
    await expect(form.validate()).rejects.toBeTruthy();
    form.resetFields();
    await new Promise((r) => setTimeout(r, 10));
    expect((wrapper.findComponent(Form).props("model") as Record<string, unknown>).username).toBe(
      "初始",
    );
    expect(wrapper.find(".ag-form-item.is-error").exists()).toBe(false);
  });
});
