import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import Tabs from "./Tabs.vue";
import Transfer from "./Transfer.vue";
import Login from "./Login.vue";
import AppShell from "./AppShell.vue";
import Result from "./Result.vue";

describe("layout", () => {
  it("switches tabs", async () => {
    const onChange = vi.fn();
    const wrapper = mount(Tabs, {
      props: {
        items: [
          { key: "a", label: "账号" },
          { key: "b", label: "租户" },
        ],
        active: "a",
      },
      attrs: { onChange },
    });
    await wrapper.findAll('[role="tab"]')[1].trigger("click");
    expect(wrapper.emitted("change")?.[0]).toEqual(["b"]);
  });

  it("moves transfer items", async () => {
    const wrapper = mount(Transfer, {
      props: {
        data: [
          { key: "1", label: "前端" },
          { key: "2", label: "后端" },
        ],
        modelValue: [],
      },
    });
    await wrapper.find("input[type=checkbox]").setValue(true);
    await wrapper.get('[aria-label="移到右侧"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual(["1"]);
  });

  it("submits login", async () => {
    const wrapper = mount(Login, { props: { showTenant: false } });
    await wrapper.find("input[placeholder=用户名]").setValue("admin");
    await wrapper.find("input[placeholder=密码]").setValue("123");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(wrapper.emitted("submit")?.[0]?.[0]).toEqual({ username: "admin", password: "123" });
  });

  it("toggles app shell sidebar", async () => {
    const wrapper = mount(AppShell, {
      props: {
        pinned: true,
        embed: true,
        items: [{ key: "home", label: "首页", icon: "home" }],
      },
    });
    await wrapper.get('[aria-label="收起侧栏"]').trigger("click");
    expect(wrapper.emitted("pinnedChange")?.[0]).toEqual([false]);
  });

  it("renders 403", () => {
    const wrapper = mount(Result, { props: { status: "403" } });
    expect(wrapper.text()).toContain("无权访问");
  });
});
