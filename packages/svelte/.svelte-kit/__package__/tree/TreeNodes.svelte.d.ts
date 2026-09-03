import type { TreeNode } from "@argon-kit/core";
import TreeNodes from "./TreeNodes.svelte";
type $$ComponentProps = {
    nodes: TreeNode[];
    expanded: Set<string>;
    selected: string | number | null;
    ontoggle?: (id: string | number) => void;
    onselect?: (node: TreeNode) => void;
};
declare const TreeNodes: import("svelte").Component<$$ComponentProps, {}, "">;
type TreeNodes = ReturnType<typeof TreeNodes>;
export default TreeNodes;
