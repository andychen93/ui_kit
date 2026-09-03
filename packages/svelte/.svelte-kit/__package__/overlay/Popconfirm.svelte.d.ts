import type { Snippet } from "svelte";
type $$ComponentProps = {
    title?: string;
    onconfirm?: () => void;
    children?: Snippet;
};
declare const Popconfirm: import("svelte").Component<$$ComponentProps, {}, "">;
type Popconfirm = ReturnType<typeof Popconfirm>;
export default Popconfirm;
