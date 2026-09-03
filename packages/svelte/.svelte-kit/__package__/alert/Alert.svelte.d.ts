import type { Snippet } from "svelte";
type $$ComponentProps = {
    variant?: "default" | "primary" | "info" | "success" | "warning" | "danger";
    dismissible?: boolean;
    icon?: Snippet;
    children?: Snippet;
    onclose?: () => void;
};
declare const Alert: import("svelte").Component<$$ComponentProps, {}, "">;
type Alert = ReturnType<typeof Alert>;
export default Alert;
