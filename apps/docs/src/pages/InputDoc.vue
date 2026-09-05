<script setup lang="ts">
import { ref } from "vue";
import { Input, Password, Textarea, InputNumber } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const name = ref("");
const pwd = ref("");
const bio = ref("");
const age = ref("");
const inputCodes = {
  vue: `<Input v-model="name" placeholder="请输入姓名" />`,
  react: `<Input value={name} onChange={e => setName(e.target.value)} placeholder="请输入姓名" />`,
  svelte: `<Input bind:value={name} placeholder="请输入姓名" />`,
  html: `<input id="name" />
<script type="module">
  import { Input } from '@argon-kit/html'
  new Input('#name', {
    placeholder: '请输入姓名',
    onChange: (value) => console.log(value),
  })
<\/script>`,
};
</script>

<template>
  <h1>Input 输入框</h1>
  <p class="doc-lead">40px 高、4px 圆角、focus 主色边框 + 柔和阴影。Password / Textarea / InputNumber 同源。</p>

  <h2>基础</h2>
  <DemoBlock
    title="受控输入"
    stack
    :codes="inputCodes"
  >
    <Input v-model="name" placeholder="请输入姓名" />
    <Password v-model="pwd" placeholder="密码" />
    <InputNumber v-model="age" placeholder="年龄" />
    <Textarea v-model="bio" placeholder="备注" />
  </DemoBlock>

  <h2>校验态</h2>
  <DemoBlock title="error / success + hint" stack>
    <Input status="error" hint="姓名不能为空" placeholder="错误" />
    <Input status="success" hint="可以使用" placeholder="成功" />
    <Input disabled placeholder="禁用" />
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['value / v-model / bind:value', '输入值', 'string', ''],
      ['placeholder', '占位', 'string', '—'],
      ['disabled', '禁用', 'boolean', 'false'],
      ['status', '校验态', 'error / success', '—'],
      ['hint', '下方提示', 'string', '—'],
      ['prefix / suffix', '前后缀（React prop，Vue/Svelte slot）', 'node', '—'],
    ]"
  />
</template>
