import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Button from "./Button.svelte";

describe("Button", () => {
  it("renders primary class by default", () => {
    const { container } = render(Button);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("ag-btn");
    expect(btn?.className).toContain("ag-btn--primary");
  });

  it("applies gradient and size classes", () => {
    const { container } = render(Button, {
      props: { variant: "gradient-info", size: "lg" },
    });
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("ag-btn--gradient-info");
    expect(btn?.className).toContain("ag-btn--lg");
  });

  it("disables and shows loading class", () => {
    const { container } = render(Button, { props: { loading: true } });
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain("ag-btn--loading");
  });

  it("injects brand svg for social variant", () => {
    const { container } = render(Button, {
      props: { variant: "social-github" },
    });
    expect(container.querySelector("svg.ag-btn__icon")).toBeTruthy();
  });
});
