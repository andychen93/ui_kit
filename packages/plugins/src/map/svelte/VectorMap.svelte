<script lang="ts">
  import {
    regionColor,
    regionStats,
    worldRegions,
    type VectorMapProps,
  } from "../../core/worldMap";

  let {
    data = {},
    height = 320,
    onregionclick,
  }: VectorMapProps & {
    onregionclick?: (code: string, name: string) => void;
  } = $props();

  let hover = $state<{ name: string; value?: number; x: number; y: number } | null>(null);

  const stats = $derived(regionStats(data));

  function onMove(e: MouseEvent, region: (typeof worldRegions)[number]) {
    const rect = (e.currentTarget as SVGElement).closest("svg")?.getBoundingClientRect();
    if (!rect) return;
    hover = {
      name: region.name,
      value: data[region.code],
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
</script>

<div class="ag-vec" style="height:{height}px">
  <svg viewBox="0 0 1000 500" style="width:100%;height:100%;display:block">
    {#each worldRegions as region (region.code)}
      <path
        d={region.d}
        fill={regionColor(data[region.code], stats.max)}
        stroke="#fff"
        stroke-width="1.5"
        style="cursor:pointer"
        onmousemove={(e) => onMove(e, region)}
        onmouseleave={() => (hover = null)}
        onclick={() => onregionclick?.(region.code, region.name)}
      />
    {/each}
  </svg>
  {#if hover}
    <div class="ag-vec__tip" style="left:{hover.x + 12}px;top:{hover.y - 8}px">
      {hover.name}{hover.value !== undefined ? `：${hover.value}` : ""}
    </div>
  {/if}
  <div class="ag-vec__legend">
    低 <span class="ag-vec__ramp"></span> 高 ｜ 合计 {stats.total}
  </div>
</div>
