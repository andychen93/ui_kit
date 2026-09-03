<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Button from "../button/Button.vue";
import Glyph from "../glyph/Glyph.vue";

withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    /** 弹窗宽度 px */
    width?: number;
    /** 确认按钮 loading（防重复提交） */
    confirmLoading?: boolean;
    /** 隐藏底部（纯展示弹窗） */
    hideFooter?: boolean;
  }>(),
  { width: 520, confirmLoading: false, hideFooter: false },
);
const emit = defineEmits<{ close: []; confirm: [] }>();

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}
onMounted(() => document.addEventListener("keydown", onKey));
onUnmounted(() => document.removeEventListener("keydown", onKey));
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ag-mask" @click="emit('close')">
      <div
        class="ag-modal"
        :style="{ width: `min(${width}px, 100%)` }"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <div class="ag-modal__header">
          <h3 class="ag-modal__title">{{ title }}</h3>
          <button type="button" class="ag-modal__close" aria-label="关闭" @click="emit('close')">
            <Glyph name="x" />
          </button>
        </div>
        <div class="ag-modal__body">
          <slot />
        </div>
        <div v-if="!hideFooter" class="ag-modal__footer">
          <slot name="footer">
            <Button variant="neutral" @click="emit('close')">取消</Button>
            <Button :loading="confirmLoading" @click="emit('confirm')">确定</Button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
