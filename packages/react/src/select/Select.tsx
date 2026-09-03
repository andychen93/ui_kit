import { useEffect, useRef, useState } from "react";
import { Glyph } from "../glyph/Glyph";
import type { FieldStatus } from "../input/types";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  status?: FieldStatus;
  hint?: string;
  className?: string;
}

export function Select({
  options,
  value = null,
  onChange,
  placeholder = "请选择",
  disabled,
  allowClear,
  status,
  hint,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={["ag-field", className].filter(Boolean).join(" ")} ref={rootRef}>
      <div className="ag-select">
        <div
          role="combobox"
          aria-expanded={open}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={[
            "ag-input-wrap",
            "ag-select__trigger",
            status ? `is-${status}` : "",
            disabled ? "is-disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => !disabled && setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((v) => !v);
            }
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <span className={["ag-select__value", selected ? "" : "is-placeholder"].filter(Boolean).join(" ")}>
            {selected?.label ?? placeholder}
          </span>
          {allowClear && selected ? (
            <button
              type="button"
              className="ag-input__addon-btn"
              aria-label="清除"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(null);
              }}
            >
              <Glyph name="x" />
            </button>
          ) : (
            <Glyph name="chevronDown" />
          )}
        </div>
        {open ? (
          <ul className="ag-select__dropdown" role="listbox">
            {options.map((opt) => (
              <li
                key={String(opt.value)}
                role="option"
                aria-selected={opt.value === value}
                className={[
                  "ag-select__option",
                  opt.value === value ? "is-active" : "",
                  opt.disabled ? "is-disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  if (opt.disabled) return;
                  onChange?.(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {hint ? (
        <p className={["ag-field__hint", status ? `is-${status}` : ""].filter(Boolean).join(" ")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
