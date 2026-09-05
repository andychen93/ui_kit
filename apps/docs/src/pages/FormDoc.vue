<script setup lang="ts">
import { reactive, ref } from "vue";
import { Form, FormItem, Input, Select, Button, message } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const model = reactive({ username: "", email: "", city: null as string | number | null });
const formRef = ref<InstanceType<typeof Form> | null>(null);

const rules = {
  username: [
    { required: true, message: "请输入用户名" },
    { min: 2, max: 20, message: "2-20 字符" },
  ],
  email: [{ type: "email" as const, message: "邮箱格式不正确" }],
};

const basicCodes = {
  vue: `<Form ref="formRef" :model="model" :rules="rules">
  <FormItem name="username" label="用户名" :span="12">
    <Input v-model="model.username" placeholder="2-20 字符" />
  </FormItem>
  <FormItem name="email" label="邮箱" :span="12">
    <Input v-model="model.email" placeholder="选填" />
  </FormItem>
</Form>

// 提交：校验失败自动标红
const values = await formRef.value.validate();`,
  react: `const [model, setModel] = useState({ username: "", email: "" });

<Form model={model} rules={rules}>
  <FormItem name="username" label="用户名" span={12}>
    <Input value={model.username} onChange={(e) => ...} />
  </FormItem>
</Form>`,
  svelte: `<Form {model} {rules} layout="vertical">
  <FormItem name="username" label="用户名" span={12}>
    <Input bind:value={model.username} />
  </FormItem>
</Form>`,
  html: `<form id="form">
  <input name="username" placeholder="2-20 字符" />
  <input name="email" placeholder="选填" />
</form>
<script type="module">
  import { Form } from '@argon-kit/html'
  const form = new Form('#form', {
    fields: [
      { name: 'username', required: true, minLength: 2, maxLength: 20 },
      { name: 'email', pattern: '^[^@]+@[^@]+\\.[^@]+$' },
    ],
    onSubmit: (values) => console.log(values),
  })
<\/script>`,
};

async function submit() {
  try {
    const values = await formRef.value?.validate();
    message.success(`校验通过：${JSON.stringify(values)}`);
  } catch {
    message.error("请检查表单错误");
  }
}
</script>

<template>
  <h1>Form 表单 / 校验</h1>
  <p class="doc-lead">
    轻量校验引擎（required/pattern/min-max/len/type/validator，对齐 rbac 实际使用的 antd 规则子集）。
    校验失败自动标红控件并显示错误文案，值修正后红字即时消失。
  </p>

  <h2>基础校验</h2>
  <DemoBlock title="必填 + 长度 + 邮箱格式" :codes="basicCodes">
    <Form ref="formRef" :model="model" :rules="rules">
      <FormItem name="username" label="用户名" :span="12">
        <Input v-model="model.username" placeholder="2-20 字符" />
      </FormItem>
      <FormItem name="email" label="邮箱" :span="12" hint="选填">
        <Input v-model="model.email" placeholder="name@example.com" />
      </FormItem>
      <FormItem name="city" label="城市" :span="12">
        <Select
          v-model="model.city"
          :options="[
            { label: '北京', value: 1 },
            { label: '上海', value: 2 },
          ]"
          allow-clear
        />
      </FormItem>
      <FormItem :span="24">
        <div style="display: flex; gap: 8px">
          <Button size="sm" @click="submit">提交校验</Button>
          <Button size="sm" variant="neutral" @click="formRef?.resetFields()">重置</Button>
          <Button size="sm" variant="link" @click="formRef?.clearValidate()">清除校验</Button>
        </div>
      </FormItem>
    </Form>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['model（Form）', '表单数据对象（控件 v-model 直接绑它的键）', 'Record<string, unknown>', '必填'],
      ['rules（Form）', 'Form 级规则表', 'Record<string, FormRule[]>', '—'],
      ['layout（Form）', '标签位置', 'horizontal / vertical', 'horizontal'],
      ['validate（Form）', '整表校验；失败 throw errors 并标红', '() => Promise<values>', '—'],
      ['resetFields（Form）', '重置到初始快照并清校验', '() => void', '—'],
      ['name（FormItem）', '对应 model 的键', 'string', '—'],
      ['rules（FormItem）', '字段级规则（覆盖 Form 级）', 'FormRule[]', '—'],
      ['span（FormItem）', '24 栅格跨度', '24 / 12 / 8', '24'],
    ]"
  />

  <h2>FormRule 规则</h2>
  <ApiTable
    :columns="['规则', '说明', '示例']"
    :rows="[
      ['required', '必填（空串/空数组视为空）', '{ required: true, message: \'请输入用户名\' }'],
      ['pattern', '正则', '{ pattern: /^1[3-9]\\\\d{9}$/, message: \'手机号格式\' }'],
      ['min / max', '字符串长度或数字范围', '{ min: 2, max: 20, message: \'2-20 字符\' }'],
      ['len', '精确长度', '{ len: 17, message: \'VIN 为 17 位\' }'],
      ['type', '内置格式', '{ type: \'email\', message: \'邮箱格式不正确\' }'],
      ['validator', '自定义（true 通过 / string 为错误）', '{ validator: (v) => v > 0, message: \'须大于 0\' }'],
    ]"
  />
</template>
