import type { Snippet } from "svelte";
import type { FieldStatus } from "./types";
type $$ComponentProps = {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    status?: FieldStatus;
    hint?: string;
    prefix?: Snippet;
};
declare const Password: import("svelte").Component<$$ComponentProps, {}, "value">;
type Password = ReturnType<typeof Password>;
export default Password;
