<script lang="ts">
  import type { FieldStatus } from "./types";

  let {
    value = $bindable(""),
    placeholder,
    disabled = false,
    status,
    hint,
    rows = 3,
  }: {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    status?: FieldStatus;
    hint?: string;
    rows?: number;
  } = $props();
</script>

<div class="ag-field">
  <div
    class={[
      "ag-input-wrap",
      "ag-input-wrap--textarea",
      status ? `is-${status}` : "",
      disabled ? "is-disabled" : "",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <textarea class="ag-textarea" {placeholder} {disabled} {rows} bind:value></textarea>
  </div>
  {#if hint}
    <p class={["ag-field__hint", status ? `is-${status}` : ""].filter(Boolean).join(" ")}>
      {hint}
    </p>
  {/if}
</div>
