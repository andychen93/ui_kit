import type { TreeNode } from "@argon-kit/core";
type $$ComponentProps = {
    value?: string | number | null;
    data: TreeNode[];
    placeholder?: string;
    allowClear?: boolean;
    status?: "error" | "success";
    onchange?: (id: string | number | null, node?: TreeNode | null) => void;
};
declare const TreeSelect: import("svelte").Component<$$ComponentProps, {}, "value">;
type TreeSelect = ReturnType<typeof TreeSelect>;
export default TreeSelect;
