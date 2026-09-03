import type { ColumnDef, PageQuery, PageResult } from "@argon-kit/core";
type $$ComponentProps = {
    value?: Record<string, unknown> | null;
    service: (params: PageQuery) => Promise<PageResult<Record<string, unknown>>>;
    columns: ColumnDef[];
    rowKey: string;
    labelField: string;
    placeholder?: string;
    searchField?: string;
    pageSize?: number;
    popoverWidth?: number;
    allowClear?: boolean;
    cacheKey?: string;
};
declare const PageSelect: import("svelte").Component<$$ComponentProps, {}, "value">;
type PageSelect = ReturnType<typeof PageSelect>;
export default PageSelect;
