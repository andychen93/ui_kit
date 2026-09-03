<script setup lang="ts">
import { Button, message } from "@argon-kit/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const messageCodes = {
  vue: `import { message } from '@argon-kit/vue'\nmessage.success('已保存')`,
  react: `import { message } from '@argon-kit/react'\nmessage.success('已保存')`,
  svelte: `import { message } from '@argon-kit/svelte'\nmessage.success('已保存')`,
};
</script>

<template>
  <h1>Message 全局提示</h1>
  <p class="doc-lead">顶部居中轻提示，三框架共用 @argon-kit/core，无需 notification 堆叠角标。</p>

  <DemoBlock
    title="四种状态"
    :codes="messageCodes"
  >
    <Button variant="success" @click="message.success('已保存')">Success</Button>
    <Button variant="danger" @click="message.error('失败')">Error</Button>
    <Button variant="warning" @click="message.warning('注意')">Warning</Button>
    <Button variant="info" @click="message.info('提示')">Info</Button>
  </DemoBlock>

  <h2>API</h2>
  <ApiTable
    :columns="['方法', '说明']"
    :rows="[
      ['message.success(content, duration?)', '成功'],
      ['message.error(content, duration?)', '失败'],
      ['message.warning(content, duration?)', '警告'],
      ['message.info(content, duration?)', '信息'],
    ]"
  />
</template>
