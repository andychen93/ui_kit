import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Collapse, CollapsePanel } from "./Collapse";

describe("Collapse", () => {
  it("toggles panel open state on header click", () => {
    const { container } = render(
      <Collapse defaultActiveKeys={[]}>
        <CollapsePanel panelKey="a" title="面板 A">
          内容 A
        </CollapsePanel>
        <CollapsePanel panelKey="b" title="面板 B">
          内容 B
        </CollapsePanel>
      </Collapse>,
    );

    expect(container.querySelectorAll(".ag-collapse__panel")).toHaveLength(2);
    expect(container.querySelector(".ag-collapse__body")).toBeNull();

    fireEvent.click(screen.getByText("面板 A"));
    expect(container.querySelector(".ag-collapse__body")?.textContent).toBe("内容 A");
    expect(container.querySelector(".ag-collapse__arrow")?.className).toContain("is-open");
  });

  it("accordion mode keeps only one panel open", () => {
    const { container } = render(
      <Collapse accordion defaultActiveKeys={["a"]}>
        <CollapsePanel panelKey="a" title="A">
          A
        </CollapsePanel>
        <CollapsePanel panelKey="b" title="B">
          B
        </CollapsePanel>
      </Collapse>,
    );

    expect(container.querySelectorAll(".ag-collapse__body")).toHaveLength(1);

    fireEvent.click(screen.getByText("B"));
    const bodies = container.querySelectorAll(".ag-collapse__body");
    expect(bodies).toHaveLength(1);
    expect(bodies[0].textContent).toBe("B");
  });
});
