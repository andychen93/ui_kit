<script setup lang="ts">
import { ref } from "vue";
import { AppShell, Button, type ShellMenuItem } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const pinned = ref(true);
const selected = ref("users");
const items: ShellMenuItem[] = [
  { key: "home", label: "工作台", icon: "home" },
  {
    key: "sys",
    label: "系统",
    icon: "user",
    children: [
      { key: "users", label: "用户" },
      { key: "roles", label: "角色" },
    ],
  },
];
const crumbs = [
  { label: "系统" },
  { label: "用户" },
];

const codes = {
  vue: `<AppShell
  brand="Argon"
  :items="items"
  :selected-key="selected"
  :pinned="pinned"
  :breadcrumb="crumbs"
  embed
  @select="selected = $event"
  @pinned-change="pinned = $event"
>
  <template #extra><Button size="sm" variant="neutral">admin</Button></template>
  页面内容
</AppShell>`,
  react: `<AppShell
  items={items}
  selectedKey={selected}
  pinned={pinned}
  breadcrumb={crumbs}
  embed
  onSelect={setSelected}
  onPinnedChange={setPinned}
  extra={<Button size="sm" variant="neutral">admin</Button>}
>
  页面内容
</AppShell>`,
  svelte: `<AppShell
  {items}
  selectedKey={selected}
  {pinned}
  breadcrumb={crumbs}
  embed
  onselect={setSelected}
  onpinnedchange={setPinned}
>
  页面内容
</AppShell>`,
  html: `<div id="shell"></div>
<script type="module">
  import { AppShell } from '@argon-kit/html'
  const shell = new AppShell('#shell', {
    header: 'Argon',
    sidebar: '系统 / 用户',
    footer: '© 2026 Argon UI Kit',
  })
  shell.setContent('页面内容')
<\/script>`,
};
</script>

<template>
  <h1>AppShell 后台壳</h1>
  <p class="doc-lead">
    侧栏 62 / 250 + 顶栏 64 白底 + 内容 + 页脚。不绑路由和权限：菜单点击只回调 key。收起后悬停侧栏会临时展开。文档预览请开 <code>embed</code>。
  </p>

  <DemoBlock title="布局" :codes="codes">
    <div style="width: 100%">
      <AppShell
        brand="Argon"
        :items="items"
        :selected-key="selected"
        :pinned="pinned"
        :breadcrumb="crumbs"
        footer="© 2026 Argon UI Kit"
        embed
        @select="selected = $event"
        @pinned-change="pinned = $event"
      >
        <template #extra>
          <Button size="sm" variant="neutral">admin</Button>
        </template>
        当前菜单：{{ selected }}
      </AppShell>
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['items', '侧栏菜单 { key, label, icon?, children? }', 'ShellMenuItem[]', '[]'],
      ['selectedKey', '选中叶子 key', 'string', '—'],
      ['pinned', '侧栏是否钉住展开', 'boolean', 'true'],
      ['breadcrumb', '顶栏面包屑', 'BreadcrumbItem[]', '[]'],
      ['embed', '文档/预览用，侧栏改为绝对定位', 'boolean', 'false'],
      ['brand / logo', '品牌文案与字母标', 'string', 'Argon / A'],
    ]"
  />
</template>
