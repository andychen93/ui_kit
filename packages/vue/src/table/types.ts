import type { ColumnDef } from "@argon-kit/core";

export interface SortableColumn<T extends Record<string, unknown>> extends ColumnDef {
  /** 本地排序比较器 */
  sorter?: (a: T, b: T) => number;
}
