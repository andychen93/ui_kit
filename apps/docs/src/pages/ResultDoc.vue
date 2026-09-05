<script setup lang="ts">
import { Button, Result } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const codes = {
  vue: `<Result status="403">
  <template #extra><Button>返回首页</Button></template>
</Result>`,
  react: `<Result status="403" extra={<Button>返回首页</Button>} />`,
  svelte: `<Result status="403">{#snippet extra()}<Button>返回首页</Button>{/snippet}</Result>`,
  html: `<div id="result"></div>
<script type="module">
  import { Result } from '@argon-kit/html'
  new Result('#result', {
    icon: 'error',
    title: '403',
    description: '抱歉，您没有权限访问此页面。',
    extra: '返回首页',
  })
<\/script>`,
};
</script>

<template>
  <h1>Result 结果页</h1>
  <p class="doc-lead">403 / 404 / 500 空态。业务侧决定跳转，组件只负责展示。</p>

  <DemoBlock title="403" :codes="codes">
    <Result status="403">
      <template #extra>
        <Button variant="neutral">返回首页</Button>
      </template>
    </Result>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型']"
    :rows="[
      ['status', '403 / 404 / 500', 'string'],
      ['title / subTitle', '覆盖默认文案', 'string'],
      ['extra', '底部操作', 'slot / node'],
    ]"
  />
</template>
