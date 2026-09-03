import type { TreeNode } from "@argon-kit/core";
type $$ComponentProps = {
    data: TreeNode[];
    value?: string | number | null;
    onchange?: (id: string | number, node: TreeNode) => void;
};
declare const Tree: import("svelte").Component<$$ComponentProps, {}, "value">;
type Tree = ReturnType<typeof Tree>;
export default Tree;
