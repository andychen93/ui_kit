<script setup lang="ts">
import { ref } from "vue";
import type { BreadcrumbItem, ShellMenuItem } from "@argon-kit/core";
import Glyph from "../glyph/Glyph.vue";
import Breadcrumb from "./Breadcrumb.vue";
import Menu from "./Menu.vue";

const props = withDefaults(
  defineProps<{
    brand?: string;
    logo?: string;
    items?: ShellMenuItem[];
    selectedKey?: string;
    pinned?: boolean;
    breadcrumb?: BreadcrumbItem[];
    footer?: string;
    embed?: boolean;
  }>(),
  { brand: "Argon", logo: "A", items: () => [], pinned: true, breadcrumb: () => [], embed: false },
);

const emit = defineEmits<{
  select: [key: string];
  pinnedChange: [pinned: boolean];
}>();

const hover = ref(false);
const openKeys = ref<string[]>([]);
</script>

<template>
  <div :class="['ag-app', pinned ? 'is-pinned' : '', embed ? 'ag-app--embed' : '']">
    <aside
      :class="['ag-sidenav', hover && !pinned ? 'is-hover' : '']"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <div class="ag-sidenav__brand">
        <span class="ag-sidenav__logo">{{ logo }}</span>
        <span class="ag-sidenav__brand-text">{{ brand }}</span>
      </div>
      <nav aria-label="侧栏导航">
        <Menu
          :items="items"
          :selected-key="selectedKey"
          :open-keys="pinned || hover ? openKeys : []"
          @select="emit('select', $event)"
          @open-change="openKeys = $event"
        />
      </nav>
    </aside>
    <div class="ag-app__main">
      <header class="ag-header">
        <div class="ag-header__left">
          <button
            type="button"
            class="ag-header__toggle"
            :aria-label="pinned ? '收起侧栏' : '展开侧栏'"
            @click="emit('pinnedChange', !pinned)"
          >
            <Glyph name="menu" />
          </button>
          <Breadcrumb v-if="breadcrumb.length" :items="breadcrumb" />
        </div>
        <div class="ag-header__right"><slot name="extra" /></div>
      </header>
      <div class="ag-page"><slot /></div>
      <footer v-if="footer || $slots.footer" class="ag-footer">
        <slot name="footer">{{ footer }}</slot>
      </footer>
    </div>
  </div>
</template>
