<script setup lang="ts">
import { computed } from "vue";
import { useFramework } from "../framework";

const fw = useFramework();
const pkg = computed(() => `@argon-kit/${fw.value}`);

const samples = {
  vue: `<script setup>
import { Button } from '@argon-kit/vue'
<\/script>

<template>
  <Button variant="primary">保存</Button>
</template>`,
  react: `import { Button } from '@argon-kit/react'

export function App() {
  return <Button variant="primary">保存</Button>
}`,
  svelte: `<script>
  import { Button } from '@argon-kit/svelte'
<\/script>

<Button variant="primary">保存</Button>`,
};
</script>

<template>
  <h1>安装</h1>
  <p class="doc-lead">按你使用的框架安装对应包，并引入一次样式。顶栏可切换 Vue / React / Svelte。</p>

  <h2>包管理器</h2>
  <pre class="doc-install">pnpm add {{ pkg }} @argon-kit/styles</pre>

  <h2>引入样式</h2>
  <pre class="doc-install">import '@argon-kit/styles'</pre>

  <h2>最小示例</h2>
  <pre class="doc-install">{{ samples[fw] }}</pre>
</template>
