import { describe, expect, it, vi } from "vitest";
import { notification } from "@argon-kit/core";

describe("notification", () => {
  it("appends a notification with title and accent", () => {
    notification.success({ title: "已保存", content: "数据已写入", duration: 50 });
    const el = document.querySelector(".ag-notification--success");
    expect(el).not.toBeNull();
    expect(el?.querySelector(".ag-notification__title")?.textContent).toBe("已保存");
    expect(el?.querySelector(".ag-notification__content")?.textContent).toBe("数据已写入");
    expect(el?.querySelector(".ag-notification__accent")).not.toBeNull();
  });

  it("supports manual close via the close button", () => {
    notification.warning({ title: "注意", duration: 0 });
    const el = document.querySelector(".ag-notification--warning");
    expect(el).not.toBeNull();
    el?.querySelector<HTMLButtonElement>(".ag-notification__close")?.click();
    expect(el?.classList.contains("is-closing")).toBe(true);
  });

  it("auto closes after duration", () => {
    vi.useFakeTimers();
    notification.info({ title: "自动关闭", duration: 100 });
    const el = document.querySelector(".ag-notification--info");
    expect(el).not.toBeNull();
    vi.advanceTimersByTime(350);
    expect(document.querySelector(".ag-notification--info")).toBeNull();
    vi.useRealTimers();
  });
});
