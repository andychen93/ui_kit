import { useEffect, useRef } from "react";
import noUiSlider, { PipsMode } from "nouislider";
import "nouislider/dist/nouislider.css";
import type { RangeSliderProps } from "../../core/types";

function isRange(v: number | [number, number]): v is [number, number] {
  return Array.isArray(v);
}

export function RangeSlider({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  tooltips = false,
  pips = false,
  disabled = false,
  onChange,
}: RangeSliderProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!elRef.current) return;
    const start = isRange(value) ? value : [value];
    const slider = noUiSlider.create(elRef.current, {
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
      onChangeRef.current?.(
        nums.length === 2 ? ([nums[0], nums[1]] as [number, number]) : nums[0],
      );
    });
    const el = elRef.current as HTMLDivElement & {
      noUiSlider?: { destroy: () => void; disable: (v: boolean) => void; enable: () => void };
    };
    if (disabled) el.noUiSlider?.disable(true);
    return () => el.noUiSlider?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, step, tooltips, pips]);

  useEffect(() => {
    const el = elRef.current as (HTMLDivElement & {
      noUiSlider?: {
        get: () => string;
        set: (v: number | [number, number]) => void;
        disable: (v: boolean) => void;
        enable: () => void;
      };
    }) | null;
    if (!el?.noUiSlider) return;
    const current = el.noUiSlider.get();
    const next = (isRange(value) ? value : [value]).map(Number).join(",");
    if (current !== next) el.noUiSlider.set(value);
    if (disabled) el.noUiSlider.disable(true);
    else el.noUiSlider.enable();
  }, [value, disabled]);

  return (
    <div className={disabled ? "ag-noui ag-noui--disabled" : "ag-noui"}>
      <div ref={elRef} />
    </div>
  );
}
