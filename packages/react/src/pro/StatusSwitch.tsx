import { useState } from "react";
import { Button } from "../button/Button";
import { Switch } from "../switch/Switch";

export interface StatusSwitchProps {
  id: string | number;
  status: number;
  onToggle: (id: string | number, checked: boolean) => void | Promise<void>;
  disabled?: boolean;
  confirmTitle?: (nextEnabled: boolean) => string;
}

export function StatusSwitch({
  id,
  status,
  onToggle,
  disabled,
  confirmTitle,
}: StatusSwitchProps) {
  const checked = status === 1;
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<boolean | null>(null);

  async function apply(next: boolean) {
    await onToggle(id, next);
    setOpen(false);
    setPending(null);
  }

  function attempt(next: boolean) {
    if (!confirmTitle) {
      void apply(next);
      return;
    }
    setPending(next);
    setOpen(true);
  }

  return (
    <div className="ag-overlay-root">
      <Switch checked={checked} disabled={disabled} onChange={attempt} />
      {open && pending != null ? (
        <div className="ag-popconfirm">
          <p className="ag-popconfirm__title">{confirmTitle?.(pending) ?? "确认操作？"}</p>
          <div className="ag-popconfirm__actions">
            <Button
              size="sm"
              variant="neutral"
              onClick={() => {
                setOpen(false);
                setPending(null);
              }}
            >
              取消
            </Button>
            <Button size="sm" variant={pending ? "primary" : "danger"} onClick={() => void apply(pending)}>
              确定
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
