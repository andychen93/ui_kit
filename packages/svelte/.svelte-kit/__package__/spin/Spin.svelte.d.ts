import type { Snippet } from "svelte";
type $$ComponentProps = {
    spinning?: boolean;
    size?: "sm" | "md" | "lg";
    text?: string;
    children?: Snippet;
};
declare const Spin: import("svelte").Component<$$ComponentProps, {}, "">;
type Spin = ReturnType<typeof Spin>;
export default Spin;
