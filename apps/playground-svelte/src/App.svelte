<script lang="ts">
  import { Plus } from "lucide-svelte";
  import { Button } from "@argon-kit/svelte";

  const solids = [
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "default",
  ] as const;
  const gradients = [
    "gradient-primary",
    "gradient-info",
    "gradient-success",
    "gradient-warning",
    "gradient-danger",
    "gradient-default",
  ] as const;
</script>

<div style="max-width: 960px; margin: 0 auto; padding: 32px">
  <p style="color: var(--ag-gray-600); font-size: 13px; margin: 0">Svelte playground</p>
  <h1 style="color: var(--ag-heading); font-size: 20px; margin: 4px 0 32px">Argon Button</h1>

  <section style="margin-bottom: 32px">
    <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">实心</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 12px">
      {#each solids as v}
        <Button variant={v}>{v}</Button>
      {/each}
    </div>
  </section>

  <section style="margin-bottom: 32px">
    <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">渐变</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 12px">
      {#each gradients as v}
        <Button variant={v}>{v.replace("gradient-", "")}</Button>
      {/each}
    </div>
  </section>

  <section style="margin-bottom: 32px">
    <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">中性 / 描边 / 链接 / 禁用 / 加载</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 12px">
      <Button variant="neutral">Neutral</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="link">Link</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  </section>

  <section style="margin-bottom: 32px">
    <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">尺寸与图标</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 12px">
      <Button size="sm">
        {#snippet icon()}<Plus size={16} />{/snippet}
        Small
      </Button>
      <Button>
        {#snippet icon()}<Plus size={16} />{/snippet}
        Default
      </Button>
      <Button size="lg">
        {#snippet icon()}<Plus size={16} />{/snippet}
        Large
      </Button>
      <Button iconOnly aria-label="add">
        {#snippet icon()}<Plus size={16} />{/snippet}
      </Button>
    </div>
  </section>

  <section>
    <h2 style="color: var(--ag-heading); font-size: 20px; margin: 0 0 12px">社交登录</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 12px">
      <Button variant="social-github">GitHub</Button>
      <Button variant="social-google">Google</Button>
      <Button variant="social-wechat">微信</Button>
      <Button variant="social-github" iconOnly aria-label="GitHub" />
    </div>
  </section>
</div>
