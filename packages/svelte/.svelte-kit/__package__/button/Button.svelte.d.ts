import type { Snippet } from "svelte";
import type { ButtonSize, ButtonVariant } from "./types";
type $$ComponentProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    block?: boolean;
    iconOnly?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    class?: string;
    icon?: Snippet;
    children?: Snippet;
    [key: string]: unknown;
};
declare const Button: import("svelte").Component<$$ComponentProps, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
