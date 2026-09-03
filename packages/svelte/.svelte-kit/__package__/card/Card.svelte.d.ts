import type { Snippet } from "svelte";
type $$ComponentProps = {
    title?: string;
    noBody?: boolean;
    extra?: Snippet;
    footer?: Snippet;
    children?: Snippet;
};
declare const Card: import("svelte").Component<$$ComponentProps, {}, "">;
type Card = ReturnType<typeof Card>;
export default Card;
