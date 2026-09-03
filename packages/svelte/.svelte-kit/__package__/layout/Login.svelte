<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "../button/Button.svelte";
  import Input from "../input/Input.svelte";
  import Password from "../input/Password.svelte";
  import Select from "../select/Select.svelte";
  import Glyph from "../glyph/Glyph.svelte";
  import Tabs from "./Tabs.svelte";

  export interface LoginValues {
    username: string;
    password: string;
    tenantCode?: string;
  }

  let {
    title = "Argon UI Kit",
    subtitle = "欢迎回来",
    logo = "A",
    loading = false,
    showTenant = true,
    tenantOptions = [{ label: "默认租户", value: "" }],
    hint,
    captcha,
    embed = false,
    onsubmit,
  }: {
    title?: string;
    subtitle?: string;
    logo?: string;
    loading?: boolean;
    showTenant?: boolean;
    tenantOptions?: { label: string; value: string | number }[];
    hint?: string;
    captcha?: Snippet;
    embed?: boolean;
    onsubmit?: (values: LoginValues) => void;
  } = $props();

  let tab = $state<"default" | "tenant">("default");
  let username = $state("");
  let password = $state("");
  let tenantCode = $state<string | number | null>("");

  function submit(e: Event) {
    e.preventDefault();
    onsubmit?.({
      username,
      password,
      tenantCode: tab === "tenant" ? String(tenantCode ?? "") : undefined,
    });
  }
</script>

{#snippet prefixUser()}
  <Glyph name="user" />
{/snippet}
{#snippet prefixLock()}
  <Glyph name="lock" />
{/snippet}

{#snippet form()}
  <form onsubmit={submit}>
    {#if tab === "tenant"}
      <Select options={tenantOptions} bind:value={tenantCode} placeholder="选择租户" />
    {/if}
    <Input bind:value={username} placeholder="用户名" prefix={prefixUser} />
    <Password bind:value={password} placeholder="密码" prefix={prefixLock} />
    {#if captcha}{@render captcha()}{/if}
    <Button type="submit" block {loading} style="margin-top: 8px">登录</Button>
  </form>
{/snippet}

<div class={["ag-login", embed ? "ag-login--embed" : ""].filter(Boolean).join(" ")}>
  <div class="ag-login__card">
    <div class="ag-login__brand">
      <div class="ag-login__mark">{logo}</div>
      <h1 class="ag-login__title">{title}</h1>
      <p class="ag-login__sub">{subtitle}</p>
    </div>
    {#if showTenant}
      <Tabs
        center
        items={[
          { key: "default", label: "默认登录" },
          { key: "tenant", label: "租户登录" },
        ]}
        active={tab}
        onchange={(k) => (tab = k as "default" | "tenant")}
      >
        {@render form()}
      </Tabs>
    {:else}
      {@render form()}
    {/if}
    {#if hint}<p class="ag-login__hint">{hint}</p>{/if}
  </div>
</div>
