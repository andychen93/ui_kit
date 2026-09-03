<script lang="ts">
  import Input from "./Input.svelte";
  import type { FieldStatus } from "./types";

  let {
    value = $bindable(""),
    placeholder,
    disabled = false,
    status,
    hint,
  }: {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    status?: FieldStatus;
    hint?: string;
  } = $props();
</script>

<Input bind:value type="number" {placeholder} {disabled} {status} {hint} />
