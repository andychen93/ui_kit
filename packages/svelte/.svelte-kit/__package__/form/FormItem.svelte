<script lang="ts">
  import { getContext } from "svelte";
  import type { Snippet } from "svelte";
  import { validateField, type FormRule } from "@argon-kit/core";

  let {
    label,
    name,
    rules,
    span = 24,
    hint,
    children,
  }: {
    label?: string;
    name?: string;
    rules?: FormRule[];
    span?: 24 | 12 | 8;
    hint?: string;
    children?: Snippet<[{ error: string | null }]>;
  } = $props();

  const ctx = getContext<{
    rules?: Record<string, FormRule[]>;
    errors: Record<string, string>;
    getModel: (name: string) => unknown;
    setFieldError: (name: string, msg: string | null) => void;
  }>("agForm");

  const error = $derived(name ? (ctx?.errors[name] ?? null) : null);

  // 值变化：已标红则重新校验（修正后红字即时消失）
  $effect(() => {
    if (!ctx || !name || !error) return;
    const value = ctx.getModel(name);
    const rs = rules ?? ctx.rules?.[name];
    if (!rs?.length) return;
    void validateField(value, rs).then((msg) => ctx.setFieldError(name, msg));
  });
</script>

<div
  class={[
    "ag-form-item",
    span !== 24 ? `ag-form-item--span-${span}` : "",
    error ? "is-error" : "",
  ].filter(Boolean).join(" ")}
>
  {#if label}<label class="ag-form-item__label">{label}</label>{/if}
  <div class="ag-form-item__control">
    {@render children?.({ error })}
    {#if error}
      <span class="ag-form-item__error">{error}</span>
    {:else if hint}
      <span class="ag-form-item__hint">{hint}</span>
    {/if}
  </div>
</div>
