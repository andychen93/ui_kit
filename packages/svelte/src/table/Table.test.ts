import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Table from "./Table.svelte";

describe("Table", () => {
  it("renders headers and rows", () => {
    const { getByText } = render(Table, {
      props: {
        columns: [{ key: "name", title: "姓名", dataIndex: "name" }],
        data: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ],
        rowKey: "id",
      },
    });
    expect(getByText("姓名")).toBeTruthy();
    expect(getByText("Alice")).toBeTruthy();
  });
});
