<script setup lang="ts">
import { useSlots } from "vue";
import Spin from "../spin/Spin.vue";

export interface ListItemType {
  key?: string;
  title?: string;
  description?: string;
  [k: string]: unknown;
}

withDefaults(
  defineProps<{
    items?: ListItemType[];
    loading?: boolean;
    bordered?: boolean;
  }>(),
  { items: () => [], loading: false, bordered: false },
);

const slots = useSlots();
</script>

<template>
  <div class="ag-list" :class="{ 'ag-list--bordered': bordered, 'ag-list--loading': loading }">
    <div v-if="slots.header || $slots.header" class="ag-list__header">
      <slot name="header" />
    </div>
    <div v-if="loading" class="ag-list__spin">
      <Spin />
    </div>
    <ul v-if="!loading && (items.length || slots.item || $slots.item)" class="ag-list__items">
      <li
        v-for="(item, i) in items"
        :key="item.key ?? i"
        class="ag-list__item"
      >
        <slot name="item" :item="item" :index="i">
          <span>{{ item.title }}</span>
          <span v-if="item.description" style="margin-left: auto; color: var(--ag-gray-500); font-size: 13px;">
            {{ item.description }}
          </span>
        </slot>
      </li>
    </ul>
    <div v-if="slots.footer || $slots.footer" class="ag-list__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
