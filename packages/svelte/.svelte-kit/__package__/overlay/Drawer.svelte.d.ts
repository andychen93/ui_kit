import type { Snippet } from "svelte";
type $$ComponentProps = {
    open?: boolean;
    title?: string;
    onclose?: () => void;
    children?: Snippet;
};
declare const Drawer: import("svelte").Component<$$ComponentProps, {}, "">;
type Drawer = ReturnType<typeof Drawer>;
export default Drawer;
