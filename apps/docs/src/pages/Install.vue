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
  html: `<link rel="stylesheet" href="@argon-kit/styles/dist/index.css">

<button id="save-btn">保存</button>

<script type="module">
  import { Button } from '@argon-kit/html'

  new Button('#save-btn', { variant: 'primary' })
<\/script>`,
};
</script>

<template>
  <h1>安装</h1>
  <p class="doc-lead">按你使用的框架安装对应包，并引入一次样式。顶栏可切换 Vue / React / Svelte / HTML。</p>

  <h2>包管理器</h2>
  <pre class="doc-install">pnpm add {{ pkg }} @argon-kit/styles</pre>

  <h2>引入样式</h2>
  <pre class="doc-install">import '@argon-kit/styles'</pre>

  <h2>最小示例</h2>
  <pre class="doc-install">{{ samples[fw] }}</pre>
</template>
