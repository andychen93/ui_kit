<script setup lang="ts">
import { reactive } from "vue";
import type { QueryField } from "@argon-kit/core";
import Button from "../button/Button.vue";
import RangePicker from "../datepicker/RangePicker.vue";
import Input from "../input/Input.vue";
import Select from "../select/Select.vue";

const props = defineProps<{ fields: QueryField[] }>();
const emit = defineEmits<{ search: [values: Record<string, unknown>] }>();

const values = reactive<Record<string, unknown>>({});

function compact() {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== undefined && v !== "" && v !== null),
  );
}

function reset() {
  for (const k of Object.keys(values)) delete values[k];
  emit("search", {});
}
</script>

<template>
  <div class="ag-card ag-query-form">
    <div class="ag-query-form__grid">
      <div v-for="f in props.fields" :key="f.name" class="ag-field">
        <span class="ag-field__label">{{ f.label }}</span>
        <Select
          v-if="f.type === 'select'"
          :options="f.options ?? []"
          :model-value="(values[f.name] as string | number | null) ?? null"
          allow-clear
          :placeholder="f.placeholder ?? '全部'"
          @update:model-value="values[f.name] = $event"
        />
        <RangePicker
          v-else-if="f.type === 'dateRange'"
          :model-value="(values[f.name] as [string, string] | null) ?? null"
          :placeholder="f.placeholder"
          @update:model-value="values[f.name] = $event"
        />
        <Input
          v-else
          :model-value="String(values[f.name] ?? '')"
          :placeholder="f.placeholder ?? '请输入'"
          @update:model-value="values[f.name] = $event"
        />
      </div>
      <div class="ag-query-form__actions">
        <Button @click="emit('search', compact())">查询</Button>
        <Button variant="neutral" @click="reset">重置</Button>
      </div>
    </div>
  </div>
</template>
