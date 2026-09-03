<script setup lang="ts">
import { ref } from "vue";
import { PageSelect, type PageQuery, type PageResult } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

type User = { id: number; name: string; email: string };

const picked = ref<User | null>(null);
const columns = [
  { key: "name", title: "姓名", dataIndex: "name" },
  { key: "email", title: "邮箱", dataIndex: "email" },
];

const ALL: User[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

function service(params: PageQuery): Promise<PageResult<User>> {
  const kw = String(params.name ?? "");
  const filtered = ALL.filter((u) => !kw || u.name.includes(kw) || u.email.includes(kw));
  const start = (params.pageNum - 1) * params.pageSize;
  return Promise.resolve({
    list: filtered.slice(start, start + params.pageSize),
    total: filtered.length,
    pageNum: params.pageNum,
    pageSize: params.pageSize,
  });
}

const pageSelectCodes = {
  vue: `<PageSelect
  v-model="picked"
  :service="service"
  :columns="columns"
  row-key="id"
  label-field="name"
  search-field="name"
  allow-clear
/>`,
  react: `<PageSelect
  value={picked}
  onChange={setPicked}
  service={service}
  columns={columns}
  rowKey="id"
  labelField="name"
  searchField="name"
  allowClear
/>`,
  svelte: `<PageSelect
  bind:value={picked}
  {service}
  {columns}
  rowKey="id"
  labelField="name"
  searchField="name"
  allowClear
/>`,
};
</script>

<template>
  <h1>PageSelect 分页选择</h1>
  <p class="doc-lead">
    下拉里是分页 Table，不是全量 options。输入框本身就是搜索框（300ms 防抖），只有点中表格行才产生值；关掉且未点行则回滚成已选项文本。受控值是<strong>整条 record</strong>。
    <code>service</code> 直接吃 <code>PageResult</code>，业务侧先剥掉接口信封再传入。
  </p>

  <h2>基础</h2>
  <DemoBlock title="输入即搜索" :codes="pageSelectCodes">
    <div style="min-height: 380px; width: 100%">
      <PageSelect
        v-model="picked"
        :service="service"
        :columns="columns"
        row-key="id"
        label-field="name"
        search-field="name"
        allow-clear
        placeholder="搜索用户"
      />
      <p v-if="picked" class="doc-lead" style="margin-top: 12px">
        已选：{{ picked.name }}（id={{ picked.id }}）
      </p>
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['service', '(params: PageQuery) => Promise<PageResult<T>>', 'function', '—'],
      ['columns', '弹层表格列', 'ColumnDef[]', '—'],
      ['rowKey', '行主键', 'string', '—'],
      ['labelField', '回填显示字段', 'keyof T', '—'],
      ['value', '整条记录', 'T | null', 'null'],
      ['searchField', '关键字作为该 key 传给 service', 'string', '—'],
      ['pageSize', '弹层每页条数', 'number', '5'],
      ['popoverWidth', '弹层宽度', 'number', '480'],
      ['allowClear', '允许清空，回调 null', 'boolean', 'false'],
      ['cacheKey', '同页多实例建议传入（对齐 rbac）', 'string', '—'],
    ]"
  />
</template>
