import type { InputHTMLAttributes, ReactNode } from "react";
import { Glyph } from "../glyph/Glyph";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children?: ReactNode;
}

export function Checkbox({
  checked,
  onChange,
  disabled,
  children,
  className,
  ...rest
}: CheckboxProps) {
  return (
    <label
      className={["ag-check", disabled ? "is-disabled" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="checkbox"
        className="ag-check__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
      />
      <span className="ag-checkbox__box">
        {checked ? <Glyph name="check" /> : null}
      </span>
      {children ? <span>{children}</span> : null}
    </label>
  );
}
