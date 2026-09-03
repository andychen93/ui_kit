import type { Snippet } from "svelte";
import type { FieldStatus } from "./types";
type $$ComponentProps = {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    status?: FieldStatus;
    hint?: string;
    type?: string;
    prefix?: Snippet;
    suffix?: Snippet;
};
declare const Input: import("svelte").Component<$$ComponentProps, {}, "value">;
type Input = ReturnType<typeof Input>;
export default Input;
