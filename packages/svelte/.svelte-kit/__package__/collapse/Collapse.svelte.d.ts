import type { Snippet } from "svelte";
type $$ComponentProps = {
    value?: string[];
    accordion?: boolean;
    onChange?: (keys: string[]) => void;
    children?: Snippet;
};
declare const Collapse: import("svelte").Component<$$ComponentProps, {}, "value">;
type Collapse = ReturnType<typeof Collapse>;
export default Collapse;
