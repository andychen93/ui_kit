<script setup lang="ts">
import { computed } from "vue";

export type SweetAlertType = "success" | "error" | "warning" | "info" | "primary";

const props = withDefaults(
  defineProps<{
    open?: boolean;
    type?: SweetAlertType;
    title?: string;
    content?: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
  }>(),
  {
    open: false,
    type: "success",
    title: "",
    content: "",
    confirmText: "确定",
    cancelText: "取消",
    showCancel: false,
  },
);

const emit = defineEmits<{ confirm: []; cancel: [] }>();

const ICONS: Record<SweetAlertType, string> = {
  success: '<path d="m8 12.5 2.7 2.7L16.5 9.5"/>',
  error: '<path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/>',
  warning: '<path d="M12 8v5M12 16.5v.5"/><path d="M12 3.5 21 19.5H3z"/>',
  info: '<path d="M12 8v.5M12 11v5"/>',
  primary: '<path d="M12 8v5M12 16.5v.5"/>',
};

const iconSvg = computed(
  () =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[props.type]}</svg>`,
);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ag-swal-mask">
      <div class="ag-swal" :class="`ag-swal--${type}`" role="alertdialog" aria-modal="true">
        <div class="ag-swal__icon" v-html="iconSvg" />
        <h3 class="ag-swal__title">{{ title }}</h3>
        <p v-if="content" class="ag-swal__content">{{ content }}</p>
        <div class="ag-swal__actions">
          <button
            v-if="showCancel"
            type="button"
            class="ag-btn ag-btn--neutral"
            @click="emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="ag-btn"
            :class="type === 'error' ? 'ag-btn--danger' : 'ag-btn--primary'"
            @click="emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
