<script setup lang="ts">
import { ref } from "vue";
import Button from "../button/Button.vue";

defineProps<{ title?: string }>();
const emit = defineEmits<{ confirm: [] }>();
const open = ref(false);
</script>

<template>
  <div class="ag-overlay-root">
    <span @click="open = !open"><slot /></span>
    <div v-if="open" class="ag-popconfirm">
      <p class="ag-popconfirm__title">{{ title ?? "确认操作？" }}</p>
      <div class="ag-popconfirm__actions">
        <Button size="sm" variant="neutral" @click="open = false">取消</Button>
        <Button
          size="sm"
          variant="danger"
          @click="emit('confirm'); open = false"
        >
          确定
        </Button>
      </div>
    </div>
  </div>
</template>
