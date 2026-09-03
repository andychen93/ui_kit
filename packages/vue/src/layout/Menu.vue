<script setup lang="ts">
import { glyphs, type GlyphName } from "@argon-kit/icons";
import type { ShellMenuItem } from "@argon-kit/core";
import Glyph from "../glyph/Glyph.vue";
import Menu from "./Menu.vue";

defineProps<{
  items: ShellMenuItem[];
  selectedKey?: string;
  openKeys: string[];
}>();

const emit = defineEmits<{
  select: [key: string];
  openChange: [keys: string[]];
}>();

function isGlyph(name?: string): name is GlyphName {
  return !!name && name in glyphs;
}
</script>

<template>
  <ul class="ag-menu">
    <li v-for="item in items" :key="item.key">
      <button
        type="button"
        :disabled="item.disabled"
        :class="['ag-menu__item', selectedKey === item.key ? 'is-active' : '']"
        @click="
          item.children?.length
            ? emit(
                'openChange',
                openKeys.includes(item.key) ? openKeys.filter((k) => k !== item.key) : [...openKeys, item.key],
              )
            : emit('select', item.key)
        "
      >
        <span class="ag-menu__icon">
          <Glyph v-if="isGlyph(item.icon)" :name="item.icon" />
          <span v-else class="ag-menu__dot" />
        </span>
        <span class="ag-menu__label">{{ item.label }}</span>
        <Glyph
          v-if="item.children?.length"
          name="chevronRight"
          :class="'ag-icon ag-menu__arrow' + (openKeys.includes(item.key) ? ' is-open' : '')"
        />
      </button>
      <Menu
        v-if="item.children?.length && openKeys.includes(item.key)"
        :items="item.children"
        :selected-key="selectedKey"
        :open-keys="openKeys"
        @select="emit('select', $event)"
        @open-change="emit('openChange', $event)"
      />
    </li>
  </ul>
</template>
