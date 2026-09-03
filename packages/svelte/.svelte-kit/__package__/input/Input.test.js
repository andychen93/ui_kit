import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Input from "./Input.svelte";
describe("Input", () => {
    it("shows error hint", () => {
        const { container } = render(Input, {
            props: { placeholder: "姓名", status: "error", hint: "必填" },
        });
        const hint = container.querySelector(".ag-field__hint");
        expect(hint?.textContent).toBe("必填");
        expect(hint?.className).toContain("is-error");
    });
});
