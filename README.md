# Argon UI Kit

Argon 视觉语言的后台组件库，同时提供 **Vue 3 / React / Svelte 5 / 纯 HTML（零框架依赖）**。样式集中在 `@argon-kit/styles`（`ag-*` class + CSS 变量），四种实现只负责行为。

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

## 组件清单（四种实现同步）

| 分类 | 组件 |
|------|------|
| 通用 | Button（6 实心 + 6 渐变 + 15 社交品牌）、Alert、Badge、Tag、Avatar / AvatarGroup、Card |
| 表单 | Input / Password / Textarea / InputNumber、Select、Checkbox、Radio / RadioGroup、Switch、Upload、DatePicker / RangePicker、Slider、**Form / FormItem（轻量校验引擎）** |
| 数据 | Table（固定列/排序/省略/横向滚动）、Pagination、PageSelect、ProTable、QueryForm、**CrudFormModal**、RowActions、StatusSwitch、TreeSelect、Tree、Transfer、Progress、Timeline、Descriptions、List、Steps |
| 导航与布局 | AppShell、Menu、Breadcrumb、Tabs、Login、StatCard、Result、Collapse |
| 反馈 | Message、Notification、SweetAlert、Spin、Tooltip、Popover、Dropdown、Modal、Drawer、Popconfirm、Empty |

### 四实现共享同一组件覆盖契约

Vue / React / Svelte / HTML 四个包共享**同一份运行时导出契约**：`tests/contract/src/html-exports-parity.test.ts` 会在每次 `pnpm test` 时，动态计算 React/Vue/Svelte 三者运行时导出名称的交集，并断言 `@argon-kit/html` 对每一个交集组件都有同名公开导出（`missing` 必须为 `[]`，覆盖率必须为 `100%`）。这份交集集合还会与 `tests/contract/component-manifest.ts` 中手写清单做一致性校验，防止清单漂移；任一框架新增公共组件而 HTML 未跟进，CI 会立即失败。

HTML 版组件矩阵：`@argon-kit/html` 当前对上表全部组件（以及 `Form`/`FormItem`、`message`/`notification` 等共享运行时工具）导出同名的类 + `createXxx` 工厂函数，行为覆盖率与三框架一致。详见 [`packages/html/README.md`](./packages/html/README.md)。

## 插件组件（独立子包，按需引入）

| 包 | 底座 | 组件 |
|----|------|------|
| `@argon-kit/charts` | Chart.js 4 | ArgonChart（line/bar/pie/doughnut，Argon 主题：圆角柱、虚线网格、83% 环形） |
| `@argon-kit/calendar` | FullCalendar 6 | ArgonCalendar（事件语义色、回调透传） |
| `@argon-kit/editor` | Quill 2 | RichText（v-model HTML、精简工具栏、只读） |
| `@argon-kit/plugins` | noUiSlider / dropzone | RangeSlider、TagsInput、SelectMultiple、Carousel、Dropzone、VectorMap（自研 SVG，规避 jvectormap 的 AGPL） |
| `@argon-kit/html-charts` / `@argon-kit/html-calendar` / `@argon-kit/html-editor` | 同上 | 纯 HTML 版插件组件，供 `@argon-kit/html` 使用（零框架依赖） |

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

### HTML（零框架依赖）

```bash
npm install @argon-kit/html @argon-kit/styles
# 按需：图表 / 富文本 / 日历插件
npm install @argon-kit/html-charts @argon-kit/html-editor @argon-kit/html-calendar
```

```html
<script type="module">
  import "@argon-kit/styles";
  import { Button, message } from "@argon-kit/html";

  const btn = new Button("#my-button", {
    variant: "primary",
    onClick: () => message.success("Clicked!"),
  });
</script>
```

无构建工具场景下同样适用——`@argon-kit/html` 的每个组件都是普通 ES class + 工厂函数，不依赖任何框架运行时。详见 [`packages/html/README.md`](./packages/html/README.md)。

**安全契约**：Table/ProTable 的自定义渲染、Modal/Drawer 的 content/footer、Result 的自定义图标等少数接口允许传入字符串 HTML（写入 `innerHTML`）。字符串 HTML 不会自动净化，只能传入可信内容。外部或用户输入必须由调用方先行净化（例如使用 DOMPurify），或改用 `HTMLElement` + `textContent`。完整清单见 [`packages/html/README.md`](./packages/html/README.md#security-contract-innerhtml-usage)。

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
pnpm typecheck   # 全部包类型检查（tsc / vue-tsc / svelte-check）
pnpm test        # 单测 + 四实现契约测试（导出一致性防漂移，含 HTML 覆盖率断言）
pnpm build       # 全部包产出可发布 dist（esm + d.ts）
pnpm gen:tokens  # 从 tokens.ts 重新生成 tokens.css 调色段（色板唯一权威源）
pnpm dev:docs    # 文档站 http://localhost:5170
pnpm dev:react   # React playground
pnpm dev:vue     # Vue playground
pnpm dev:svelte  # Svelte playground
pnpm dev:html    # HTML playground（http://localhost:5175，全部公共组件的真实交互演示）
```

CI（.github/workflows/ci.yml）：PR 与 push 时跑 install → typecheck → test → build → docs:build。
