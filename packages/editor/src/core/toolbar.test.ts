import { describe, expect, it } from "vitest";
import { defaultToolbar } from "./toolbar";

describe("editor toolbar", () => {
  it("provides the Argon-flavored compact default toolbar", () => {
    expect(Array.isArray(defaultToolbar)).toBe(true);
    expect(defaultToolbar.flat()).toContain("bold");
    expect(defaultToolbar.flat()).toContain("image");
    expect(defaultToolbar.flat()).toContain("clean");
  });
});
