/**
 * 轻量表单校验引擎 —— 规则形状对齐 rbac 实际使用的 antd/async-validator 子集
 * （required / pattern / min / max / len / type=email|url|number / validator）。
 */

export interface FormRule {
  /** 必填（undefined/null/""/空数组 均视为空） */
  required?: boolean;
  /** 正则 */
  pattern?: RegExp;
  /** 字符串长度或数字下限 */
  min?: number;
  /** 字符串长度或数字上限 */
  max?: number;
  /** 精确长度（字符串） */
  len?: number;
  /** 内置类型校验 */
  type?: "email" | "url" | "number";
  /** 失败提示；validator 的返回字符串优先 */
  message: string;
  /** 自定义校验：返回 true 通过，返回 string 为错误文案，可抛错/异步 */
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>;
}

export type FormRules = Record<string, FormRule[]>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/\S+$/;

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** 单字段校验：首个失败规则返回其 message，全过返回 null */
export async function validateField(
  value: unknown,
  rules: FormRule[] | undefined,
): Promise<string | null> {
  if (!rules || rules.length === 0) return null;

  for (const rule of rules) {
    if (rule.required && isEmpty(value)) return rule.message;

    // 非必填且值为空 → 跳过其余规则（与 antd 行为一致）
    if (isEmpty(value)) continue;

    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
      return rule.message;
    }
    if (rule.type === "email" && typeof value === "string" && !EMAIL_RE.test(value)) {
      return rule.message;
    }
    if (rule.type === "url" && typeof value === "string" && !URL_RE.test(value)) {
      return rule.message;
    }
    if (typeof value === "string" || typeof value === "number") {
      const len = typeof value === "string" ? value.length : value;
      if (rule.min !== undefined && len < rule.min) return rule.message;
      if (rule.max !== undefined && len > rule.max) return rule.message;
      if (rule.len !== undefined && typeof value === "string" && value.length !== rule.len) {
        return rule.message;
      }
      if (rule.type === "number" && typeof value === "string" && Number.isNaN(Number(value))) {
        return rule.message;
      }
    }
    if (rule.validator) {
      const result = await rule.validator(value);
      if (result === false) return rule.message;
      if (typeof result === "string") return result;
    }
  }
  return null;
}

export interface FormValidateResult {
  values: Record<string, unknown>;
  errors: Record<string, string>;
}

/** 整表校验：通过 resolve values；失败 reject errors（键为字段名） */
export async function validateForm(
  values: Record<string, unknown>,
  rules: FormRules,
): Promise<Record<string, unknown>> {
  const errors: Record<string, string> = {};
  const names = new Set([...Object.keys(rules), ...Object.keys(values)]);
  await Promise.all(
    Array.from(names).map(async (name) => {
      const err = await validateField(values[name], rules[name]);
      if (err) errors[name] = err;
    }),
  );
  if (Object.keys(errors).length > 0) throw errors;
  return values;
}
