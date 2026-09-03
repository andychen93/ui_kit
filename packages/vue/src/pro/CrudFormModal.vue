<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { CrudField } from "@argon-kit/core";
import { message } from "@argon-kit/core";
import Modal from "../overlay/Modal.vue";
import Form from "../form/Form.vue";
import FormItem from "../form/FormItem.vue";
import Input from "../input/Input.vue";
import Password from "../input/Password.vue";
import Textarea from "../input/Textarea.vue";
import InputNumber from "../input/InputNumber.vue";
import Select from "../select/Select.vue";
import Switch from "../switch/Switch.vue";
import DatePicker from "../datepicker/DatePicker.vue";
import RangePicker from "../datepicker/RangePicker.vue";
import TreeSelect from "../tree/TreeSelect.vue";

const props = withDefaults(
  defineProps<{
    open: boolean;
    /** null=新增，否则编辑 */
    recordId: string | number | null;
    fields: CrudField[];
    title: string;
    /** 编辑态回填 */
    onLoad?: (id: string | number) => Promise<Record<string, unknown>>;
    onSubmit: (values: Record<string, unknown>, isEdit: boolean) => Promise<void>;
    onSuccess?: () => void;
    onCancel: () => void;
    width?: number;
  }>(),
  { width: 600 },
);

const isEdit = computed(() => props.recordId != null);
const modalTitle = computed(() => (isEdit.value ? `编辑${props.title}` : `新增${props.title}`));

const model = reactive<Record<string, unknown>>({});
const formRef = ref<InstanceType<typeof Form> | null>(null);
const submitting = ref(false);
const loadingRecord = ref(false);

function resetModel() {
  Object.keys(model).forEach((k) => delete model[k]);
  for (const f of props.fields) {
    model[f.name] = f.type === "switch" ? false : f.type === "dateRange" ? null : "";
  }
}

// open / recordId 变化 → 回填或重置
watch(
  () => [props.open, props.recordId] as const,
  async ([open]) => {
    if (!open) return;
    resetModel();
    if (isEdit.value && props.onLoad) {
      loadingRecord.value = true;
      try {
        const record = await props.onLoad(props.recordId as string | number);
        for (const f of props.fields) {
          const v = record[f.name];
          if (v === undefined) continue;
          model[f.name] = f.type === "switch" ? v === 1 || v === true : v;
        }
      } finally {
        loadingRecord.value = false;
      }
    }
    formRef.value?.clearValidate();
  },
  { immediate: true },
);

async function handleConfirm() {
  if (!formRef.value || submitting.value) return;
  let values: Record<string, unknown>;
  try {
    values = await formRef.value.validate();
  } catch {
    return; // 校验失败已标红
  }
  // switch boolean → 1/0（对齐后端惯例）
  for (const f of props.fields) {
    if (f.type === "switch") values[f.name] = values[f.name] ? 1 : 0;
  }
  submitting.value = true;
  try {
    await props.onSubmit(values, isEdit.value);
    message.success(isEdit.value ? "编辑成功" : "新增成功");
    props.onSuccess?.();
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <Modal
    :open="open"
    :title="modalTitle"
    :width="width"
    :confirm-loading="submitting"
    @close="onCancel"
    @confirm="handleConfirm"
  >
    <div v-if="loadingRecord" style="padding: 40px; text-align: center; color: var(--ag-gray-500)">
      加载中…
    </div>
    <Form v-else ref="formRef" :model="model">
      <FormItem
        v-for="f in fields"
        :key="f.name"
        :label="f.label"
        :name="f.name"
        :rules="f.rules"
        :span="f.span"
      >
        <template v-if="f.type === 'render'">
          <slot :name="`field-${f.name}`" :model="model" :field="f" />
        </template>
        <Input
          v-else-if="f.type === 'password'"
          :placeholder="f.placeholder"
          @update:model-value="(v: string) => (model[f.name] = v)"
          :model-value="String(model[f.name] ?? '')"
        />
        <Textarea
          v-else-if="f.type === 'textarea'"
          :rows="2"
          :placeholder="f.placeholder"
          :model-value="String(model[f.name] ?? '')"
          @update:model-value="(v: string) => (model[f.name] = v)"
        />
        <InputNumber
          v-else-if="f.type === 'number'"
          :placeholder="f.placeholder"
          :model-value="String(model[f.name] ?? '')"
          @update:model-value="(v: string) => (model[f.name] = v)"
        />
        <Select
          v-else-if="f.type === 'select'"
          :options="f.options ?? []"
          :placeholder="f.placeholder"
          :model-value="(model[f.name] as string | number | null)"
          @update:model-value="(v) => (model[f.name] = v)"
        />
        <Switch
          v-else-if="f.type === 'switch'"
          :model-value="Boolean(model[f.name])"
          @update:model-value="(v: boolean) => (model[f.name] = v)"
        />
        <DatePicker
          v-else-if="f.type === 'date'"
          :placeholder="f.placeholder"
          :model-value="(model[f.name] as string | null)"
          @update:model-value="(v) => (model[f.name] = v)"
        />
        <RangePicker
          v-else-if="f.type === 'dateRange'"
          :model-value="(model[f.name] as [string, string] | null)"
          @update:model-value="(v) => (model[f.name] = v)"
        />
        <TreeSelect
          v-else-if="f.type === 'treeSelect'"
          :data="f.data ?? []"
          :placeholder="f.placeholder"
          :model-value="(model[f.name] as string | number | null)"
          @update:model-value="(v) => (model[f.name] = v)"
        />
        <Input
          v-else
          :placeholder="f.placeholder"
          :model-value="String(model[f.name] ?? '')"
          @update:model-value="(v: string) => (model[f.name] = v)"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
