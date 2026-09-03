<script setup lang="ts">
import { provide, reactive } from "vue";
import { validateForm, type FormRule, type FormRules } from "@argon-kit/core";

const props = withDefaults(
  defineProps<{
    model: Record<string, unknown>;
    rules?: FormRules;
    layout?: "horizontal" | "vertical";
  }>(),
  { layout: "horizontal" },
);

/** 初始快照（resetFields 用） */
const initial: Record<string, unknown> = JSON.parse(JSON.stringify(props.model));

/** 字段级错误状态（name → message），由 FormItem 写入 */
const errors = reactive<Record<string, string>>({});

/** FormItem 挂载时注册的字段级规则（与 Form 级 rules 合并，字段级优先） */
const itemRules = new Map<string, FormRule[]>();

function mergedRules(): Record<string, FormRule[]> {
  const merged: Record<string, FormRule[]> = { ...(props.rules ?? {}) };
  for (const [name, rs] of itemRules) merged[name] = rs;
  return merged;
}

provide("agForm", {
  rules: props.rules,
  errors,
  getModel: (name: string) => props.model[name],
  registerItemRules: (name: string, rs: FormRule[] | undefined) => {
    if (rs) itemRules.set(name, rs);
    else itemRules.delete(name);
  },
  setFieldError: (name: string, msg: string | null) => {
    if (msg) errors[name] = msg;
    else delete errors[name];
  },
});

/** 整表校验：通过返回 values，失败 throw errors 并全部标红（聚合 FormItem 注册的规则） */
async function validate(): Promise<Record<string, unknown>> {
  try {
    return await validateForm(props.model, mergedRules());
  } catch (errs) {
    Object.keys(errors).forEach((k) => delete errors[k]);
    Object.assign(errors, errs as Record<string, string>);
    throw errs;
  }
}

/** 清除全部校验状态 */
function clearValidate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
}

/** 重置 model 到初始快照并清校验 */
function resetFields() {
  Object.keys(props.model).forEach((k) => delete props.model[k]);
  Object.assign(props.model, JSON.parse(JSON.stringify(initial)));
  clearValidate();
}

defineExpose({ validate, clearValidate, resetFields });
defineOptions({ name: "AgForm" });
</script>

<template>
  <form class="ag-form" :class="layout === 'vertical' ? 'ag-form--vertical' : ''" @submit.prevent>
    <slot />
  </form>
</template>
