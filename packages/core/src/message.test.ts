import { describe, expect, it } from "vitest";
import { message } from "@argon-kit/core";

describe("message", () => {
  it("appends a toast to the document", () => {
    message.success("已保存", 50);
    expect(document.querySelector(".ag-message--success")?.textContent).toBe("已保存");
  });
});
