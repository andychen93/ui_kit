<script setup lang="ts">
import { ref } from "vue";
import { RichText } from "@argon-kit/editor/vue";
import DemoBlock from "../components/DemoBlock.vue";
import ApiTable from "../components/ApiTable.vue";

const html = ref(
  "<h2>车队公告</h2><p>以下是<strong>本周重点</strong>：</p><ul><li>周三全员安全培训</li><li>周五前完成 <em>年检</em> 上报</li></ul><p><br></p>",
);

const codes = {
  vue: `import { RichText } from "@argon-kit/editor/vue";

<RichText v-model="html" placeholder="请输入内容…" />`,
  react: `import { RichText } from "@argon-kit/editor/react";

<RichText defaultValue={html} placeholder="请输入内容…" onChange={setHtml} />`,
  svelte: `import { RichText } from "@argon-kit/editor/svelte";

<RichText placeholder="请输入内容…" onchange={(v) => (html = v)} />`,
};
</script>

<template>
  <h1>RichText 富文本</h1>
  <p class="doc-lead">
    Quill 2 底座 + Argon 皮肤（snow 主题重着色：主色激活按钮、16px 正文）。
    独立包 <code>@argon-kit/editor</code>。
  </p>

  <DemoBlock title="基础" :codes="codes">
    <RichText v-model="html" />
  </DemoBlock>

  <p style="margin-top: 12px; font-size: 13px; color: var(--ag-gray-600)">当前 HTML：{{ html.slice(0, 80) }}…</p>

  <h2>API</h2>
  <ApiTable
    :columns="['属性', '说明', '类型', '默认']"
    :rows="[
      ['modelValue', '内容 HTML（v-model）', 'string', '—'],
      ['placeholder', '占位文案', 'string', '请输入内容…'],
      ['toolbar', '工具栏配置', 'any[][]', '精简默认'],
      ['readonly', '只读（隐藏工具栏）', 'boolean', 'false'],
      ['height', '编辑区最小高度 px', 'number', '220'],
    ]"
  />
</template>
