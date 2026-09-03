# Argon UI Kit Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭好 pnpm monorepo，落地共享 Token / Lucide 图标，并在 Vue、React、Svelte 三个包里交出同一套 Argon Button（含渐变与社交按钮），playground 可对照展示。

**Architecture:** 视觉真相在 `@argon-kit/styles`（CSS 变量 + `ag-btn-*`）。三个框架包只渲染语义 HTML 并挂 class。不引入 antd / Bootstrap。

**Tech Stack:** pnpm workspaces、Vite 6、TypeScript 5、React 18、Vue 3、Svelte 5、Lucide、Vitest、Vite playground。

**Spec:** `docs/superpowers/specs/2026-08-28-argon-ui-kit-design.md`

---

## File Structure

```
package.json
pnpm-workspace.yaml
tsconfig.base.json
packages/styles/package.json
packages/styles/src/tokens.css
packages/styles/src/button.css
packages/styles/src/index.css
packages/icons/package.json
packages/icons/src/index.ts
packages/react/package.json
packages/react/src/index.ts
packages/react/src/button/Button.tsx
packages/react/src/button/Button.test.tsx
packages/vue/package.json
packages/vue/src/index.ts
packages/vue/src/button/Button.vue
packages/vue/src/button/Button.test.ts
packages/svelte/package.json
packages/svelte/src/index.ts
packages/svelte/src/button/Button.svelte
packages/svelte/src/button/Button.test.ts
apps/playground-react/...
apps/playground-vue/...
apps/playground-svelte/...
```

---

### Task 1: 初始化 pnpm workspace

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`

- [ ] **Step 1: 写根配置**

`package.json`:

```json
{
  "name": "argon-ui-kit",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev:react": "pnpm --filter @argon-kit/playground-react dev",
    "dev:vue": "pnpm --filter @argon-kit/playground-vue dev",
    "dev:svelte": "pnpm --filter @argon-kit/playground-svelte dev",
    "test": "pnpm -r --if-present test"
  }
}
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

`.gitignore`: `node_modules`, `dist`, `.vite`, `*.log`

`tsconfig.base.json`: `strict: true`, `moduleResolution: bundler`, `jsx: react-jsx`

- [ ] **Step 2: git init（不强制 push）**

```bash
git init
```

- [ ] **Step 3: 确认 workspace 文件存在**

---

### Task 2: `@argon-kit/styles` Token + Button CSS

**Files:**
- Create: `packages/styles/package.json`
- Create: `packages/styles/src/tokens.css`
- Create: `packages/styles/src/button.css`
- Create: `packages/styles/src/index.css`

- [ ] **Step 1: 写入 tokens.css**

必须包含 spec §4 全部变量。`--ag-font-size: 16px`。`--ag-primary: #5e72e4`。渐变变量 `--ag-gradient-primary` 等。

- [ ] **Step 2: 写入 button.css**

class：

- `.ag-btn` 基础（height 40、radius 4、font-weight 600、16px、阴影）
- `.ag-btn--primary|info|success|warning|danger|default|neutral|outline|link`
- `.ag-btn--gradient-primary|info|success|warning|danger|default`
- `.ag-btn--sm` (32) `.ag-btn--lg` (48)
- `.ag-btn--block` `.ag-btn--icon-only` `.ag-btn--loading` `.ag-btn:disabled`
- `.ag-btn--social-github|google|wechat`

hover：`translateY(-1px)`（对标 precision）

- [ ] **Step 3: index.css 依次 import tokens.css、button.css**

---

### Task 3: `@argon-kit/icons`

**Files:**
- Create: `packages/icons/package.json`
- Create: `packages/icons/src/index.ts`

- [ ] **Step 1: 依赖 lucide（仅类型与名字表）**

导出常用名常量，供文档与 playground 用：`plus`, `pencil`, `trash-2`, `search`, `loader-circle`, `github`, `mail` 等。

三框架组件直接依赖 `lucide-react` / `lucide-vue-next` / `lucide-svelte`，本包只统一名字清单，避免各包各写一套。

---

### Task 4: React Button + 测试

**Files:**
- Create: `packages/react/package.json`
- Create: `packages/react/src/button/Button.tsx`
- Create: `packages/react/src/button/Button.test.tsx`
- Create: `packages/react/src/index.ts`
- Create: `packages/react/vitest.config.ts`

API:

```ts
export type ButtonVariant =
  | 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'default'
  | 'neutral' | 'outline' | 'link'
  | 'gradient-primary' | 'gradient-info' | 'gradient-success'
  | 'gradient-warning' | 'gradient-danger' | 'gradient-default'
  | 'social-github' | 'social-google' | 'social-wechat';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  block?: boolean;
  iconOnly?: boolean;
}
```

class 拼接：`ag-btn ag-btn--${variant} ag-btn--${size}`

- [ ] **Step 1: 写失败测试** — 渲染 Primary，断言 class `ag-btn ag-btn--primary`；`loading` 时 `disabled` 且带 `ag-btn--loading`
- [ ] **Step 2: 跑测试确认失败**
- [ ] **Step 3: 实现 Button.tsx**
- [ ] **Step 4: 测试通过**
- [ ] **Step 5: 从 `src/index.ts` 导出

---

### Task 5: Vue Button + 测试

**Files:**
- Create: `packages/vue/package.json`
- Create: `packages/vue/src/button/Button.vue`
- Create: `packages/vue/src/button/Button.test.ts`
- Create: `packages/vue/src/index.ts`

Props 与 React 同名：`variant` `size` `loading` `block` `iconOnly`。原生 button 属性透传。

- [ ] **Step 1–4:** 同 Task 4，用 `@vue/test-utils`

---

### Task 6: Svelte Button + 测试

**Files:**
- Create: `packages/svelte/package.json`
- Create: `packages/svelte/src/button/Button.svelte`
- Create: `packages/svelte/src/button/Button.test.ts`
- Create: `packages/svelte/src/index.ts`

- [ ] **Step 1–4:** 同 Task 4，用 `@testing-library/svelte`

---

### Task 7: 三个 Playground 按钮页

**Files:**
- Create: `apps/playground-react/`（Vite + React）
- Create: `apps/playground-vue/`
- Create: `apps/playground-svelte/`

每个 playground 一页，结构相同：

1. 实心 6 色
2. 渐变 6 色
3. Neutral / Outline / Link / Disabled / Loading
4. sm / md / lg + 图标按钮
5. 社交 GitHub / Google / 微信

引入 `@argon-kit/styles/src/index.css`。

- [ ] **Step 1: 三个 Vite app 能 `pnpm dev:react` / `dev:vue` / `dev:svelte` 启动**
- [ ] **Step 2: 按钮页展示上述全部 variant**

---

### Task 8: 根 README

**Files:**
- Create: `README.md`

写明：三框架、16px、Lucide、如何跑 playground、P0 分期。

---

## 验收

- `pnpm test` 三框架 Button 测试通过
- 三个 playground 打开后按钮色板与 `#5e72e4` 等 token 一致
- 正文/按钮字号为 16px

Phase 2（表单）不在本 plan。
