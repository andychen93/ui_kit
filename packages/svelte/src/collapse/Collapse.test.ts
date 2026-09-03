import { fireEvent } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { mount, unmount } from "svelte";
import CollapseHarness from "./CollapseHarness.svelte";
import SweetAlert from "../feedback/SweetAlert.svelte";

function mountHarness(props: Record<string, unknown> = {}) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const api: { value?: string[] } = {};
  const component = mount(CollapseHarness, {
    target: host,
    props: { ...props, ...("value" in props ? {} : {}) },
  });
  return {
    host,
    component,
    cleanup: () => {
      unmount(component);
      host.remove();
    },
  };
}

describe("Collapse", () => {
  it("toggles panel open state via bindable value", async () => {
    const { host, cleanup } = mountHarness();
    expect(host.querySelectorAll(".ag-collapse__panel")).toHaveLength(2);
    expect(host.querySelector(".ag-collapse__body")).toBeNull();

    await fireEvent.click(host.querySelectorAll(".ag-collapse__header")[0]);
    expect(host.querySelector(".ag-collapse__body")?.textContent).toBe("内容 A");
    expect(host.querySelector(".ag-collapse__arrow")?.className).toContain("is-open");
    cleanup();
  });

  it("accordion mode keeps only one panel open", async () => {
    let state = { value: ["a"] };
    const host = document.createElement("div");
    document.body.appendChild(host);
    const component = mount(CollapseHarness, {
      target: host,
      props: { value: state.value, accordion: true },
    });
    expect(host.querySelectorAll(".ag-collapse__body")).toHaveLength(1);

    await fireEvent.click(host.querySelectorAll(".ag-collapse__header")[1]);
    const bodies = host.querySelectorAll(".ag-collapse__body");
    expect(bodies).toHaveLength(1);
    expect(bodies[0].textContent).toBe("内容 B");
    unmount(component);
    host.remove();
  });
});

describe("SweetAlert", () => {
  it("renders mask and gradient icon when open", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const component = mount(SweetAlert, {
      target: host,
      props: { open: true, type: "success", title: "已保存", content: "数据写入成功" },
    });
    expect(host.querySelector(".ag-swal-mask")).toBeTruthy();
    expect(host.querySelector(".ag-swal--success .ag-swal__icon")).toBeTruthy();
    expect(host.querySelector(".ag-swal__title")?.textContent).toBe("已保存");
    unmount(component);
    host.remove();
  });
});
