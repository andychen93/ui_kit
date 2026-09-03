import type { InputHTMLAttributes, ReactNode } from "react";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children?: ReactNode;
}

export function Radio({
  checked,
  onChange,
  disabled,
  children,
  className,
  ...rest
}: RadioProps) {
  return (
    <label
      className={["ag-check", disabled ? "is-disabled" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="radio"
        className="ag-check__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
      />
      <span className="ag-radio__dot" />
      {children ? <span>{children}</span> : null}
    </label>
  );
}

export interface RadioOption {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name?: string;
  options: RadioOption[];
  value?: string | number | null;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  disabled,
}: RadioGroupProps) {
  return (
    <div role="radiogroup" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {options.map((opt) => (
        <Radio
          key={String(opt.value)}
          name={name}
          checked={opt.value === value}
          disabled={disabled || opt.disabled}
          onChange={() => onChange?.(opt.value)}
        >
          {opt.label}
        </Radio>
      ))}
    </div>
  );
}
