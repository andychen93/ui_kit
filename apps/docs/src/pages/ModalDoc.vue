<script setup lang="ts">
import { ref } from "vue";
import { Button, Modal, Drawer, message } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const modalOpen = ref(false);
const drawerOpen = ref(false);
const submitOpen = ref(false);
const submitting = ref(false);

const modalCodes = {
  vue: `<Modal :open="open" title="编辑用户" @close="open = false">内容</Modal>`,
  react: `<Modal open={open} title="编辑用户" onClose={() => setOpen(false)}>内容</Modal>`,
  svelte: `<Modal {open} title="编辑用户" onclose={() => (open = false)}>内容</Modal>`,
};

const confirmCodes = {
  vue: `<Modal
  v-model:open="submitOpen"
  title="提交示例"
  :confirm-loading="submitting"
  :width="480"
  @close="submitOpen = false"
  @confirm="handleConfirm"
>
  内容
</Modal>`,
  react: `<Modal
  open={submitOpen}
  title="提交示例"
  confirmLoading={submitting}
  width={480}
  onClose={() => setSubmitOpen(false)}
  onConfirm={handleConfirm}
>
  内容
</Modal>`,
  svelte: `<Modal
  bind:open={submitOpen}
  title="提交示例"
  confirmLoading={submitting}
  width={480}
  onclose={() => (submitOpen = false)}
  onconfirm={handleConfirm}
>
  内容
</Modal>`,
};

async function handleConfirm() {
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  submitting.value = false;
  submitOpen.value = false;
  message.success("提交成功");
}
</script>

<template>
  <h1>Modal / Drawer</h1>
  <p class="doc-lead">对话框与右侧抽屉，挂到 body。Esc 关闭 Modal。CRUD 表单弹窗用 Modal（或直接用 CrudFormModal）。</p>

  <DemoBlock title="打开" :codes="modalCodes">
    <Button @click="modalOpen = true">打开 Modal</Button>
    <Button variant="neutral" @click="drawerOpen = true">打开 Drawer</Button>
    <Modal :open="modalOpen" title="编辑用户" @close="modalOpen = false">
      这里放表单。确定 / 取消在默认页脚，也可用 #footer 自定义。
    </Modal>
    <Drawer :open="drawerOpen" title="详情" @close="drawerOpen = false">
      日志、Descriptions 等长内容适合抽屉。
    </Drawer>
  </DemoBlock>

  <h2>提交确认（confirm + loading）</h2>
  <DemoBlock title="确定按钮触发 confirm 事件，confirmLoading 防重复提交" :codes="confirmCodes">
    <Button @click="submitOpen = true">打开提交示例</Button>
    <Modal
      v-model:open="submitOpen"
      title="提交示例"
      :confirm-loading="submitting"
      :width="480"
      @confirm="handleConfirm"
    >
      点击「确定」后按钮转圈 1.2 秒模拟提交，期间不可重复点击。
    </Modal>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型']"
    :rows="[
      ['open', '是否显示', 'boolean'],
      ['title', '标题', 'string'],
      ['width', '宽度 px（默认 520）', 'number'],
      ['confirmLoading', '确定按钮 loading（防重复提交）', 'boolean'],
      ['hideFooter', '隐藏底部', 'boolean'],
      ['onConfirm / @confirm / onconfirm', '确定回调（默认页脚触发）', '() => void'],
      ['onClose / @close / onclose', '关闭回调', '() => void'],
    ]"
  />
</template>
