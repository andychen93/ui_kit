import type { Snippet } from "svelte";
type $$ComponentProps = {
    src?: string;
    alt?: string;
    size?: "sm" | "md" | "lg";
    square?: boolean;
    children?: Snippet;
};
declare const Avatar: import("svelte").Component<$$ComponentProps, {}, "">;
type Avatar = ReturnType<typeof Avatar>;
export default Avatar;
