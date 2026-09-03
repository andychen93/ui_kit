export interface PageQuery {
  pageNum: number;
  pageSize: number;
  [key: string]: unknown;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export interface ColumnDef {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number | string;
  /** 固定列（sticky）：操作列常用 "right" */
  fixed?: "left" | "right";
  /** 对齐 */
  align?: "left" | "center" | "right";
  /** 超长省略 */
  ellipsis?: boolean;
}

export interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface QueryField {
  name: string;
  label: string;
  type?: "input" | "select" | "dateRange";
  options?: { label: string; value: string | number }[];
  placeholder?: string;
}
