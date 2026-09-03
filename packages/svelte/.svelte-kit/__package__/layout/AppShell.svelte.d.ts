import type { Snippet } from "svelte";
import type { BreadcrumbItem, ShellMenuItem } from "@argon-kit/core";
type $$ComponentProps = {
    brand?: string;
    logo?: string;
    items?: ShellMenuItem[];
    selectedKey?: string;
    onselect?: (key: string) => void;
    pinned?: boolean;
    onpinnedchange?: (pinned: boolean) => void;
    breadcrumb?: BreadcrumbItem[];
    extra?: Snippet;
    footer?: Snippet | string;
    children?: Snippet;
    embed?: boolean;
};
declare const AppShell: import("svelte").Component<$$ComponentProps, {}, "">;
type AppShell = ReturnType<typeof AppShell>;
export default AppShell;
