<script setup lang="ts">
import { computed, ref } from "vue";
import type { TransferItem } from "@argon-kit/core";
import Button from "../button/Button.vue";
import Checkbox from "../checkbox/Checkbox.vue";

const props = withDefaults(
  defineProps<{
    data: TransferItem[];
    titles?: [string, string];
  }>(),
  { titles: () => ["待选", "已选"] },
);

const value = defineModel<string[]>({ default: () => [] });
const leftChecked = ref<string[]>([]);
const rightChecked = ref<string[]>([]);
const selected = computed(() => new Set(value.value));
const left = computed(() => props.data.filter((d) => !selected.value.has(d.key)));
const right = computed(() => props.data.filter((d) => selected.value.has(d.key)));

function toggle(list: string[], key: string, on: boolean) {
  return on ? [...list, key] : list.filter((k) => k !== key);
}

function moveRight() {
  value.value = [...value.value, ...leftChecked.value];
  leftChecked.value = [];
}

function moveLeft() {
  const drop = new Set(rightChecked.value);
  value.value = value.value.filter((k) => !drop.has(k));
  rightChecked.value = [];
}
</script>

<template>
  <div class="ag-transfer">
    <div class="ag-transfer__panel">
      <div class="ag-transfer__head">{{ titles[0] }}（{{ left.length }}）</div>
      <ul class="ag-transfer__list">
        <li v-for="it in left" :key="it.key">
          <Checkbox
            :model-value="leftChecked.includes(it.key)"
            :disabled="it.disabled"
            @update:model-value="leftChecked = toggle(leftChecked, it.key, $event)"
          >
            {{ it.label }}
          </Checkbox>
        </li>
      </ul>
    </div>
    <div class="ag-transfer__ops">
      <Button size="sm" :disabled="!leftChecked.length" aria-label="移到右侧" @click="moveRight">›</Button>
      <Button size="sm" variant="neutral" :disabled="!rightChecked.length" aria-label="移到左侧" @click="moveLeft">
        ‹
      </Button>
    </div>
    <div class="ag-transfer__panel">
      <div class="ag-transfer__head">{{ titles[1] }}（{{ right.length }}）</div>
      <ul class="ag-transfer__list">
        <li v-for="it in right" :key="it.key">
          <Checkbox
            :model-value="rightChecked.includes(it.key)"
            :disabled="it.disabled"
            @update:model-value="rightChecked = toggle(rightChecked, it.key, $event)"
          >
            {{ it.label }}
          </Checkbox>
        </li>
      </ul>
    </div>
  </div>
</template>
