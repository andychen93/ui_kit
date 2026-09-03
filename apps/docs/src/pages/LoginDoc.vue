<script setup lang="ts">
import { Login, message } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const codes = {
  vue: `<Login
  title="Argon UI Kit"
  hint="测试账号 admin / 任意密码"
  @submit="onSubmit"
/>`,
  react: `<Login title="Argon UI Kit" onSubmit={onSubmit} />`,
  svelte: `<Login title="Argon UI Kit" onsubmit={onSubmit} />`,
};

function onSubmit(v: { username: string; password: string; tenantCode?: string }) {
  message.success(`登录 ${v.username}${v.tenantCode ? " / " + v.tenantCode : ""}`);
}
</script>

<template>
  <h1>Login 登录页</h1>
  <p class="doc-lead">
    页面模板：品牌标 + Tabs（默认 / 租户）+ 用户名密码。验证码、租户列表由业务传入，组件库不发请求。
  </p>

  <DemoBlock title="登录模板" :codes="codes">
    <div style="width: 100%">
      <Login
        embed
        hint="演示：任意账号密码都会提示成功"
        :tenant-options="[
          { label: '默认租户', value: '' },
          { label: '演示租户', value: 'demo' },
        ]"
        @submit="onSubmit"
      />
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型']"
    :rows="[
      ['title / subtitle / logo', '品牌区', 'string'],
      ['showTenant', '是否显示租户 Tab', 'boolean'],
      ['tenantOptions', '租户下拉', '{ label, value }[]'],
      ['captcha', '验证码槽', 'slot / node'],
      ['onSubmit', '{ username, password, tenantCode? }', 'function'],
    ]"
  />
</template>
