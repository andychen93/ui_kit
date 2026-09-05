<script setup lang="ts">
import { ref } from "vue";
import { Table, Pagination, RowActions, StatusSwitch, Button, message } from "@argon-kit/vue";
import type { SortableColumn } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

type User = { id: number; name: string; email: string; status: number };

const fixedCols: SortableColumn<Record<string, unknown>>[] = [
  { key: "name", title: "名称", dataIndex: "name", fixed: "left", width: 120, sorter: (a: Record<string, unknown>, b: Record<string, unknown>) => String(a.name).localeCompare(String(b.name)) },
  { key: "vin", title: "VIN 码", dataIndex: "vin", width: 180 },
  { key: "driver", title: "驾驶员", dataIndex: "driver", width: 120 },
  { key: "phone", title: "手机号", dataIndex: "phone", width: 140 },
  { key: "remark", title: "备注（省略）", dataIndex: "remark", ellipsis: true },
  { key: "ops", title: "操作", fixed: "right", width: 150, align: "center" },
];

const wideData: Record<string, unknown>[] = [
  { id: 1, name: "京A·12345", vin: "LGAX2A109B2000031", driver: "张伟", phone: "13800138000", remark: "备注内容特别长会被省略号截断的一行文本示例" },
  { id: 2, name: "京B·67890", vin: "LGAX2A109B2000042", driver: "李强", phone: "13900139000", remark: "按时保养，胎压正常" },
  { id: 3, name: "冀A·24680", vin: "LGAX2A109B2000053", driver: "王磊", phone: "13700137000", remark: "右后轮磨损接近阈值" },
];

const data = ref<User[]>([
  { id: 1, name: "Alice", email: "alice@example.com", status: 1 },
  { id: 2, name: "Bob", email: "bob@example.com", status: 0 },
  { id: 3, name: "Carol", email: "carol@example.com", status: 1 },
]);

const columns = [
  { key: "name", title: "姓名", dataIndex: "name" },
  { key: "email", title: "邮箱", dataIndex: "email" },
  { key: "status", title: "状态" },
  { key: "actions", title: "操作", width: 140 },
];

const page = ref(1);

const tableCodes = {
  vue: `<Table :columns="columns" :data="data" row-key="id">
  <template #cell-actions="{ record }">
    <RowActions :items="itemsFor(record)" />
  </template>
</Table>
<Pagination :current="page" :page-size="10" :total="30" @change="onChange" />`,
  react: `<Table columns={columns} data={data} rowKey="id" />
<Pagination current={page} pageSize={10} total={30} onChange={setPage} />`,
  svelte: `<Table {columns} {data} rowKey="id" />
<Pagination current={page} pageSize={10} total={30} onchange={onChange} />`,
  html: `<table id="tbl"></table>
<div id="pager"></div>
<script type="module">
  import { Table, Pagination, message } from '@argon-kit/html'
  new Table('#tbl', {
    columns: [
      { key: 'name', title: '姓名', dataIndex: 'name' },
      { key: 'email', title: '邮箱', dataIndex: 'email' },
      {
        key: 'actions',
        title: '操作',
        render: (value, record) => {
          const btn = document.createElement('button')
          btn.textContent = '编辑'
          btn.addEventListener('click', () => message.info('编辑 ' + record.name))
          return btn
        },
      },
    ],
    data: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ],
    onRowClick: (record) => console.log(record),
  })
  new Pagination('#pager', {
    total: 30,
    pageSize: 10,
    current: 1,
    onChange: (page) => console.log(page),
  })
<\/script>`,
};

function itemsFor(record: User) {
  return [
    { key: "edit", label: "编辑", onClick: () => message.info(`编辑 ${record.name}`) },
    {
      key: "del",
      label: "删除",
      danger: true,
      confirmTitle: `删除 ${record.name}？`,
      onClick: () => message.success("已删除"),
    },
  ];
}

function onToggle(id: string | number, checked: boolean) {
  const row = data.value.find((r) => r.id === id);
  if (row) row.status = checked ? 1 : 0;
}

const fixedCodes = {
  vue: `const columns = [
  { key: 'name', title: '名称', dataIndex: 'name', fixed: 'left', width: 120, sorter: (a, b) => a.name.localeCompare(b.name) },
  { key: 'remark', title: '备注', dataIndex: 'remark', ellipsis: true },
  { key: 'ops', title: '操作', fixed: 'right', width: 160, align: 'center' },
];

<Table :columns="columns" :data="rows" row-key="id" :scroll-x="640" />`,
  react: `const columns: TableColumn<Row>[] = [
  { key: 'name', title: '名称', dataIndex: 'name', fixed: 'left', width: 120, sorter: (a, b) => a.name.localeCompare(b.name) },
  { key: 'ops', title: '操作', fixed: 'right', width: 160, align: 'center' },
];

<Table columns={columns} data={rows} rowKey="id" scrollX={640} />`,
  svelte: `const columns = [
  { key: 'name', title: '名称', dataIndex: 'name', fixed: 'left', sorter: (a, b) => a.name.localeCompare(b.name) },
  { key: 'ops', title: '操作', fixed: 'right', width: 160, align: 'center' },
];

  <Table {columns} {data} rowKey="id" scrollX={640} />`,
  html: `<table id="fixed-tbl"></table>
<script type="module">
  import { Table } from '@argon-kit/html'
  new Table('#fixed-tbl', {
    scrollX: 640,
    columns: [
      { key: 'name', title: '名称', dataIndex: 'name', fixed: 'left', width: 120, sorter: (a, b) => a.name.localeCompare(b.name) },
      { key: 'remark', title: '备注', dataIndex: 'remark', ellipsis: true },
      { key: 'ops', title: '操作', fixed: 'right', width: 160, align: 'center' },
    ],
    data: rows,
  })
<\/script>`,
};
</script>

<template>
  <h1>Table 表格</h1>
  <p class="doc-lead">
    简单 HTML 表 + 分页。16px 正文，表头 13px / 600。行内操作用 RowActions，状态列用 StatusSwitch（status === 1 为开）。
  </p>

  <h2>基础</h2>
  <DemoBlock title="表格 / 行操作 / 状态开关" :codes="tableCodes">
    <Table :columns="columns" :data="data" row-key="id" striped>
      <template #cell-status="{ record }">
        <StatusSwitch
          :id="record.id"
          :status="record.status"
          :confirm-title="(on) => (on ? '确认启用？' : '确认停用？')"
          @toggle="onToggle"
        />
      </template>
      <template #cell-actions="{ record }">
        <RowActions :items="itemsFor(record)" />
      </template>
    </Table>
    <Pagination :current="page" :page-size="10" :total="30" show-size-changer @change="(p) => (page = p)" />
  </DemoBlock>

  <h2>固定列 / 排序 / 省略</h2>
  <DemoBlock title="操作列固定右侧 + 名称列排序（三态）" :codes="fixedCodes">
    <Table
      :columns="fixedCols"
      :data="wideData"
      row-key="id"
      :scroll-x="760"
    >
      <template #cell-ops>
        <Button size="sm" variant="link">编辑</Button>
        <Button size="sm" variant="link">删除</Button>
      </template>
    </Table>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['columns', '列：key / title / dataIndex / width / fixed / align / ellipsis / sorter', 'ColumnDef[]', '[]'],
      ['fixed', '固定列（sticky）', 'left / right', '—'],
      ['align', '对齐', 'left / center / right', '—'],
      ['ellipsis', '超长省略', 'boolean', 'false'],
      ['sorter', '本地排序（点击表头三态：升→降→原始）', '(a, b) => number', '—'],
      ['scrollX', '横向滚动最小宽度（固定列时建议设置）', 'number', '—'],
      ['data', '行数据', 'T[]', '[]'],
      ['rowKey', '行主键字段', 'string', '—'],
      ['loading', '加载态', 'boolean', 'false'],
      ['cell-{key}', '单元格插槽（Vue）/ render（React）/ cell snippet（Svelte）', 'slot', '—'],
    ]"
  />
</template>
