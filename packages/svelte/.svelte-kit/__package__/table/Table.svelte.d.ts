import type { Snippet } from "svelte";
import type { ColumnDef } from "@argon-kit/core";
export interface SortableColumn extends ColumnDef {
    sorter?: (a: Record<string, unknown>, b: Record<string, unknown>) => number;
}
type $$ComponentProps = {
    columns: SortableColumn[];
    data: Record<string, unknown>[];
    rowKey: string;
    loading?: boolean;
    striped?: boolean;
    clickable?: boolean;
    activeKey?: string | number;
    scrollX?: number;
    onrowclick?: (record: Record<string, unknown>) => void;
    cell?: Snippet<[
        {
            column: ColumnDef;
            record: Record<string, unknown>;
            value: unknown;
            index: number;
        }
    ]>;
};
declare const Table: import("svelte").Component<$$ComponentProps, {}, "">;
type Table = ReturnType<typeof Table>;
export default Table;
