<script setup lang="ts">
import { notification, Spin, Button } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const types = ["primary", "success", "warning", "error", "info"] as const;

const notifCodes = {
  vue: `import { notification } from '@argon-kit/vue';\n\nnotification.success({\n  title: '保存成功',\n  content: '数据已写入数据库',\n  duration: 4500,\n});`,
  react: `import { notification } from '@argon-kit/react';\n\nnotification.success({ title: '保存成功', content: '数据已写入数据库' });`,
  svelte: `import { notification } from '@argon-kit/svelte';\n\nnotification.success({ title: '保存成功', content: '数据已写入数据库' });`,
};
const spinCodes = {
  vue: `<Spin />\n<Spin spinning size="lg" text="加载中…">内容</Spin>`,
  react: `<Spin />\n<Spin spinning size="lg" text="加载中…">内容</Spin>`,
  svelte: `<Spin />\n<Spin spinning size="lg" text="加载中…">内容</Spin>`,
};

function fire(type: (typeof types)[number]) {
  notification[type]({
    title: `${type} 通知`,
    content: "这是一条从右上角弹出的通知，4.5 秒后自动关闭。",
  });
}
</script>

<template>
  <h1>Notification 通知 / Spin 加载</h1>
  <p class="doc-lead">命令式 API（同 message）：notification.success(...) 右上角弹出，可手动关闭。Spin 提供加载指示。</p>

  <h2>Notification</h2>
  <DemoBlock title="五种类型" :codes="notifCodes">
    <Button
      v-for="t in types"
      :key="t"
      :variant="t === 'error' ? 'danger' : t === 'primary' ? 'primary' : t"
      style="margin-right: 8px"
      @click="fire(t)"
    >
      {{ t }}
    </Button>
  </DemoBlock>

  <h2>Spin</h2>
  <DemoBlock title="独立与包裹模式" :codes="spinCodes">
    <div style="display: flex; align-items: center; gap: 32px">
      <Spin size="sm" />
      <Spin />
      <Spin size="lg" />
      <Spin text="加载中…" />
      <div style="width: 200px; height: 80px; border: 1px dashed var(--ag-gray-300); border-radius: 6px">
        <Spin spinning text="加载中…">
          <div style="padding: 24px">被包裹的内容区域</div>
        </Spin>
      </div>
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['notification.*', 'primary / success / error / warning / info', '(options) => void', '—'],
      ['options.title / content', '标题与正文', 'string', 'title 必填'],
      ['options.duration', '自动关闭毫秒数（0 不关闭）', 'number', '4500'],
      ['options.onClose', '关闭回调', '() => void', '—'],
      ['Spin.size', '尺寸', 'sm / md / lg', 'md'],
      ['Spin.spinning', '包裹模式下是否显示遮罩', 'boolean', 'true'],
    ]"
  />
</template>
