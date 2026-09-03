import { useState } from "react";
import type { TransferItem } from "@argon-kit/core";
import { Button } from "../button/Button";
import { Checkbox } from "../checkbox/Checkbox";

export function Transfer({
  data,
  value = [],
  onChange,
  titles = ["待选", "已选"],
}: {
  data: TransferItem[];
  value?: string[];
  onChange?: (keys: string[]) => void;
  titles?: [string, string];
}) {
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);
  const selected = new Set(value);
  const left = data.filter((d) => !selected.has(d.key));
  const right = data.filter((d) => selected.has(d.key));

  function toggle(list: string[], set: (v: string[]) => void, key: string, on: boolean) {
    set(on ? [...list, key] : list.filter((k) => k !== key));
  }

  function moveRight() {
    onChange?.([...value, ...leftChecked]);
    setLeftChecked([]);
  }

  function moveLeft() {
    const drop = new Set(rightChecked);
    onChange?.(value.filter((k) => !drop.has(k)));
    setRightChecked([]);
  }

  function panel(
    title: string,
    items: TransferItem[],
    checked: string[],
    setChecked: (v: string[]) => void,
  ) {
    return (
      <div className="ag-transfer__panel">
        <div className="ag-transfer__head">
          {title}（{items.length}）
        </div>
        <ul className="ag-transfer__list">
          {items.map((it) => (
            <li key={it.key}>
              <Checkbox
                checked={checked.includes(it.key)}
                disabled={it.disabled}
                onChange={(on) => toggle(checked, setChecked, it.key, on)}
              >
                {it.label}
              </Checkbox>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="ag-transfer">
      {panel(titles[0], left, leftChecked, setLeftChecked)}
      <div className="ag-transfer__ops">
        <Button size="sm" disabled={!leftChecked.length} onClick={moveRight} aria-label="移到右侧">
          ›
        </Button>
        <Button size="sm" variant="neutral" disabled={!rightChecked.length} onClick={moveLeft} aria-label="移到左侧">
          ‹
        </Button>
      </div>
      {panel(titles[1], right, rightChecked, setRightChecked)}
    </div>
  );
}
