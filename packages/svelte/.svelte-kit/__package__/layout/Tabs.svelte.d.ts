import type { Snippet } from "svelte";
import type { TabItem } from "@argon-kit/core";
type $$ComponentProps = {
    items: TabItem[];
    active: string;
    onchange?: (key: string) => void;
    center?: boolean;
    children?: Snippet;
};
declare const Tabs: import("svelte").Component<$$ComponentProps, {}, "">;
type Tabs = ReturnType<typeof Tabs>;
export default Tabs;
