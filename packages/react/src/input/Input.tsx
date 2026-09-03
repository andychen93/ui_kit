import type { InputProps } from "./types";

export function Input({
  prefix,
  suffix,
  status,
  hint,
  className,
  disabled,
  ...rest
}: InputProps) {
  return (
    <div className={["ag-field", className].filter(Boolean).join(" ")}>
      <div
        className={[
          "ag-input-wrap",
          status ? `is-${status}` : "",
          disabled ? "is-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {prefix ? <span className="ag-input__addon">{prefix}</span> : null}
        <input className="ag-input" disabled={disabled} {...rest} />
        {suffix ? <span className="ag-input__addon">{suffix}</span> : null}
      </div>
      {hint ? (
        <p className={["ag-field__hint", status ? `is-${status}` : ""].filter(Boolean).join(" ")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
