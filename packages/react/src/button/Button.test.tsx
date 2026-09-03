import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders primary class by default", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn.className).toContain("ag-btn");
    expect(btn.className).toContain("ag-btn--primary");
  });

  it("applies gradient and size classes", () => {
    render(
      <Button variant="gradient-info" size="lg">
        Go
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn.className).toContain("ag-btn--gradient-info");
    expect(btn.className).toContain("ag-btn--lg");
  });

  it("disables and shows loading class", () => {
    render(<Button loading>Wait</Button>);
    const btn = screen.getByRole("button", { name: "Wait" }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain("ag-btn--loading");
  });

  it("injects brand svg for social variant", () => {
    const { container } = render(
      <Button variant="social-github">GitHub</Button>,
    );
    expect(container.querySelector("svg.ag-btn__icon")).toBeTruthy();
  });
});
