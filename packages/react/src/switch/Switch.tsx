export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked = false,
  onChange,
  disabled,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={["ag-switch", checked ? "is-checked" : "", className]
        .filter(Boolean)
        .join(" ")}
      onClick={() => !disabled && onChange?.(!checked)}
    >
      <span className="ag-switch__thumb" />
    </button>
  );
}
