<script setup lang="ts">
import type { DescriptionItem } from "@argon-kit/core";

withDefaults(
  defineProps<{
    title?: string;
    items: DescriptionItem[];
    column?: number;
    border?: boolean;
  }>(),
  { column: 1, border: false },
);
</script>

<template>
  <div>
    <h4 v-if="title" class="ag-descriptions__title">{{ title }}</h4>
    <div class="ag-descriptions" :class="{ 'ag-descriptions--border': border }">
      <table class="ag-descriptions__table">
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="i"
            class="ag-descriptions__row"
          >
            <td class="ag-descriptions__label" :colspan="item.span && column === 1 ? item.span * 2 : undefined">
              {{ item.label }}
            </td>
            <td class="ag-descriptions__content">{{ item.content }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
