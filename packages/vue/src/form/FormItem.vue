<script setup lang="ts">
import { computed, inject, watch } from "vue";
import { validateField, type FormRule } from "@argon-kit/core";

const props = withDefaults(
  defineProps<{
    label?: string;
    /** 对应 Form model 的键名 */
    name?: string;
    /** 覆盖 Form 级该字段规则 */
    rules?: FormRule[];
    span?: 24 | 12 | 8;
    hint?: string;
  }>(),
  { span: 24 },
);

const ctx = inject<{
  rules?: Record<string, FormRule[]>;
  errors: Record<string, string>;
  getModel: (name: string) => unknown;
  registerItemRules: (name: string, rs: FormRule[] | undefined) => void;
  setFieldError: (name: string, msg: string | null) => void;
} | null>("agForm", null);

// 挂载即向 Form 注册字段级规则（Form.validate 会聚合）
ctx?.registerItemRules?.(props.name ?? "", props.rules);

const error = computed(() => (props.name ? (ctx?.errors[props.name] ?? null) : null));

// 值变化时：已标红 → 重新校验（用户修正后红字即时消失）；未标红 → 不动（避免打字中过早报错）
watch(
  () => (props.name && ctx ? ctx.getModel(props.name) : undefined),
  () => {
    if (!error.value) return;
    void validateSelf();
  },
);

/** 单字段校验（rules 覆盖 Form 级同名规则） */
async function validateSelf() {
  if (!ctx || !props.name) return;
  const rules = props.rules ?? ctx.rules?.[props.name];
  if (!rules?.length) return;
  const msg = await validateField(ctx.getModel(props.name), rules);
  ctx.setFieldError(props.name, msg);
}

defineExpose({ validateSelf });
</script>

<template>
  <div
    class="ag-form-item"
    :class="[span !== 24 ? `ag-form-item--span-${span}` : '', error ? 'is-error' : '']"
  >
    <label v-if="label" class="ag-form-item__label">{{ label }}</label>
    <div class="ag-form-item__control">
      <slot :error="error" />
      <span v-if="error" class="ag-form-item__error">{{ error }}</span>
      <span v-else-if="hint" class="ag-form-item__hint">{{ hint }}</span>
    </div>
  </div>
</template>
