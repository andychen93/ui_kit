import type { Snippet } from "svelte";
type $$ComponentProps = {
    variant?: "default" | "primary" | "info" | "success" | "warning" | "danger";
    dot?: boolean;
    closable?: boolean;
    children?: Snippet;
    onclose?: (e: MouseEvent) => void;
};
declare const Tag: import("svelte").Component<$$ComponentProps, {}, "">;
type Tag = ReturnType<typeof Tag>;
export default Tag;
