import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import PageSelect from "./PageSelect.vue";

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

describe("PageSelect", () => {
  it("commits the whole record when a row is clicked", async () => {
    const service = vi.fn(async ({ pageNum, pageSize }: { pageNum: number; pageSize: number }) => ({
      list: users,
      total: users.length,
      pageNum,
      pageSize,
    }));
    const wrapper = mount(PageSelect, {
      props: {
        service,
        columns: [{ key: "name", title: "姓名", dataIndex: "name" }],
        rowKey: "id",
        labelField: "name",
        searchField: "name",
      },
    });
    await wrapper.find(".ag-page-select").trigger("focusin");
    await flushPromises();
    expect(wrapper.text()).toContain("Alice");
    await wrapper.find("td").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual({ id: 1, name: "Alice" });
  });
});
