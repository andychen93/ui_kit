<script lang="ts">
  let {
    percent = 0,
    variant = "primary",
    thin = false,
    striped = false,
    showLabel = false,
  }: {
    percent?: number;
    variant?:
      | "primary"
      | "info"
      | "success"
      | "warning"
      | "danger"
      | "gradient-primary"
      | "gradient-info"
      | "gradient-success"
      | "gradient-warning"
      | "gradient-danger";
    thin?: boolean;
    striped?: boolean;
    showLabel?: boolean;
  } = $props();

  const clamped = $derived(Math.min(100, Math.max(0, percent)));
  const className = $derived(
    [
      "ag-progress",
      `ag-progress--${variant}`,
      thin ? "ag-progress--thin" : "",
      striped ? "ag-progress--striped" : "",
    ]
      .filter(Boolean)
      .join(" "),
  );
</script>

<div class={className} role="progressbar" aria-valuenow={clamped} aria-valuemin="0" aria-valuemax="100">
  <div class="ag-progress__track">
    <div class="ag-progress__bar" style="width:{clamped}%"></div>
  </div>
  {#if showLabel}<span class="ag-progress__label">{clamped}%</span>{/if}
</div>
