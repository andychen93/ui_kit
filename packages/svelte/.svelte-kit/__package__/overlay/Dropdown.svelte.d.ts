import type { Snippet } from "svelte";
export interface DropdownItem {
    key: string;
    label: string;
    danger?: boolean;
    disabled?: boolean;
}
type $$ComponentProps = {
    items: DropdownItem[];
    children?: Snippet;
    onselect?: (key: string) => void;
};
declare const Dropdown: import("svelte").Component<$$ComponentProps, {}, "">;
type Dropdown = ReturnType<typeof Dropdown>;
export default Dropdown;
