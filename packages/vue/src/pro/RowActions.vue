<script setup lang="ts">
import Popconfirm from "../overlay/Popconfirm.vue";

export interface RowActionItem {
  key: string;
  label: string;
  danger?: boolean;
  confirmTitle?: string;
  onClick: () => void;
}

defineProps<{ items: RowActionItem[] }>();
</script>

<template>
  <div class="ag-row-actions">
    <template v-for="item in items" :key="item.key">
      <Popconfirm v-if="item.confirmTitle" :title="item.confirmTitle" @confirm="item.onClick">
        <button type="button" :class="{ 'is-danger': item.danger }">{{ item.label }}</button>
      </Popconfirm>
      <button v-else type="button" :class="{ 'is-danger': item.danger }" @click="item.onClick">
        {{ item.label }}
      </button>
    </template>
  </div>
</template>
