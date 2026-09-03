<script lang="ts">
  import type { Snippet } from "svelte";
  import type { BreadcrumbItem, ShellMenuItem } from "@argon-kit/core";
  import Glyph from "../glyph/Glyph.svelte";
  import Breadcrumb from "./Breadcrumb.svelte";
  import Menu from "./Menu.svelte";

  let {
    brand = "Argon",
    logo = "A",
    items = [],
    selectedKey,
    onselect,
    pinned = true,
    onpinnedchange,
    breadcrumb = [],
    extra,
    footer,
    children,
    embed = false,
  }: {
    brand?: string;
    logo?: string;
    items?: ShellMenuItem[];
    selectedKey?: string;
    onselect?: (key: string) => void;
    pinned?: boolean;
    onpinnedchange?: (pinned: boolean) => void;
    breadcrumb?: BreadcrumbItem[];
    extra?: Snippet;
    footer?: Snippet | string;
    children?: Snippet;
    embed?: boolean;
  } = $props();

  let hover = $state(false);
  let openKeys = $state<string[]>([]);
</script>

<div class={["ag-app", pinned ? "is-pinned" : "", embed ? "ag-app--embed" : ""].filter(Boolean).join(" ")}>
  <aside
    class={["ag-sidenav", hover && !pinned ? "is-hover" : ""].filter(Boolean).join(" ")}
    onmouseenter={() => (hover = true)}
    onmouseleave={() => (hover = false)}
  >
    <div class="ag-sidenav__brand">
      <span class="ag-sidenav__logo">{logo}</span>
      <span class="ag-sidenav__brand-text">{brand}</span>
    </div>
    <nav aria-label="侧栏导航">
      <Menu
        {items}
        {selectedKey}
        openKeys={pinned || hover ? openKeys : []}
        {onselect}
        onopenchange={(keys) => (openKeys = keys)}
      />
    </nav>
  </aside>
  <div class="ag-app__main">
    <header class="ag-header">
      <div class="ag-header__left">
        <button
          type="button"
          class="ag-header__toggle"
          aria-label={pinned ? "收起侧栏" : "展开侧栏"}
          onclick={() => onpinnedchange?.(!pinned)}
        >
          <Glyph name="menu" />
        </button>
        {#if breadcrumb.length}
          <Breadcrumb items={breadcrumb} />
        {/if}
      </div>
      <div class="ag-header__right">{#if extra}{@render extra()}{/if}</div>
    </header>
    <div class="ag-page">{#if children}{@render children()}{/if}</div>
    {#if footer}
      <footer class="ag-footer">
        {#if typeof footer === "string"}{footer}{:else}{@render footer()}{/if}
      </footer>
    {/if}
  </div>
</div>
