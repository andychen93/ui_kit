import type { Snippet } from "svelte";
import type { ColumnDef, PageQuery, PageResult, QueryField } from "@argon-kit/core";
type $$ComponentProps = {
    service: (params: PageQuery) => Promise<PageResult<Record<string, unknown>>>;
    columns: ColumnDef[];
    rowKey: string;
    querySchema?: QueryField[];
    pageSize?: number;
    toolbar?: Snippet;
    cell?: Snippet<[
        {
            column: ColumnDef;
            record: Record<string, unknown>;
            value: unknown;
            index: number;
        }
    ]>;
};
declare const ProTable: import("svelte").Component<$$ComponentProps, {}, "">;
type ProTable = ReturnType<typeof ProTable>;
export default ProTable;
