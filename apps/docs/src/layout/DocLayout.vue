<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { provideFramework, type Framework } from "../framework";

const { framework, select } = provideFramework();
const fws: Framework[] = ["vue", "react", "svelte", "html"];

const nav = [
  {
    title: "开发指南",
    items: [{ to: "/guide/install", label: "安装" }],
  },
  {
    title: "通用",
    items: [
      { to: "/components/button", label: "Button 按钮" },
      { to: "/components/alert", label: "Alert 警告提示" },
      { to: "/components/badge", label: "Badge / Tag" },
      { to: "/components/avatar", label: "Avatar 头像" },
      { to: "/components/card", label: "Card 卡片" },
    ],
  },
  {
    title: "表单",
    items: [
      { to: "/components/input", label: "Input 输入框" },
      { to: "/components/select", label: "Select 选择器" },
      { to: "/components/checkbox", label: "Checkbox / Radio" },
      { to: "/components/switch", label: "Switch 开关" },
      { to: "/components/upload", label: "Upload 上传" },
      { to: "/components/datepicker", label: "DatePicker 日期" },
      { to: "/components/slider", label: "Slider 滑块" },
      { to: "/components/form", label: "Form 表单校验" },
    ],
  },
  {
    title: "数据",
    items: [
      { to: "/components/table", label: "Table 表格" },
      { to: "/components/page-select", label: "PageSelect 分页选择" },
      { to: "/components/pro-table", label: "ProTable 查询表格" },
      { to: "/components/crud-form-modal", label: "CrudFormModal 弹窗" },
      { to: "/components/tree-select", label: "TreeSelect 树选择" },
      { to: "/components/tree", label: "Tree 树" },
      { to: "/components/transfer", label: "Transfer 穿梭框" },
      { to: "/components/stat-card", label: "StatCard 指标卡" },
      { to: "/components/progress", label: "Progress 进度条" },
      { to: "/components/timeline", label: "Timeline 时间线" },
      { to: "/components/descriptions", label: "Descriptions 详情" },
      { to: "/components/list", label: "List / Empty" },
      { to: "/components/steps", label: "Steps 步骤条" },
      { to: "/components/collapse", label: "Collapse 折叠面板" },
    ],
  },
  {
    title: "导航与布局",
    items: [
      { to: "/components/app-shell", label: "AppShell 后台壳" },
      { to: "/components/tabs", label: "Tabs 标签页" },
      { to: "/components/login", label: "Login 登录" },
      { to: "/components/result", label: "Result 403" },
    ],
  },
  {
    title: "反馈",
    items: [
      { to: "/components/message", label: "Message 提示" },
      { to: "/components/notification", label: "Notification / Spin" },
      { to: "/components/sweet-alert", label: "SweetAlert 弹窗" },
      { to: "/components/overlay", label: "Tooltip / Popover" },
      { to: "/components/modal", label: "Modal / Drawer" },
    ],
  },
  {
    title: "插件组件",
    items: [
      { to: "/plugins/charts", label: "Charts 图表" },
      { to: "/plugins/calendar", label: "Calendar 日历" },
      { to: "/plugins/rich-text", label: "RichText 富文本" },
      { to: "/plugins/slider-tags", label: "Slider / Tags" },
      { to: "/plugins/select-carousel", label: "MultiSelect / Carousel" },
      { to: "/plugins/dropzone", label: "Dropzone 上传" },
      { to: "/plugins/vector-map", label: "VectorMap 地图" },
    ],
  },
];
</script>

<template>
  <header class="doc-header">
    <RouterLink class="doc-logo" to="/"><span /><b>Argon UI Kit</b></RouterLink>
    <div class="doc-header__right">
      <div class="doc-fw">
        <button
          v-for="f in fws"
          :key="f"
          :class="{ 'is-active': framework === f }"
          @click="select(f)"
        >
          {{ f }}
        </button>
      </div>
      <a class="doc-github" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
    </div>
  </header>
  <div class="doc-shell">
    <aside class="doc-aside">
      <div v-for="g in nav" :key="g.title" class="doc-aside__group">
        <p class="doc-aside__title">{{ g.title }}</p>
        <RouterLink v-for="item in g.items" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
      </div>
    </aside>
    <main class="doc-main">
      <RouterView />
    </main>
  </div>
</template>
