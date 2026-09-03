import type { Snippet } from "svelte";
type $$ComponentProps = {
    checked?: boolean;
    disabled?: boolean;
    name?: string;
    children?: Snippet;
    onchange?: () => void;
};
declare const Radio: import("svelte").Component<$$ComponentProps, {}, "">;
type Radio = ReturnType<typeof Radio>;
export default Radio;
