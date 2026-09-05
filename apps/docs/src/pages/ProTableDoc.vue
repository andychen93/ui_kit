<script setup lang="ts">
import { Button, ProTable, RowActions, message, type PageQuery, type PageResult } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

type User = { id: number; name: string; email: string; dept: string };

const ALL: User[] = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  email: `user${i + 1}@example.com`,
  dept: i % 2 === 0 ? "研发" : "产品",
}));

const columns = [
  { key: "name", title: "姓名", dataIndex: "name" },
  { key: "email", title: "邮箱", dataIndex: "email" },
  { key: "dept", title: "部门", dataIndex: "dept" },
  { key: "actions", title: "操作", width: 140 },
];

const querySchema = [
  { name: "name", label: "姓名", type: "input" as const, placeholder: "姓名" },
  {
    name: "dept",
    label: "部门",
    type: "select" as const,
    options: [
      { label: "研发", value: "研发" },
      { label: "产品", value: "产品" },
    ],
  },
];

function service(params: PageQuery): Promise<PageResult<User>> {
  const name = String(params.name ?? "");
  const dept = String(params.dept ?? "");
  const filtered = ALL.filter(
    (u) => (!name || u.name.includes(name)) && (!dept || u.dept === dept),
  );
  const start = (params.pageNum - 1) * params.pageSize;
  return Promise.resolve({
    list: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
    pageNum: params.pageNum,
    pageSize: params.pageSize,
  });
}

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

const proCodes = {
  vue: `<ProTable :service="service" :columns="columns" row-key="id" :query-schema="querySchema">
  <template #toolbar>
    <Button>新建</Button>
  </template>
  <template #cell-actions="{ record }">
    <RowActions :items="itemsFor(record)" />
  </template>
</ProTable>`,
  react: `<ProTable
  service={service}
  columns={columns}
  rowKey="id"
  querySchema={querySchema}
  toolbar={<Button>新建</Button>}
/>`,
  svelte: `<ProTable {service} {columns} rowKey="id" {querySchema}>
  {#snippet toolbar()}<Button>新建</Button>{/snippet}
</ProTable>`,
  html: `<div id="table"></div>
<script type="module">
  import { ProTable } from '@argon-kit/html'
  const table = new ProTable('#table', {
    columns: [
      { key: 'name', title: '姓名', dataIndex: 'name' },
      { key: 'email', title: '邮箱', dataIndex: 'email' },
    ],
    request: async ({ current, pageSize }) => {
      const data = await fetchUsers({ page: current, size: pageSize })
      return { data: data.list, total: data.total }
    },
  })
  // 查询：table.search({ name: '张' })；刷新：table.reload()
<\/script>`,
};
</script>

<template>
  <h1>ProTable 查询表格</h1>
  <p class="doc-lead">
    QueryForm + 白卡片 + toolbar + Table + Pagination。查询字段目前支持 input / select / dateRange，不要把业务 DictSelect 塞进组件库。
  </p>

  <h2>基础</h2>
  <DemoBlock title="查询 + 分页" :codes="proCodes">
    <div style="width: 100%">
      <ProTable :service="service" :columns="columns" row-key="id" :query-schema="querySchema">
        <template #toolbar>
          <span />
          <Button @click="message.info('新建')">新建</Button>
        </template>
        <template #cell-actions="{ record }">
          <RowActions :items="itemsFor(record)" />
        </template>
      </ProTable>
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['service', '分页服务，返回 PageResult', 'function', '—'],
      ['columns', '列定义', 'ColumnDef[]', '—'],
      ['rowKey', '行主键', 'string', '—'],
      ['querySchema', 'QueryForm 字段', 'QueryField[]', '—'],
      ['pageSize', '默认每页', 'number', '10'],
      ['toolbar', '卡片顶栏（Vue slot / React node / Svelte snippet）', 'node', '—'],
    ]"
  />
</template>
