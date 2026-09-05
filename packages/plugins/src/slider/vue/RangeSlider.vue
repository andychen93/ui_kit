<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import noUiSlider from "nouislider";
import { PipsMode } from "nouislider";
import "nouislider/dist/nouislider.css";
import type { RangeSliderProps } from "../../core/types";

const props = withDefaults(defineProps<RangeSliderProps>(), {
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  tooltips: false,
  pips: false,
  disabled: false,
});

const emit = defineEmits<{ "update:modelValue": [number | [number, number]] }>();

const elRef = ref<HTMLElement | null>(null);

interface NouiApi {
  on: (ev: string, cb: (values: string[]) => void) => void;
  get: () => string;
  set: (v: number | [number, number]) => void;
  destroy: () => void;
}

let slider: NouiApi | null = null;

function isRange(v: number | [number, number]): v is [number, number] {
  return Array.isArray(v);
}

onMounted(() => {
  if (!elRef.value) return;
  const start = isRange(props.value) ? props.value : [props.value];
  slider = noUiSlider.create(elRef.value, {
    start,
    connect: isRange(props.value) ? [true, false, true] : [true, false],
    step: props.step,
    range: { min: props.min, max: props.max },
    tooltips: props.tooltips,
    pips: props.pips
      ? { mode: PipsMode.Positions, values: [0, 25, 50, 75, 100], density: 5 }
      : undefined,
  }) as unknown as NouiApi;
  slider.on("update", (values: string[]) => {
    const nums = values.map(Number);
    emit("update:modelValue", nums.length === 2 ? ([nums[0], nums[1]] as [number, number]) : nums[0]);
    props.onChange?.(
      nums.length === 2 ? ([nums[0], nums[1]] as [number, number]) : nums[0],
    );
  });
  if (props.disabled) (elRef.value as unknown as { setAttribute: (k: string, v: string) => void }).setAttribute("aria-disabled", "true");
});

watch(
  () => props.value,
  (v) => {
    const current = slider?.get() ?? null;
    const next = (isRange(v) ? v : [v]).map(Number).join(",");
    if (current !== next) slider?.set(isRange(v) ? v : ([v] as [number]));
  },
);

watch(
  () => props.disabled,
  (d) => {
    const el = elRef.value as (HTMLElement & { noUiSlider?: { disable?: (v: boolean) => void; enable?: () => void } }) | null;
    if (!el) return;
    if (d) el.noUiSlider?.disable?.(true);
    else el.noUiSlider?.enable?.();
  },
);

onBeforeUnmount(() => {
  slider?.destroy();
});
</script>

<template>
  <div class="ag-noui" :class="{ 'ag-noui--disabled': disabled }">
    <div ref="elRef" />
  </div>
</template>
