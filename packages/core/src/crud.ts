import type { FormRule } from "./validation";
import type { TreeNode } from "./table";

/** CrudFormModal 字段配置（对齐 rbac FormField 形状） */
export interface CrudField {
  name: string;
  label: string;
  type?:
    | "input"
    | "password"
    | "textarea"
    | "number"
    | "select"
    | "switch"
    | "date"
    | "dateRange"
    | "treeSelect"
    | "render";
  /** select 的选项 */
  options?: { label: string; value: string | number }[];
  /** treeSelect 的数据 */
  data?: TreeNode[];
  /** 校验规则（rbac 实际只用 required/pattern/min-max/type=email） */
  rules?: FormRule[];
  /** 24 栅格跨度：24 单列 / 12 两列 / 8 三列 */
  span?: 24 | 12 | 8;
  placeholder?: string;
}
