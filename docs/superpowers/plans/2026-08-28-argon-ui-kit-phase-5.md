# Argon UI Kit Phase 5

**Goal:** AppShell、Menu、Breadcrumb、Tabs、Login、StatCard、Tree、Transfer、403 Result。

- AppShell 不绑路由/权限；菜单点击只回调 key。
- 侧栏 62 / 250，顶栏 64 白底；embed 模式给文档站预览。
- Login 是页面模板（Tabs + 表单），验证码/租户 options 由业务传入。
- StatCard 无 react-query，value 由调用方传入。
