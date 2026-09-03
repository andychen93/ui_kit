<script setup lang="ts">
import { Button, Tooltip, Popover, Dropdown, Popconfirm, message } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const overlayCodes = {
  vue: `<Tooltip title="提示文字"><Button>悬停</Button></Tooltip>
<Popover><Button>点击</Button><template #content>面板内容</template></Popover>`,
  react: `<Tooltip title="提示文字"><Button>悬停</Button></Tooltip>
<Popover content="面板内容"><Button>点击</Button></Popover>`,
  svelte: `<Tooltip title="提示文字"><Button>悬停</Button></Tooltip>`,
};
const menuCodes = {
  vue: `<Dropdown :items="items" @select="onSelect" />
<Popconfirm title="确定删除？" @confirm="onDelete" />`,
  react: `<Dropdown items={items} />
<Popconfirm title="确定删除？" onConfirm={onDelete} />`,
  svelte: `<Dropdown {items} onselect={onSelect} />
<Popconfirm title="确定删除？" onconfirm={onDelete} />`,
};

function onSelect(k: string) {
  message.info(k);
}
</script>

<template>
  <h1>Tooltip / Popover / Dropdown / Popconfirm</h1>
  <p class="doc-lead">轻量浮层。Tooltip 悬停，其余点击触发，点外侧关闭。</p>

  <h2>Tooltip / Popover</h2>
  <DemoBlock title="基础" :codes="overlayCodes">
    <Tooltip title="Argon primary #5e72e4">
      <Button variant="neutral">悬停提示</Button>
    </Tooltip>
    <Popover>
      <Button>气泡卡片</Button>
      <template #content>
        <p style="margin: 0; width: 200px">用于说明、筛选条件或简短表单。</p>
      </template>
    </Popover>
  </DemoBlock>

  <h2>Dropdown / Popconfirm</h2>
  <DemoBlock title="菜单与确认" :codes="menuCodes">
    <Dropdown
      :items="[
        { key: 'edit', label: '编辑' },
        { key: 'del', label: '删除', danger: true },
      ]"
      @select="onSelect"
    >
      <Button variant="neutral">更多</Button>
    </Dropdown>
    <Popconfirm title="确定删除这条记录？" @confirm="message.success('已删除')">
      <Button variant="danger">删除</Button>
    </Popconfirm>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['组件', '关键属性']"
    :rows="[
      ['Tooltip', 'title'],
      ['Popover', '默认插槽 trigger，#content 面板'],
      ['Dropdown', 'items[{ key, label, danger, disabled }]'],
      ['Popconfirm', 'title + confirm 回调'],
    ]"
  />
</template>
