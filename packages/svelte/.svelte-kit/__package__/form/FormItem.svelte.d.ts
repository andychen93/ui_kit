import type { Snippet } from "svelte";
import { type FormRule } from "@argon-kit/core";
type $$ComponentProps = {
    label?: string;
    name?: string;
    rules?: FormRule[];
    span?: 24 | 12 | 8;
    hint?: string;
    children?: Snippet<[{
        error: string | null;
    }]>;
};
declare const FormItem: import("svelte").Component<$$ComponentProps, {}, "">;
type FormItem = ReturnType<typeof FormItem>;
export default FormItem;
