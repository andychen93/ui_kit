<script lang="ts">
  import { onMount } from "svelte";
  import noUiSlider, { PipsMode } from "nouislider";
  import "nouislider/dist/nouislider.css";
  import type { RangeSliderProps } from "../../core/types";

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    tooltips = false,
    pips = false,
    disabled = false,
    onchange,
  }: RangeSliderProps & { value?: number | [number, number] } = $props();

  let el: HTMLDivElement;

  function isRange(v: number | [number, number]): v is [number, number] {
    return Array.isArray(v);
  }

  onMount(() => {
    const start = isRange(value) ? value : [value];
    const slider = noUiSlider.create(el, {
      start,
      connect: isRange(value) ? [true, false, true] : [true, false],
      step,
      range: { min, max },
      tooltips,
      pips: pips
        ? { mode: PipsMode.Positions, values: [0, 25, 50, 75, 100], density: 5 }
        : undefined,
    });
    slider.on("update", (values) => {
      const nums = values.map(Number);
      const next = nums.length === 2 ? ([nums[0], nums[1]] as [number, number]) : nums[0];
      value = next;
      onchange?.(next);
    });
    return () => {
      (el as HTMLDivElement & { noUiSlider?: { destroy: () => void } }).noUiSlider?.destroy();
    };
  });

  $effect(() => {
    void value;
    void disabled;
    const handle = el as (HTMLDivElement & {
      noUiSlider?: { get: () => string; set: (v: number | [number, number]) => void; disable: (v: boolean) => void; enable: () => void };
    }) | undefined;
    if (!handle?.noUiSlider) return;
    const next = (isRange(value) ? value : [value]).map(Number).join(",");
    if (handle.noUiSlider.get() !== next) handle.noUiSlider.set(value);
    if (disabled) handle.noUiSlider.disable(true);
    else handle.noUiSlider.enable();
  });
</script>

<div class={disabled ? "ag-noui ag-noui--disabled" : "ag-noui"}>
  <div bind:this={el}></div>
</div>
