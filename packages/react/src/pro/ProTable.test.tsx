import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProTable } from "./ProTable";

const rows = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

describe("ProTable", () => {
  it("loads rows and searches", async () => {
    const service = vi.fn(async ({ name, pageNum, pageSize }: { name?: unknown; pageNum: number; pageSize: number }) => {
      const kw = String(name ?? "");
      const list = rows.filter((u) => !kw || u.name.includes(kw));
      return { list, total: list.length, pageNum, pageSize };
    });
    render(
      <ProTable
        service={service}
        columns={[{ key: "name", title: "姓名", dataIndex: "name" }]}
        rowKey="id"
        querySchema={[{ name: "name", label: "姓名", type: "input" }]}
      />,
    );
    await waitFor(() => expect(screen.getByText("Alice")).toBeTruthy());
    fireEvent.change(screen.getByPlaceholderText("请输入"), { target: { value: "Bob" } });
    fireEvent.click(screen.getByText("查询"));
    await waitFor(() =>
      expect(service).toHaveBeenCalledWith(expect.objectContaining({ name: "Bob", pageNum: 1 })),
    );
  });
});
