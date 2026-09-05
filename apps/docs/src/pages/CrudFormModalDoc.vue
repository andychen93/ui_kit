<script setup lang="ts">
import { ref } from "vue";
import { CrudFormModal, Button, message } from "@argon-kit/vue";
import type { CrudField } from "@argon-kit/core";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const open = ref(false);
const recordId = ref<string | number | null>(null);

const fields: CrudField[] = [
  { name: "plateNo", label: "车牌号", rules: [{ required: true, message: "请输入车牌号" }], span: 12 },
  { name: "model", label: "车型", span: 12 },
  { name: "fleet", label: "所属车队", type: "select", options: [
    { label: "华北一队", value: 1 },
    { label: "华北二队", value: 2 },
  ], rules: [{ required: true, message: "请选择车队" }], span: 12 },
  { name: "buyDate", label: "购置日期", type: "date", span: 12 },
  { name: "active", label: "是否启用", type: "switch", span: 12 },
  { name: "remark", label: "备注", type: "textarea", span: 24 },
];

const mockDb = [
  { id: 1, plateNo: "京A·12345", model: "东风天龙 KL 460", fleet: 1, buyDate: "2024-03-15", active: 1, remark: "主力车" },
];

const codes = {
  vue: `const fields: CrudField[] = [
  { name: "plateNo", label: "车牌号", rules: [{ required: true, message: "请输入车牌号" }], span: 12 },
  { name: "active", label: "是否启用", type: "switch", span: 12 },
  { name: "remark", label: "备注", type: "textarea", span: 24 },
];

<CrudFormModal
  v-model:open="open"
  :record-id="recordId"
  :fields="fields"
  title="车辆"
  :on-load="loadVehicle"
  :on-submit="saveVehicle"
  @success="refresh"
  @cancel="open = false"
/>`,
  react: `<CrudFormModal
  open={open}
  recordId={recordId}
  fields={fields}
  title="车辆"
  onLoad={loadVehicle}
  onSubmit={saveVehicle}
  onSuccess={refresh}
  onCancel={() => setOpen(false)}
/>`,
  svelte: `<CrudFormModal
  bind:open
  {recordId}
  {fields}
  title="车辆"
  onLoad={loadVehicle}
  onSubmit={saveVehicle}
  onsuccess={refresh}
  oncancel={() => (open = false)}
/>`,
  html: `<div id="crud"></div>
<script type="module">
  import { CrudFormModal } from '@argon-kit/html'
  const modal = new CrudFormModal('#crud', {
    title: '新增车辆',
    fields: [
      { name: 'plateNo', label: '车牌号', required: true },
      { name: 'active', label: '是否启用', type: 'switch' },
      { name: 'remark', label: '备注', type: 'textarea' },
    ],
    onOk: async (values) => {
      await saveVehicle(values)
    },
  })
  // 新增：modal.setMode('create'); modal.show()
  // 编辑：modal.setMode('edit'); modal.setValues(record); modal.show()
<\/script>`,
};

function openCreate() {
  recordId.value = null;
  open.value = true;
}
function openEdit(id: number) {
  recordId.value = id;
  open.value = true;
}

async function onLoad(id: string | number) {
  await new Promise((r) => setTimeout(r, 300));
  return mockDb.find((v) => v.id === id) ?? {};
}

async function onSubmit(values: Record<string, unknown>, isEdit: boolean) {
  await new Promise((r) => setTimeout(r, 500));
  void values;
  void isEdit;
}
</script>

<template>
  <h1>CrudFormModal 新增/编辑弹窗</h1>
  <p class="doc-lead">
    字段配置驱动的 CRUD 弹窗（对齐 rbac pro 模式）：编辑自动回填（switch 0/1↔boolean）、
    确定先校验（失败标红停留）、提交转 1/0、成功 message 反馈。内置 loading 防重复提交。
  </p>

  <DemoBlock title="新增 / 编辑" :codes="codes">
    <div style="display: flex; gap: 8px">
      <Button size="sm" @click="openCreate">新增车辆</Button>
      <Button size="sm" variant="neutral" @click="openEdit(1)">编辑（京A·12345）</Button>
    </div>
  </DemoBlock>

  <CrudFormModal
    v-model:open="open"
    :record-id="recordId"
    :fields="fields"
    title="车辆"
    :on-load="onLoad"
    :on-submit="onSubmit"
    @cancel="open = false"
  />

  <h2>字段类型</h2>
  <ApiTable
    :columns="['type', '渲染控件']"
    :rows="[
      ['input（默认）', 'Input'],
      ['password', 'Password'],
      ['textarea', 'Textarea（rows=2）'],
      ['number', 'InputNumber'],
      ['select', 'Select（options）'],
      ['switch', 'Switch（提交转 1/0，回填转 boolean）'],
      ['date', 'DatePicker'],
      ['dateRange', 'RangePicker'],
      ['treeSelect', 'TreeSelect（data）'],
      ['render', '插槽逃逸（Vue #field-{name} / React renderField / Svelte snippet）'],
    ]"
  />

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['open', '是否显示（v-model:open）', 'boolean', '必填'],
      ['recordId', 'null=新增，否则编辑', 'string | number | null', '必填'],
      ['fields', '字段配置', 'CrudField[]', '必填'],
      ['title', '实体名（弹窗标题自动加 新增/编辑 前缀）', 'string', '必填'],
      ['onLoad', '编辑态回填', '(id) => Promise<record>', '—'],
      ['onSubmit', '提交（已校验、已转换）', '(values, isEdit) => Promise', '必填'],
      ['onSuccess / onCancel', '成功后 / 取消回调', '() => void', '—'],
      ['width', '弹窗宽度', 'number', '600'],
    ]"
  />
</template>
