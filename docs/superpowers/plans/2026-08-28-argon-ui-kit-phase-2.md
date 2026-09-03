# Argon UI Kit Phase 2 + Docs Site

> **For agentic workers:** Execute this plan; docs site is part of open-source delivery.

**Goal:** Phase 2 表单组件（三框架）+ Element Plus / Ant Design 风格文档站，可 GitHub Pages 开源托管。

**Architecture:** 样式仍在 `@argon-kit/styles`。`@argon-kit/core` 放无框架 Message。`apps/docs` 用 Vite + Vue 壳，React/Svelte 以 island 挂载 live demo；顶栏切换框架。

**Tech Stack:** 现有 monorepo；docs 同时启用 vue / react / svelte Vite 插件。

**Spec:** `docs/superpowers/specs/2026-08-28-argon-ui-kit-design.md` §5.3 Phase 2 + 开源文档站需求。

---

### 范围

表单：Input / Password / Textarea / InputNumber / InputGroup(prefix/suffix) / Select / Checkbox / Radio / Switch / Upload / Field 校验态 / Message。

- 文档站：安装页、Button、上述表单页；侧栏 + 顶栏框架切换 + Demo 块（预览 + 三框架代码）+ API 表；`pnpm docs:build` 产出静态站，GitHub Pages 可托管。

PageSelect / DatePicker 仍属后续 Phase，本页只链到「即将推出」。
