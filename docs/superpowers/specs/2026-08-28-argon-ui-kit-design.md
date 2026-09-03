# Argon UI Kit 设计规格

> 日期：2026-08-28  
> 状态：已确认（P0 清单 + 共享 Token + Vue/React/Svelte 自研）  
> 参考：precision / rbac 真实用量；Argon Dashboard Pro（React/Svelte）；`http://localhost:5000/dashboard/forms`

## 1. 目标

做一套 **Argon 视觉语言** 的后台 UI Kit，同时提供 **Vue 3 / React / Svelte** 三套组件，供 precision、rbac 及后续后台项目复用。

成功标准：

- 三个框架同一套 CSS 变量与 `ag-*` 类名，视觉对齐
- 能覆盖 precision / rbac 的 CRUD 后台（布局壳 + 表单 + 表格 + Pro 层）
- 正文 **16px**，不再沿用 Argon 原版 13–14px
- 通用图标用 **Lucide**（MIT）；GitHub / Google / 微信三枚品牌 SVG 内嵌在 `@argon-kit/icons`
- **不**依赖 antd、Bootstrap、Creative Tim 商业 SCSS

## 2. 非目标（P0 不做）

- 营销落地页（Features / Team / Pricing / Blog sections）
- 地图、日历、富文本、ECharts
- 暗色主题
- 12 平台全量社交按钮（只做 GitHub / Google / 微信）
- P1：SweetAlert、Timeline、Collapse、Steps、Progress、Slider、Dropzone、TagsInput

## 3. 架构

```
ui_kit/
  packages/styles          # CSS 变量 + 全部 ag-* 组件样式（视觉唯一真相）
  packages/icons           # 品牌 SVG（GitHub/Google/微信）+ Lucide 名字表
  packages/react           # React 组件：只拼 class + 行为
  packages/vue             # Vue 3 组件，API 与 React 对齐
  packages/svelte          # Svelte 5 组件，API 与 React 对齐
  apps/playground-react    # 组件展示（对标 /dev/style）
  apps/playground-vue
  apps/playground-svelte
```

原则：

- **样式在 `packages/styles`，逻辑在框架包。** 改一处 CSS，三框架一起变。
- 组件用 `ag-` 前缀 class，不用 CSS-in-JS。
- 浮层定位用 `@floating-ui`（Popover / Dropdown / Tooltip / Select）。
- 表格逻辑用 `@tanstack/table`（React / Vue / Svelte 都有适配），皮肤用 `ag-table`。
- PageSelect / ProTable 的远程分页协议与 precision 对齐（见 §6）。
- 包名 scope：`@argon-kit/styles`、`@argon-kit/react`、`@argon-kit/vue`、`@argon-kit/svelte`、`@argon-kit/icons`。
- 包管理：pnpm workspace；构建：Vite；语言：TypeScript。

三框架公共 props 命名（同一概念同一名字）：`variant`、`size`、`disabled`、`loading`、`value` / `onChange`（Vue 为 `modelValue` + `update:modelValue`，Svelte 为 `bind:value`）。

## 4. Design Token

来源：以 rbac `argonColors.ts` 为唯一色板（比 precision 完整）。字号按「16px 正文」整体上调。

### 4.1 颜色

| Token | 值 | 用途 |
|-------|-----|------|
| `--ag-primary` | `#5e72e4` | 主色 |
| `--ag-info` | `#11cdef` | |
| `--ag-success` | `#2dce89` | |
| `--ag-warning` | `#fb6340` | |
| `--ag-danger` | `#f5365c` | |
| `--ag-default` | `#172b4d` | |
| `--ag-white` | `#fff` | |
| `--ag-body-bg` | `#f8f9fe` | 页面背景 |
| `--ag-gray-100` | `#f6f9fc` | |
| `--ag-gray-200` | `#e9ecef` | 边框 |
| `--ag-gray-300` | `#dee2e6` | |
| `--ag-gray-400` | `#ced4da` | |
| `--ag-gray-500` | `#adb5bd` | |
| `--ag-gray-600` | `#8898aa` | 次要文字 |
| `--ag-gray-700` | `#525f7f` | 正文 `--ag-text` |
| `--ag-gray-800` | `#32325d` | 标题 `--ag-heading` |
| `--ag-gray-900` | `#212529` | |

渐变用 **字面量**（与 rbac `argonGradients` 相同），不要用 hue-shift 现场计算：

| Token | 值 |
|-------|-----|
| `--ag-gradient-primary` | `linear-gradient(87deg, #5e72e4 0%, #7b5ce4 100%)` |
| `--ag-gradient-info` | `linear-gradient(87deg, #11cdef 0%, #118def 100%)` |
| `--ag-gradient-success` | `linear-gradient(87deg, #2dce89 0%, #2dc7ce 100%)` |
| `--ag-gradient-warning` | `linear-gradient(87deg, #fb6340 0%, #fb9840 100%)` |
| `--ag-gradient-danger` | `linear-gradient(87deg, #f5365c 0%, #f56336 100%)` |
| `--ag-gradient-default` | `linear-gradient(87deg, #172b4d 0%, #24174d 100%)` |

### 4.2 字号（相对现网上调）

| 角色 | 值 |
|------|-----|
| 正文 / 表格 / 表单 | **16px** |
| 按钮 | 16px / 字重 600 |
| 页标题 | 20px / 700 |
| 辅助标签（原 11px uppercase） | 13px |
| 页脚 | 14px |
| StatCard 数值 | 28px / 700 |
| Modal 标题 | 24px / 600 |

字体：`'Open Sans', 'PingFang SC', system-ui, sans-serif`

### 4.3 其它

- 圆角：组件 4px，卡片 6px
- 控件高度：按钮 default 40 / sm 32 / lg 48；Input 40px
- 阴影：`0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08)`
- 卡片阴影：`0 0 2rem 0 rgba(136,152,170,.15)`
- 侧栏：收起 62px / 展开 250px；顶栏 64px 白底

## 5. P0 组件清单

### 5.1 基础

- Typography、Divider、Grid（Row / Col）

### 5.2 按钮 Button

- 实心：primary / info / success / warning / danger / default
- 描边 outline、Neutral、Link
- 渐变 `ag-btn--gradient-*`
- sm / md / lg、icon、loading、disabled、block
- 社交：GitHub / Google / 微信（图标 + 文字，及 icon-only）

### 5.3 表单

- Input、Password、Textarea、InputNumber
- Select（普通下拉，options 列表）
- **PageSelect（分页表格下拉，见 §6，P0 必做）**
- TreeSelect（部门 / 父级选择，precision 表单在用）
- Checkbox、Radio、Switch
- DatePicker / RangePicker
- InputGroup（前缀 / 后缀图标）
- Upload
- 校验态：error / success + 提示文案

### 5.4 数据展示

- Table（分页、行操作槽、斑马纹、树形展开）
- Card、StatCard（渐变 KPI）
- Tag、Badge、Avatar、Descriptions、Empty、Tree、Transfer

### 5.5 反馈

- Modal、Drawer
- Message / Toast（全局 API，不用 notification 堆叠角标）
- Popconfirm、Alert、Spin、Result、Tooltip、Popover、Dropdown

### 5.6 导航与布局

- AppShell：Sidebar + Header + Content + Footer
- Sidebar Menu、Breadcrumb、Tabs、Pagination
- Header：折叠、面包屑槽、用户下拉、通知铃

### 5.7 Pro 层（precision / rbac 生产力）

- **ProTable** = QueryForm + 工具栏 + Table + Pagination
- **QueryForm**：Input / Select / DateRange
- **RowActions**：查看 / 编辑 / 删除（删除带 Popconfirm）
- **StatusSwitch**：切换前确认
- **PageSelect**：见 §6

### 5.8 页面模板

- Login（Tabs + 表单）
- 403 Result
- Playground Showcase（对标 `/dev/style`）

## 6. PageSelect（重点，不可做成普通 Select）

对标 precision `frontend/src/components/pro/PageSelect.tsx`，交互取 rbac 改进版。

形态：输入框看起来像 Select；点开是 **带分页的 Table**。用于车辆 / 用户等大数据量选择，禁止把全量 options 塞进普通 Select。

交互约定：

1. 输入框本身就是搜索框，弹层里不再放第二个搜索框
2. 边打字边搜，防抖 300ms；直接打字会打开弹层
3. 只有点击表格某一行才产生值
4. 关掉弹层且未点行：输入框回滚成已选项文本，不把半截关键字当值
5. 受控值是 **整条 record**，`labelField` 决定回填显示
6. `allowClear` 时清空回调 `null`
7. 关键字变化时回到第 1 页

API（React；Vue/Svelte 语义相同）：

```ts
interface PageSelectProps<T> {
  /** 业务侧自行剥掉 { code, data } 信封，这里直接吃 PageResult */
  service: (params: PageQuery) => Promise<PageResult<T>>;
  columns: ColumnDef<T>[];
  rowKey: keyof T | string;
  labelField: keyof T;
  value?: T | null;
  onChange: (record: T | null) => void;
  placeholder?: string;
  searchField?: keyof T;
  pageSize?: number;       // 默认 5
  popoverWidth?: number;   // 默认 480
  allowClear?: boolean;
}
```

分页协议（与 precision 对齐）：

```ts
interface PageQuery {
  pageNum: number;
  pageSize: number;
  [searchField]?: string;
}

interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
```

## 7. 图标

- 通用图标用 **Lucide**（MIT）：plus、pencil、trash-2、search、refresh-cw、user、settings、bell、chevron-down、loader-circle
- **品牌图标例外**：Lucide 不含 GitHub / Google / 微信。这三枚 SVG 内嵌在 `packages/icons`（Simple Icons，CC0），三框架共用，不再另引品牌字体
- 组件 `icon` prop 收 Lucide 组件或上述品牌 SVG 节点

## 8. 实施分期

P0 太大，拆成可独立交付的计划，每期结束 playground 可演示：

| 期 | 内容 | 可演示 |
|----|------|--------|
| **1** | monorepo + styles token + icons（含三枚品牌 SVG）+ Button（三框架）+ playground | 按钮页 |
| **2** | Input / Password / Textarea / InputNumber / InputGroup / Select / Checkbox / Radio / Switch / Upload + Message | 表单页 |
| **3** | Popover / Dropdown / Tooltip / Modal / Drawer / Popconfirm / DatePicker / RangePicker | 反馈页 |
| **4** | Table + Pagination + PageSelect + TreeSelect + QueryForm + ProTable + RowActions + StatusSwitch | CRUD 页 |
| **5** | AppShell + Menu + Breadcrumb + Tabs + Login + StatCard + Tree / Transfer / 其余展示组件 | 完整后台壳 |

本期执行 **Phase 1**。后续每期单独写 plan。

## 9. 测试与验收

- 组件行为：Vitest + Testing Library（打开/关闭、受控值、键盘）
- 视觉：三个 playground 同一 Showcase 结构，人工对照 Argon 色板
- PageSelect：mock `service`，断言分页、搜索防抖、选中 record、关闭回滚、allowClear

## 10. 明确不做的实现选择

- 不包 antd / ant-design-vue / Element Plus
- 不拷贝 Creative Tim SCSS
- 不引入 Nucleo 字体文件
- 地图 / 图表不进本仓库
