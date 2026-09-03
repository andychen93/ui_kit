# Argon UI Kit

Argon 视觉语言的后台组件库，同时提供 **Vue 3 / React / Svelte 5**。样式集中在 `@argon-kit/styles`（`ag-*` class + CSS 变量），三个框架只负责行为。

- 正文 **16px**
- 通用图标 [Lucide](https://lucide.dev)（MIT）；品牌图标来自 Simple Icons（CC0），GitHub / Google / 微信 / Facebook / Twitter 等 **15 个品牌**
- **不**依赖 antd / Bootstrap / Creative Tim SCSS
- 所有插件依赖均为宽松开源许可（MIT / BSD-3），详见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)
- 文档站形态对齐 Element Plus / Ant Design 官网，可 GitHub Pages 托管

## 本地文档

```bash
pnpm install
pnpm test
pnpm dev:docs    # http://localhost:5170
```

顶栏可切换 Vue / React / Svelte，组件页含 Live Demo、三框架代码、API 表。

## 组件清单（三框架同步）

| 分类 | 组件 |
|------|------|
| 通用 | Button（6 实心 + 6 渐变 + 15 社交品牌）、Alert、Badge、Tag、Avatar / AvatarGroup、Card |
| 表单 | Input / Password / Textarea / InputNumber、Select、Checkbox、Radio / RadioGroup、Switch、Upload、DatePicker / RangePicker、Slider、**Form / FormItem（轻量校验引擎）** |
| 数据 | Table（固定列/排序/省略/横向滚动）、Pagination、PageSelect、ProTable、QueryForm、**CrudFormModal**、RowActions、StatusSwitch、TreeSelect、Tree、Transfer、Progress、Timeline、Descriptions、List、Steps |
| 导航与布局 | AppShell、Menu、Breadcrumb、Tabs、Login、StatCard、Result、Collapse |
| 反馈 | Message、Notification、SweetAlert、Spin、Tooltip、Popover、Dropdown、Modal、Drawer、Popconfirm、Empty |

## 插件组件（独立子包，按需引入）

| 包 | 底座 | 组件 |
|----|------|------|
| `@argon-kit/charts` | Chart.js 4 | ArgonChart（line/bar/pie/doughnut，Argon 主题：圆角柱、虚线网格、83% 环形） |
| `@argon-kit/calendar` | FullCalendar 6 | ArgonCalendar（事件语义色、回调透传） |
| `@argon-kit/editor` | Quill 2 | RichText（v-model HTML、精简工具栏、只读） |
| `@argon-kit/plugins` | noUiSlider / dropzone | RangeSlider、TagsInput、SelectMultiple、Carousel、Dropzone、VectorMap（自研 SVG，规避 jvectormap 的 AGPL） |

## 开源部署（GitHub Pages）

1. 把仓库推到 GitHub，Settings → Pages → 源选 `gh-pages` 分支
2. 若是项目站（`https://user.github.io/repo/`），在 workflow 里加 `VITE_BASE: /repo/`
3. 推送 `main`/`master` 后 `.github/workflows/docs.yml` 会自动构建 `apps/docs/dist`

把 `apps/docs/src/layout/DocLayout.vue` 里的 GitHub 链接改成你的仓库地址。

## 包

```bash
pnpm add @argon-kit/vue @argon-kit/styles     # 或 react / svelte
```

```ts
import "@argon-kit/styles";
import { Button, Input, message, notification } from "@argon-kit/vue";
```

## 分期

| 期 | 内容 |
|----|------|
| 1 | Token + Button |
| 2 | 表单组件 + 文档站 |
| 3 | 浮层 / DatePicker |
| 4 | Table / **PageSelect** / ProTable |
| 5 | AppShell / Login |
| 6 | 16 个新组件（Alert/Badge/Tag/Avatar/Card/Progress/Timeline/Collapse/Steps/Slider/Spin/Notification/SweetAlert/Descriptions/List/Empty）+ 15 品牌社交按钮 |
| 7（当前） | 插件组件层（照抄 Argon Pro 模式）：`@argon-kit/charts`（Chart.js 4）、`@argon-kit/calendar`（FullCalendar 6）、`@argon-kit/editor`（Quill 2）、`@argon-kit/plugins`（noUiSlider 滑杆 / TagsInput / SelectMultiple / Carousel / Dropzone / 自研 SVG 世界地图） |

规格：`docs/superpowers/specs/2026-08-28-argon-ui-kit-design.md`

## 工程命令

```bash
pnpm typecheck   # 9 包类型检查（tsc / vue-tsc / svelte-check）
pnpm test        # 单测 + 三框架契约测试（导出一致性防漂移）
pnpm build       # 全部包产出可发布 dist（esm + d.ts）
pnpm gen:tokens  # 从 tokens.ts 重新生成 tokens.css 调色段（色板唯一权威源）
pnpm dev:docs    # 文档站 http://localhost:5170
```

CI（.github/workflows/ci.yml）：PR 与 push 时跑 install → typecheck → test → build → docs:build。
