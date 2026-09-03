import { fireEvent, render } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import Tabs from "./Tabs.svelte";
import Transfer from "./Transfer.svelte";
import Login from "./Login.svelte";
import Result from "./Result.svelte";
describe("layout", () => {
    it("switches tabs", async () => {
        const onchange = vi.fn();
        const { getByRole } = render(Tabs, {
            props: {
                items: [
                    { key: "a", label: "账号" },
                    { key: "b", label: "租户" },
                ],
                active: "a",
                onchange,
            },
        });
        await fireEvent.click(getByRole("tab", { name: "租户" }));
        expect(onchange).toHaveBeenCalledWith("b");
    });
    it("moves transfer items", async () => {
        const { getByText, getByRole } = render(Transfer, {
            props: {
                data: [
                    { key: "1", label: "前端" },
                    { key: "2", label: "后端" },
                ],
                value: [],
            },
        });
        await fireEvent.click(getByText("前端"));
        await fireEvent.click(getByRole("button", { name: "移到右侧" }));
        expect(getByText("已选（1）")).toBeTruthy();
        expect(getByText("前端")).toBeTruthy();
    });
    it("submits login", async () => {
        const onsubmit = vi.fn();
        const { getByPlaceholderText, getByRole } = render(Login, {
            props: { showTenant: false, onsubmit },
        });
        await fireEvent.input(getByPlaceholderText("用户名"), { target: { value: "admin" } });
        await fireEvent.input(getByPlaceholderText("密码"), { target: { value: "123" } });
        await fireEvent.click(getByRole("button", { name: "登录" }));
        expect(onsubmit).toHaveBeenCalledWith({ username: "admin", password: "123" });
    });
    it("renders 403", () => {
        const { getByText } = render(Result, { props: { status: "403" } });
        expect(getByText("无权访问")).toBeTruthy();
    });
});
