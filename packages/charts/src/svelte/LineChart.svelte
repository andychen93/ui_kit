<script lang="ts">
  import ArgonChart from "./Chart.svelte";

  let {
    labels,
    datasets,
    options = {},
    height = 300,
  }: {
    labels: string[];
    datasets: Array<Record<string, unknown>>;
    options?: Record<string, unknown>;
    height?: number;
  } = $props();
</script>

<ArgonChart kind="line" {labels} {datasets} {options} {height} />
