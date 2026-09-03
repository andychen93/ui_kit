import { fireEvent, render, waitFor } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import PageSelect from "./PageSelect.svelte";

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
    const { getByPlaceholderText, getByText } = render(PageSelect, {
      props: {
        service,
        columns: [{ key: "name", title: "姓名", dataIndex: "name" }],
        rowKey: "id",
        labelField: "name",
        searchField: "name",
      },
    });
    const input = getByPlaceholderText("请选择");
    await fireEvent.focusIn(input);
    await waitFor(() => expect(getByText("Alice")).toBeTruthy());
    await fireEvent.click(getByText("Alice"));
    await waitFor(() => expect((input as HTMLInputElement).value).toBe("Alice"));
  });
});
