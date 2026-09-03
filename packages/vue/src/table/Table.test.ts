import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Table from "./Table.vue";
import type { SortableColumn } from "./types";

describe("Table", () => {
  it("renders headers and rows", () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ key: "name", title: "姓名", dataIndex: "name" }],
        data: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ],
        rowKey: "id",
      },
    });
    expect(wrapper.text()).toContain("姓名");
    expect(wrapper.text()).toContain("Alice");
  });
});

describe("Table enhancements", () => {
  const rows = [
    { id: 1, name: "B车", remark: "r1", ops: "编辑" },
    { id: 2, name: "A车", remark: "r2", ops: "编辑" },
  ];

  it("applies fixed/align/ellipsis classes and scroll container", () => {
    const cols = [
      { key: "name", title: "名称", dataIndex: "name", fixed: "left" as const, width: 120 },
      { key: "remark", title: "备注", dataIndex: "remark", ellipsis: true },
      { key: "ops", title: "操作", dataIndex: "ops", fixed: "right" as const, width: 160, align: "center" as const },
    ];
    const wrapper = mount(Table, { props: { columns: cols, data: rows, rowKey: "id", scrollX: 600 } });
    expect(wrapper.find(".ag-table-scroll").attributes("style")).toContain("min-width");
    expect(wrapper.find("th.ag-table__cell--fixed-left").exists()).toBe(true);
    expect(wrapper.find("th.ag-table__cell--fixed-right").exists()).toBe(true);
    expect(wrapper.find("th.is-align-center").exists()).toBe(true);
    expect(wrapper.find(".ag-table__ellipsis").exists()).toBe(true);
  });

  it("sorts locally through three states", async () => {
    const cols: SortableColumn<Record<string, unknown>>[] = [
      {
        key: "name",
        title: "名称",
        dataIndex: "name",
        sorter: (a, b) => String(a.name).localeCompare(String(b.name)),
      },
    ];
    const wrapper = mount(Table, {
      props: {
        columns: cols,
        data: rows as unknown as Record<string, unknown>[],
        rowKey: "id",
      },
    });
    const th = wrapper.find("th.ag-table__th-sorter");
    expect(wrapper.find("tbody tr td").text()).toBe("B车");
    await th.trigger("click");
    expect(wrapper.find("tbody tr td").text()).toBe("A车");
    await th.trigger("click");
    expect(wrapper.find("tbody tr td").text()).toBe("B车");
    await th.trigger("click");
    expect(wrapper.find("tbody tr td").text()).toBe("B车");
  });
});
