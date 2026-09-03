import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";
import { Password } from "./Password";

describe("Input", () => {
  it("renders placeholder and hint error", () => {
    render(<Input placeholder="姓名" status="error" hint="必填" />);
    expect(screen.getByPlaceholderText("姓名")).toBeTruthy();
    expect(screen.getByText("必填").className).toContain("is-error");
  });

  it("toggles password visibility", () => {
    render(<Password placeholder="密码" />);
    const input = screen.getByPlaceholderText("密码") as HTMLInputElement;
    expect(input.type).toBe("password");
    fireEvent.click(screen.getByRole("button", { name: "显示密码" }));
    expect(input.type).toBe("text");
  });
});
