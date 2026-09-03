import type { SelectMultipleProps } from "../../core/types";

export function SelectMultiple({
  options,
  value = [],
  placeholder = "请选择",
  disabled = false,
  onChange,
}: SelectMultipleProps) {
  const toggle = (v: string) => {
    if (disabled) return;
    onChange?.(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  const remove = (v: string) => {
    if (disabled) return;
    onChange?.(value.filter((x) => x !== v));
  };

  return (
    <div className="ag-multiselect">
      {value.length ? (
        <div className="ag-multiselect__chips">
          {value.map((v) => (
            <span key={v} className="ag-multiselect__chip">
              {options.find((o) => o.value === v)?.label ?? v}
              <button type="button" aria-label="remove" onClick={() => remove(v)}>
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="ag-multiselect__placeholder">{placeholder}</div>
      )}
      <ul className="ag-multiselect__list">
        {options.map((opt) => (
          <li
            key={opt.value}
            className={`${value.includes(opt.value) ? "is-selected" : ""}${opt.disabled ? " is-disabled" : ""}`}
          >
            <label>
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                disabled={opt.disabled || disabled}
                onChange={() => toggle(opt.value)}
              />
              {opt.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
