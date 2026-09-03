import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import ProTable from "./ProTable.vue";

describe("ProTable", () => {
  it("loads rows and searches", async () => {
    const service = vi.fn(async (params: { name?: unknown; pageNum: number; pageSize: number }) => {
      const all = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];
      const kw = String(params.name ?? "");
      const list = all.filter((u) => !kw || u.name.includes(kw));
      return { list, total: list.length, pageNum: params.pageNum, pageSize: params.pageSize };
    });
    const wrapper = mount(ProTable, {
      props: {
        service,
        columns: [{ key: "name", title: "姓名", dataIndex: "name" }],
        rowKey: "id",
        querySchema: [{ name: "name", label: "姓名", type: "input" }],
      },
    });
    await flushPromises();
    expect(wrapper.text()).toContain("Alice");
    await wrapper.find("input").setValue("Bob");
    await wrapper.findAll("button").find((b) => b.text() === "查询")!.trigger("click");
    await flushPromises();
    expect(service).toHaveBeenCalledWith(expect.objectContaining({ name: "Bob", pageNum: 1 }));
  });
});
