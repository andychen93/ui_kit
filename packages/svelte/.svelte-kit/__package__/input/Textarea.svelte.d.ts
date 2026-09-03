import type { FieldStatus } from "./types";
type $$ComponentProps = {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    status?: FieldStatus;
    hint?: string;
    rows?: number;
};
declare const Textarea: import("svelte").Component<$$ComponentProps, {}, "value">;
type Textarea = ReturnType<typeof Textarea>;
export default Textarea;
