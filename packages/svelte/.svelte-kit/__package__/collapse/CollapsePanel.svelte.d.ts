import type { Snippet } from "svelte";
type $$ComponentProps = {
    panelKey: string;
    title?: string;
    disabled?: boolean;
    children?: Snippet;
};
declare const CollapsePanel: import("svelte").Component<$$ComponentProps, {}, "">;
type CollapsePanel = ReturnType<typeof CollapsePanel>;
export default CollapsePanel;
