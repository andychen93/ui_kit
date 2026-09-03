<script lang="ts">
  import { glyphs, type GlyphName } from "@argon-kit/icons";
  import type { ShellMenuItem } from "@argon-kit/core";
  import Glyph from "../glyph/Glyph.svelte";
  import Menu from "./Menu.svelte";

  let {
    items,
    selectedKey,
    openKeys,
    onselect,
    onopenchange,
  }: {
    items: ShellMenuItem[];
    selectedKey?: string;
    openKeys: string[];
    onselect?: (key: string) => void;
    onopenchange?: (keys: string[]) => void;
  } = $props();

  function isGlyph(name?: string): name is GlyphName {
    return !!name && name in glyphs;
  }

  function toggle(key: string) {
    onopenchange?.(openKeys.includes(key) ? openKeys.filter((k) => k !== key) : [...openKeys, key]);
  }
</script>

<ul class="ag-menu">
  {#each items as item (item.key)}
    <li>
      <button
        type="button"
        disabled={item.disabled}
        class={["ag-menu__item", selectedKey === item.key ? "is-active" : ""].filter(Boolean).join(" ")}
        onclick={() => (item.children?.length ? toggle(item.key) : onselect?.(item.key))}
      >
        <span class="ag-menu__icon">
          {#if isGlyph(item.icon)}
            <Glyph name={item.icon} />
          {:else}
            <span class="ag-menu__dot"></span>
          {/if}
        </span>
        <span class="ag-menu__label">{item.label}</span>
        {#if item.children?.length}
          <Glyph
            name="chevronRight"
            class={"ag-icon ag-menu__arrow" + (openKeys.includes(item.key) ? " is-open" : "")}
          />
        {/if}
      </button>
      {#if item.children?.length && openKeys.includes(item.key)}
        <Menu
          items={item.children}
          {selectedKey}
          {openKeys}
          {onselect}
          {onopenchange}
        />
      {/if}
    </li>
  {/each}
</ul>
