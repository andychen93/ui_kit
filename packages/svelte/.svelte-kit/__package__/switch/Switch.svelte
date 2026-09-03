<script lang="ts">
  let {
    checked = $bindable(false),
    disabled = false,
  }: { checked?: boolean; disabled?: boolean } = $props();
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  {disabled}
  class={["ag-switch", checked ? "is-checked" : ""].filter(Boolean).join(" ")}
  onclick={() => !disabled && (checked = !checked)}
>
  <span class="ag-switch__thumb"></span>
</button>
