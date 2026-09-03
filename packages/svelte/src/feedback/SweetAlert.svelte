<script lang="ts">
  const ICONS: Record<string, string> = {
    success: '<path d="m8 12.5 2.7 2.7L16.5 9.5"/>',
    error: '<circle cx="12" cy="12" r="9.2"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/>',
    warning: '<path d="M12 3.5 21 19.5H3z"/><path d="M12 9.5v4M12 16.5v.5"/>',
    info: '<circle cx="12" cy="12" r="9.2"/><path d="M12 11v5M12 8v.5"/>',
    primary: '<circle cx="12" cy="12" r="9.2"/><path d="M12 8v5M12 16.5v.5"/>',
  };

  let {
    open = false,
    type = "success",
    title = "",
    content = "",
    confirmText = "确定",
    cancelText = "取消",
    showCancel = false,
    onconfirm,
    oncancel,
  }: {
    open?: boolean;
    type?: "success" | "error" | "warning" | "info" | "primary";
    title?: string;
    content?: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onconfirm?: () => void;
    oncancel?: () => void;
  } = $props();
</script>

{#if open}
  <div class="ag-swal-mask">
    <div class="ag-swal ag-swal--{type}" role="alertdialog" aria-modal="true">
      <div class="ag-swal__icon">
        {@html `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[type]}</svg>`}
      </div>
      <h3 class="ag-swal__title">{title}</h3>
      {#if content}<p class="ag-swal__content">{content}</p>{/if}
      <div class="ag-swal__actions">
        {#if showCancel}
          <button type="button" class="ag-btn ag-btn--neutral" onclick={() => oncancel?.()}>
            {cancelText}
          </button>
        {/if}
        <button
          type="button"
          class="ag-btn {type === 'error' ? 'ag-btn--danger' : 'ag-btn--primary'}"
          onclick={() => onconfirm?.()}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}
