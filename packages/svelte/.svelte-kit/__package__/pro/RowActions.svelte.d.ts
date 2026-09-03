export interface RowActionItem {
    key: string;
    label: string;
    danger?: boolean;
    confirmTitle?: string;
    onClick: () => void;
}
type $$ComponentProps = {
    items: RowActionItem[];
};
declare const RowActions: import("svelte").Component<$$ComponentProps, {}, "">;
type RowActions = ReturnType<typeof RowActions>;
export default RowActions;
