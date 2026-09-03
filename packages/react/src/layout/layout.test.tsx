import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { Tabs } from "./Tabs";
import { Login } from "./Login";
import { Transfer } from "./Transfer";
import { Result } from "./Result";

describe("layout", () => {
  it("switches tabs", () => {
    const onChange = vi.fn();
    render(
      <Tabs
        items={[
          { key: "a", label: "账号" },
          { key: "b", label: "租户" },
        ]}
        active="a"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: "租户" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("moves transfer items", () => {
    const onChange = vi.fn();
    render(
      <Transfer
        data={[
          { key: "1", label: "前端" },
          { key: "2", label: "后端" },
        ]}
        value={[]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("前端"));
    fireEvent.click(screen.getByRole("button", { name: "移到右侧" }));
    expect(onChange).toHaveBeenCalledWith(["1"]);
  });

  it("submits login", () => {
    const onSubmit = vi.fn();
    render(<Login showTenant={false} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("用户名"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("密码"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "登录" }));
    expect(onSubmit).toHaveBeenCalledWith({ username: "admin", password: "123" });
  });

  it("toggles app shell sidebar", () => {
    const onPinned = vi.fn();
    render(
      <AppShell
        pinned
        onPinnedChange={onPinned}
        items={[{ key: "home", label: "首页", icon: "home" }]}
        embed
      >
        内容
      </AppShell>,
    );
    fireEvent.click(screen.getByRole("button", { name: "收起侧栏" }));
    expect(onPinned).toHaveBeenCalledWith(false);
    fireEvent.click(screen.getByText("首页"));
  });

  it("renders 403", () => {
    render(<Result status="403" />);
    expect(screen.getByText("无权访问")).toBeTruthy();
  });
});
