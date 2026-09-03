# Argon UI Kit Phase 3

**Goal:** 浮层与日期：Tooltip / Popover / Dropdown / Modal / Drawer / Popconfirm / DatePicker / RangePicker，三框架 + 文档站。

**Architecture:** 样式在 `@argon-kit/styles`。日历网格算法在 `@argon-kit/core`。Modal/Drawer 用 portal/teleport 挂到 body。Tooltip/Popover/Dropdown 相对 trigger 定位（与 Select 相同的 click-outside）。
