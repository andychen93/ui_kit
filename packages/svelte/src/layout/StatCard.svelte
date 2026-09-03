<script lang="ts">
  import type { StatVariant } from "@argon-kit/core";

  let {
    variant = "primary",
    label,
    value,
    progress,
    hint,
  }: {
    variant?: StatVariant;
    label: string;
    value?: string | number;
    progress?: number;
    hint?: string;
  } = $props();

  const display = $derived(typeof value === "number" ? value.toLocaleString("en-US") : (value ?? "—"));
</script>

<div class={"ag-stat-card ag-stat-card--" + variant}>
  <div class="ag-stat-card__label">{label}</div>
  <div class="ag-stat-card__value">{display}</div>
  {#if progress != null}
    <div class="ag-stat-card__progress">
      <div class="ag-stat-card__bar" style="width:{progress}%"></div>
    </div>
  {/if}
  {#if hint}<div class="ag-stat-card__hint">{hint}</div>{/if}
</div>
