import type { Snippet } from "svelte";
type $$ComponentProps = {
    items?: Array<{
        key?: string;
        title?: string;
        description?: string;
    }>;
    loading?: boolean;
    bordered?: boolean;
    header?: Snippet;
    footer?: Snippet;
    renderItem?: Snippet<[{
        key?: string;
        title?: string;
        description?: string;
    }, number]>;
};
declare const List: import("svelte").Component<$$ComponentProps, {}, "">;
type List = ReturnType<typeof List>;
export default List;
