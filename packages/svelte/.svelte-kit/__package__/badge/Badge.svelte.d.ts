import type { Snippet } from "svelte";
type $$ComponentProps = {
    variant?: "default" | "primary" | "info" | "success" | "warning" | "danger";
    pill?: boolean;
    size?: "sm" | "md" | "lg";
    circle?: boolean;
    children?: Snippet;
};
declare const Badge: import("svelte").Component<$$ComponentProps, {}, "">;
type Badge = ReturnType<typeof Badge>;
export default Badge;
