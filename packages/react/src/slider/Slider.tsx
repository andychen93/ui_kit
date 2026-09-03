import type { CSSProperties } from "react";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onChange,
}: SliderProps) {
  const current = value ?? defaultValue;
  const percent = ((current - min) / (max - min)) * 100;

  return (
    <div className={disabled ? "ag-slider ag-slider--disabled" : "ag-slider"}>
      <input
        type="range"
        className="ag-slider__input"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        style={{ "--ag-slider-percent": `${percent}%` } as CSSProperties}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      <span className="ag-slider__value">{current}</span>
    </div>
  );
}
