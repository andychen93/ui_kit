<script lang="ts">
  import Button from "../button/Button.svelte";

  let {
    id,
    status,
    disabled = false,
    confirmTitle,
    ontoggle,
  }: {
    id: string | number;
    status: number;
    disabled?: boolean;
    confirmTitle?: (nextEnabled: boolean) => string;
    ontoggle?: (id: string | number, checked: boolean) => void;
  } = $props();

  let open = $state(false);
  let pending = $state<boolean | null>(null);
  const checked = $derived(status === 1);

  function attempt(next: boolean) {
    if (!confirmTitle) {
      ontoggle?.(id, next);
      return;
    }
    pending = next;
    open = true;
  }

  function apply() {
    if (pending == null) return;
    ontoggle?.(id, pending);
    open = false;
    pending = null;
  }
</script>

<div class="ag-overlay-root">
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    {disabled}
    class={["ag-switch", checked ? "is-checked" : ""].filter(Boolean).join(" ")}
    onclick={() => !disabled && attempt(!checked)}
  >
    <span class="ag-switch__thumb"></span>
  </button>
  {#if open && pending != null}
    <div class="ag-popconfirm">
      <p class="ag-popconfirm__title">{confirmTitle?.(pending) ?? "确认操作？"}</p>
      <div class="ag-popconfirm__actions">
        <Button
          size="sm"
          variant="neutral"
          onclick={() => {
            open = false;
            pending = null;
          }}>取消</Button
        >
        <Button size="sm" variant={pending ? "primary" : "danger"} onclick={apply}>确定</Button>
      </div>
    </div>
  {/if}
</div>
