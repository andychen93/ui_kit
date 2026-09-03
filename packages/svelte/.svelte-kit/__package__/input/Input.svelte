<script lang="ts">
  import type { Snippet } from "svelte";
  import type { FieldStatus } from "./types";

  let {
    value = $bindable(""),
    placeholder,
    disabled = false,
    status,
    hint,
    type = "text",
    prefix,
    suffix,
  }: {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    status?: FieldStatus;
    hint?: string;
    type?: string;
    prefix?: Snippet;
    suffix?: Snippet;
  } = $props();
</script>

<div class="ag-field">
  <div
    class={["ag-input-wrap", status ? `is-${status}` : "", disabled ? "is-disabled" : ""]
      .filter(Boolean)
      .join(" ")}
  >
    {#if prefix}
      <span class="ag-input__addon">{@render prefix()}</span>
    {/if}
    <input class="ag-input" {type} {placeholder} {disabled} bind:value />
    {#if suffix}
      <span class="ag-input__addon">{@render suffix()}</span>
    {/if}
  </div>
  {#if hint}
    <p class={["ag-field__hint", status ? `is-${status}` : ""].filter(Boolean).join(" ")}>
      {hint}
    </p>
  {/if}
</div>
