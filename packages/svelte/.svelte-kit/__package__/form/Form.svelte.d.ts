import type { Snippet } from "svelte";
import { type FormRules } from "@argon-kit/core";
export type FormApi = {
    validate: () => Promise<Record<string, unknown>>;
    clearValidate: () => void;
    resetFields: () => void;
};
type $$ComponentProps = {
    model: Record<string, unknown>;
    rules?: FormRules;
    layout?: "horizontal" | "vertical";
    children?: Snippet;
};
declare const Form: import("svelte").Component<$$ComponentProps, {
    formApi: FormApi;
}, "">;
type Form = ReturnType<typeof Form>;
export default Form;
