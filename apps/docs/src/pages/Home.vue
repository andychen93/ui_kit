<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Button } from "@argon-kit/vue";
</script>

<template>
  <div class="doc-home">
    <header class="doc-hero">
      <h1>Argon UI Kit</h1>
      <p>Argon 视觉语言的 Vue / React / Svelte 组件库。16px 正文，Lucide 开源图标，面向后台 CRUD。</p>
      <div class="doc-hero__actions">
        <RouterLink to="/guide/install">
          <Button variant="neutral" size="lg">开始使用</Button>
        </RouterLink>
        <RouterLink to="/components/button">
          <Button variant="outline" size="lg" style="background: transparent; color: #fff; border-color: #fff">
            组件
          </Button>
        </RouterLink>
      </div>
    </header>
    <div class="doc-features">
      <article class="doc-feature">
        <h3>三框架同一套样式</h3>
        <p>CSS 变量与 ag-* 类名集中维护，Vue / React / Svelte API 对齐。</p>
      </article>
      <article class="doc-feature">
        <h3>为后台而生</h3>
        <p>对照 precision / rbac 真实用量：表单、表格、PageSelect、ProTable。</p>
      </article>
      <article class="doc-feature">
        <h3>开源可托管</h3>
        <p>静态文档站，GitHub Pages / Cloudflare Pages 一条命令部署。</p>
      </article>
    </div>
  </div>
</template>
