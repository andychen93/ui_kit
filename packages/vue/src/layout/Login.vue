<script setup lang="ts">
import { ref } from "vue";
import Button from "../button/Button.vue";
import Input from "../input/Input.vue";
import Password from "../input/Password.vue";
import Select from "../select/Select.vue";
import Glyph from "../glyph/Glyph.vue";
import Tabs from "./Tabs.vue";

export interface LoginValues {
  username: string;
  password: string;
  tenantCode?: string;
}

withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    logo?: string;
    loading?: boolean;
    showTenant?: boolean;
    tenantOptions?: { label: string; value: string | number }[];
    hint?: string;
    embed?: boolean;
  }>(),
  {
    title: "Argon UI Kit",
    subtitle: "欢迎回来",
    logo: "A",
    loading: false,
    showTenant: true,
    tenantOptions: () => [{ label: "默认租户", value: "" }],
    embed: false,
  },
);

const emit = defineEmits<{ submit: [values: LoginValues] }>();

const tab = ref<"default" | "tenant">("default");
const username = ref("");
const password = ref("");
const tenantCode = ref<string | number | null>("");

function onSubmit() {
  emit("submit", {
    username: username.value,
    password: password.value,
    tenantCode: tab.value === "tenant" ? String(tenantCode.value ?? "") : undefined,
  });
}
</script>

<template>
  <div :class="['ag-login', embed ? 'ag-login--embed' : '']">
    <div class="ag-login__card">
      <div class="ag-login__brand">
        <div class="ag-login__mark">{{ logo }}</div>
        <h1 class="ag-login__title">{{ title }}</h1>
        <p class="ag-login__sub">{{ subtitle }}</p>
      </div>
      <Tabs
        v-if="showTenant"
        center
        :items="[
          { key: 'default', label: '默认登录' },
          { key: 'tenant', label: '租户登录' },
        ]"
        :active="tab"
        @change="tab = $event as 'default' | 'tenant'"
      >
        <form @submit.prevent="onSubmit">
          <Select
            v-if="tab === 'tenant'"
            :options="tenantOptions"
            v-model="tenantCode"
            placeholder="选择租户"
          />
          <Input v-model="username" placeholder="用户名" required>
            <template #prefix><Glyph name="user" /></template>
          </Input>
          <Password v-model="password" placeholder="密码" required>
            <template #prefix><Glyph name="lock" /></template>
          </Password>
          <slot name="captcha" />
          <Button type="submit" block :loading="loading" style="margin-top: 8px">登录</Button>
        </form>
      </Tabs>
      <form v-else @submit.prevent="onSubmit">
        <Input v-model="username" placeholder="用户名" required>
          <template #prefix><Glyph name="user" /></template>
        </Input>
        <Password v-model="password" placeholder="密码" required>
          <template #prefix><Glyph name="lock" /></template>
        </Password>
        <slot name="captcha" />
        <Button type="submit" block :loading="loading" style="margin-top: 8px">登录</Button>
      </form>
      <p v-if="hint" class="ag-login__hint">{{ hint }}</p>
    </div>
  </div>
</template>
