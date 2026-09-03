<script lang="ts">
  import type { Snippet } from "svelte";
  import Input from "./Input.svelte";
  import Glyph from "../glyph/Glyph.svelte";
  import type { FieldStatus } from "./types";

  let {
    value = $bindable(""),
    placeholder,
    disabled = false,
    status,
    hint,
    prefix,
  }: {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    status?: FieldStatus;
    hint?: string;
    prefix?: Snippet;
  } = $props();

  let visible = $state(false);
</script>

<Input
  bind:value
  type={visible ? "text" : "password"}
  {placeholder}
  {disabled}
  {status}
  {hint}
  {prefix}
>
  {#snippet suffix()}
    <button
      type="button"
      class="ag-input__addon-btn"
      aria-label={visible ? "隐藏密码" : "显示密码"}
      onclick={() => (visible = !visible)}
    >
      <Glyph name={visible ? "eyeOff" : "eye"} />
    </button>
  {/snippet}
</Input>
