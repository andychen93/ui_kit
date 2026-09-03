import { fireEvent, render, waitFor } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import ProTable from "./ProTable.svelte";

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
    const { getByText, getByPlaceholderText } = render(ProTable, {
      props: {
        service,
        columns: [{ key: "name", title: "姓名", dataIndex: "name" }],
        rowKey: "id",
        querySchema: [{ name: "name", label: "姓名", type: "input" }],
      },
    });
    await waitFor(() => expect(getByText("Alice")).toBeTruthy());
    await fireEvent.input(getByPlaceholderText("请输入"), { target: { value: "Bob" } });
    await fireEvent.click(getByText("查询"));
    await waitFor(() =>
      expect(service).toHaveBeenCalledWith(expect.objectContaining({ name: "Bob", pageNum: 1 })),
    );
  });
});
