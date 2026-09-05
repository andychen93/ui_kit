<script setup lang="ts">
import { ref } from "vue";
import { SweetAlert, Button } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const open = ref(false);
const type = ref<"success" | "error" | "warning" | "info">("success");
const lastAction = ref("");

const presets = [
  { type: "success" as const, title: "操作成功", content: "车辆信息已保存并生效。" },
  { type: "error" as const, title: "删除失败", content: "该车辆存在未完结的工单，无法删除。" },
  { type: "warning" as const, title: "确认删除？", content: "删除后不可恢复，请谨慎操作。", showCancel: true },
  { type: "info" as const, title: "版本更新", content: "v2.4.0 新增了车队报表导出功能。" },
];
const current = ref(presets[0]);

const demoCodes = {
  vue: `<SweetAlert\n  v-model:open="open"\n  type="warning"\n  title="确认删除？"\n  content="删除后不可恢复"\n  show-cancel\n  @confirm="onConfirm"\n  @cancel="onCancel"\n/>`,
  react: `<SweetAlert\n  open={open}\n  type="warning"\n  title="确认删除？"\n  content="删除后不可恢复"\n  showCancel\n  onConfirm={onConfirm}\n  onCancel={onCancel}\n/>`,
  svelte: `<SweetAlert\n  open={open}\n  type="warning"\n  title="确认删除？"\n  content="删除后不可恢复"\n  showCancel\n  onconfirm={onConfirm}\n  oncancel={onCancel}\n/>`,
  html: `<button id="btn">warning</button>
<script type="module">
  import { fireSweetAlert } from '@argon-kit/html'
  document.querySelector('#btn').addEventListener('click', async () => {
    const { confirmed } = await fireSweetAlert({
      type: 'warning',
      title: '确认删除？',
      description: '删除后不可恢复',
      showCancel: true,
    })
    console.log(confirmed ? 'confirm' : 'cancel')
  })
<\/script>`,
};

function openPreset(p: (typeof presets)[number]) {
  current.value = p;
  type.value = p.type;
  open.value = true;
}
</script>

<template>
  <h1>SweetAlert 甜心弹窗</h1>
  <p class="doc-lead">rbac 风格：居中 80px 渐变圆图标 + 标题 + 内容 + 操作按钮，用于结果反馈与二次确认。</p>

  <DemoBlock title="四种类型" :codes="demoCodes">
    <Button
      v-for="p in presets"
      :key="p.type"
      :variant="p.type === 'error' ? 'danger' : p.type"
      style="margin-right: 8px"
      @click="openPreset(p)"
    >
      {{ p.type }}
    </Button>
    <p v-if="lastAction" style="margin-top: 12px; color: var(--ag-gray-600)">
      上一次操作：{{ lastAction }}
    </p>
  </DemoBlock>

  <SweetAlert
    :open="open"
    :type="type"
    :title="current.title"
    :content="current.content"
    :show-cancel="current.showCancel"
    @confirm="open = false; lastAction = 'confirm（' + current.type + '）'"
    @cancel="open = false; lastAction = 'cancel（' + current.type + '）'"
  />

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['open', '是否显示', 'boolean', 'false'],
      ['type', '类型（决定渐变图标色）', 'success / error / warning / info / primary', 'success'],
      ['title / content', '标题与正文', 'string', '—'],
      ['showCancel', '显示取消按钮', 'boolean', 'false'],
      ['confirmText / cancelText', '按钮文案', 'string', '确定 / 取消'],
      ['confirm / cancel', '回调事件', 'event', '—'],
    ]"
  />
</template>
