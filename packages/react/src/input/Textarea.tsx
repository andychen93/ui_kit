import type { TextareaProps } from "./types";

export function Textarea({ status, hint, className, disabled, ...rest }: TextareaProps) {
  return (
    <div className={["ag-field", className].filter(Boolean).join(" ")}>
      <div
        className={[
          "ag-input-wrap",
          "ag-input-wrap--textarea",
          status ? `is-${status}` : "",
          disabled ? "is-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <textarea className="ag-textarea" disabled={disabled} {...rest} />
      </div>
      {hint ? (
        <p className={["ag-field__hint", status ? `is-${status}` : ""].filter(Boolean).join(" ")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
