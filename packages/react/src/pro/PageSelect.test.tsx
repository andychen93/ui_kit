import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageSelect } from "./PageSelect";

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

function mockService({ pageNum, pageSize, name }: { pageNum: number; pageSize: number; name?: unknown }) {
  const kw = String(name ?? "");
  const list = users.filter((u) => !kw || u.name.includes(kw));
  return Promise.resolve({
    list: list.slice(0, pageSize),
    total: list.length,
    pageNum,
    pageSize,
  });
}

describe("PageSelect", () => {
  it("commits the whole record when a row is clicked", async () => {
    const onChange = vi.fn();
    const service = vi.fn(mockService);
    render(
      <PageSelect
        service={service}
        columns={[{ key: "name", title: "姓名", dataIndex: "name" }]}
        rowKey="id"
        labelField="name"
        searchField="name"
        onChange={onChange}
      />,
    );
    fireEvent.focus(screen.getByPlaceholderText("请选择"));
    await waitFor(() => expect(screen.getByText("Alice")).toBeTruthy());
    fireEvent.click(screen.getByText("Alice"));
    expect(onChange).toHaveBeenCalledWith({ id: 1, name: "Alice" });
  });

  it("debounces keyword search", async () => {
    const service = vi.fn(mockService);
    render(
      <PageSelect
        service={service}
        columns={[{ key: "name", title: "姓名", dataIndex: "name" }]}
        rowKey="id"
        labelField="name"
        searchField="name"
      />,
    );
    fireEvent.change(screen.getByPlaceholderText("请选择"), { target: { value: "Al" } });
    await waitFor(() => expect(service).toHaveBeenCalledWith(expect.objectContaining({ name: "Al" })));
  });
});
