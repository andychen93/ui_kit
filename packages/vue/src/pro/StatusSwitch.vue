<script setup lang="ts">
import { ref } from "vue";
import Button from "../button/Button.vue";
import Switch from "../switch/Switch.vue";

const props = defineProps<{
  id: string | number;
  status: number;
  disabled?: boolean;
  confirmTitle?: (nextEnabled: boolean) => string;
}>();

const emit = defineEmits<{
  toggle: [id: string | number, checked: boolean];
}>();

const open = ref(false);
const pending = ref<boolean | null>(null);
const checked = () => props.status === 1;

function attempt(next: boolean) {
  if (!props.confirmTitle) {
    emit("toggle", props.id, next);
    return;
  }
  pending.value = next;
  open.value = true;
}

function apply() {
  if (pending.value == null) return;
  emit("toggle", props.id, pending.value);
  open.value = false;
  pending.value = null;
}
</script>

<template>
  <div class="ag-overlay-root">
    <Switch :model-value="checked()" :disabled="disabled" @update:model-value="attempt" />
    <div v-if="open && pending != null" class="ag-popconfirm">
      <p class="ag-popconfirm__title">{{ confirmTitle?.(pending) ?? "确认操作？" }}</p>
      <div class="ag-popconfirm__actions">
        <Button size="sm" variant="neutral" @click="open = false; pending = null">取消</Button>
        <Button size="sm" :variant="pending ? 'primary' : 'danger'" @click="apply">确定</Button>
      </div>
    </div>
  </div>
</template>
