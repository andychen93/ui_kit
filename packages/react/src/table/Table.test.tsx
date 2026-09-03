import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table } from "./Table";

const rows = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

describe("Table", () => {
  it("renders headers and rows", () => {
    render(
      <Table
        columns={[
          { key: "name", title: "姓名", dataIndex: "name" },
          { key: "id", title: "ID", dataIndex: "id" },
        ]}
        data={rows}
        rowKey="id"
      />,
    );
    expect(screen.getByText("姓名")).toBeTruthy();
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
  });
});
