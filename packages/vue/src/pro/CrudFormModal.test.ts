import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import CrudFormModal from "./CrudFormModal.vue";

const fields = [
  { name: "username", label: "用户名", rules: [{ required: true, message: "请输入用户名" }] },
  { name: "status", label: "状态", type: "switch" as const },
  { name: "deptId", label: "部门", type: "select" as const, options: [{ label: "一队", value: 1 }] },
];

function makeWrapper(props: Record<string, unknown> = {}) {
  const onSuccess = vi.fn();
  const onSubmit = vi.fn().mockResolvedValue(undefined);
  const wrapper = mount(CrudFormModal, {
    props: {
      open: true,
      recordId: null,
      fields,
      title: "用户",
      onSubmit,
      onSuccess,
      onCancel: () => {},
      ...props,
    },
    attachTo: document.body,
  });
  return { wrapper, onSubmit, onSuccess };
}

function q(sel: string) {
  return document.querySelector(sel);
}
function qAll(sel: string) {
  return Array.from(document.querySelectorAll(sel));
}

describe("CrudFormModal", () => {
  it("shows create title and blocks required submit", async () => {
    const { wrapper, onSubmit } = makeWrapper();
    expect(q(".ag-modal__title")?.textContent).toBe("新增用户");

    (q(".ag-modal__footer .ag-btn--primary") as HTMLElement)?.click();
    await new Promise((r) => setTimeout(r, 20));

    expect(q(".ag-form-item.is-error")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("shows edit title and backfills from onLoad (switch 0/1→boolean)", async () => {
    const onLoad = vi.fn().mockResolvedValue({ username: "陈立", status: 1, deptId: 1 });
    const { wrapper } = makeWrapper({ recordId: 42, onLoad });
    await new Promise((r) => setTimeout(r, 20));

    expect(q(".ag-modal__title")?.textContent).toBe("编辑用户");
    expect(onLoad).toHaveBeenCalledWith(42);
    expect(q(".ag-switch")?.getAttribute("aria-checked")).toBe("true");
    wrapper.unmount();
  });

  it("submits converted values (switch boolean→1/0) and fires success", async () => {
    const { wrapper, onSubmit, onSuccess } = makeWrapper();
    const input = q(".ag-form input") as HTMLInputElement;
    input.value = "陈立";
    input.dispatchEvent(new Event("input"));
    await new Promise((r) => setTimeout(r, 10));
    (q(".ag-switch") as HTMLElement)?.click();
    await new Promise((r) => setTimeout(r, 10));

    (q(".ag-modal__footer .ag-btn--primary") as HTMLElement)?.click();
    await new Promise((r) => setTimeout(r, 20));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ username: "陈立", status: 1 }),
      false,
    );
    expect(onSuccess).toHaveBeenCalled();
    wrapper.unmount();
  });
});
