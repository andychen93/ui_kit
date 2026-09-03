<script setup lang="ts">
import { ref } from "vue";
import { Tabs } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const tab = ref("account");
const codes = {
  vue: `<Tabs :items="items" :active="tab" @change="tab = $event" />`,
  react: `<Tabs items={items} active={tab} onChange={setTab}>{panel}</Tabs>`,
  svelte: `<Tabs {items} active={tab} onchange={setTab}>{panel}</Tabs>`,
};
</script>

<template>
  <h1>Tabs 标签页</h1>
  <p class="doc-lead">顶栏下划线指示当前项。Login 内部也用这一套。</p>

  <DemoBlock title="基础" :codes="codes">
    <div style="width: 100%">
      <Tabs
        :items="[
          { key: 'account', label: '默认登录' },
          { key: 'tenant', label: '租户登录' },
        ]"
        :active="tab"
        @change="tab = $event"
      >
        当前：{{ tab === "account" ? "账号密码" : "带租户" }}
      </Tabs>
    </div>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型']"
    :rows="[
      ['items', '{ key, label, disabled? }[]', 'TabItem[]'],
      ['active', '当前 key', 'string'],
      ['center', '居中（登录页）', 'boolean'],
    ]"
  />
</template>
