import type { ShellMenuItem } from "@argon-kit/core";
import Menu from "./Menu.svelte";
type $$ComponentProps = {
    items: ShellMenuItem[];
    selectedKey?: string;
    openKeys: string[];
    onselect?: (key: string) => void;
    onopenchange?: (keys: string[]) => void;
};
declare const Menu: import("svelte").Component<$$ComponentProps, {}, "">;
type Menu = ReturnType<typeof Menu>;
export default Menu;
