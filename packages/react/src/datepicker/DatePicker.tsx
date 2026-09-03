import { useEffect, useMemo, useRef, useState } from "react";
import {
  WEEKDAYS,
  addMonths,
  compareYMD,
  formatYMD,
  monthGrid,
  ymd,
} from "@argon-kit/core";
import { Glyph } from "../glyph/Glyph";
import type { FieldStatus } from "../input/types";

function MonthPanel({
  year,
  month,
  selected,
  rangeStart,
  rangeEnd,
  onPick,
  onPrev,
  onNext,
}: {
  year: number;
  month: number;
  selected?: string | null;
  rangeStart?: string | null;
  rangeEnd?: string | null;
  onPick: (value: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const today = formatYMD(new Date());
  const cells = useMemo(() => monthGrid(year, month), [year, month]);
  return (
    <div className="ag-calendar__panel">
      <div className="ag-calendar__head">
        <button type="button" className="ag-calendar__nav" aria-label="上一月" onClick={onPrev} disabled={!onPrev}>
          <Glyph name="chevronLeft" />
        </button>
        <span>{year} 年 {month + 1} 月</span>
        <button type="button" className="ag-calendar__nav" aria-label="下一月" onClick={onNext} disabled={!onNext}>
          <Glyph name="chevronRight" />
        </button>
      </div>
      <div className="ag-calendar__week">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="ag-calendar__grid">
        {cells.map((day, i) => {
          if (!day) {
            return <button key={i} type="button" className="ag-calendar__day" disabled />;
          }
          const value = ymd(year, month, day);
          const inRange =
            rangeStart &&
            rangeEnd &&
            compareYMD(value, rangeStart) >= 0 &&
            compareYMD(value, rangeEnd) <= 0;
          return (
            <button
              key={value}
              type="button"
              className={[
                "ag-calendar__day",
                value === today ? "is-today" : "",
                value === selected || value === rangeStart || value === rangeEnd ? "is-selected" : "",
                inRange ? "is-in-range" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onPick(value)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface DatePickerProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  status?: FieldStatus;
  allowClear?: boolean;
}

export function DatePicker({
  value = null,
  onChange,
  placeholder = "选择日期",
  disabled,
  status,
  allowClear,
}: DatePickerProps) {
  const parsed = value ? new Date(value + "T00:00:00") : new Date();
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState({ year: parsed.getFullYear(), month: parsed.getMonth() });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="ag-field" ref={ref}>
      <div className="ag-datepicker">
        <div
          role="combobox"
          aria-expanded={open}
          className={[
            "ag-input-wrap",
            "ag-select__trigger",
            status ? `is-${status}` : "",
            disabled ? "is-disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => !disabled && setOpen((v) => !v)}
        >
          <span className={["ag-select__value", value ? "" : "is-placeholder"].filter(Boolean).join(" ")}>
            {value ?? placeholder}
          </span>
          {allowClear && value ? (
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
          <div className="ag-calendar">
            <MonthPanel
              year={cursor.year}
              month={cursor.month}
              selected={value}
              onPick={(v) => {
                onChange?.(v);
                setOpen(false);
              }}
              onPrev={() => setCursor((c) => addMonths(c.year, c.month, -1))}
              onNext={() => setCursor((c) => addMonths(c.year, c.month, 1))}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export interface RangePickerProps {
  value?: [string, string] | null;
  onChange?: (value: [string, string] | null) => void;
  placeholder?: string;
  disabled?: boolean;
  status?: FieldStatus;
}

export function RangePicker({
  value = null,
  onChange,
  placeholder = "开始日期 ~ 结束日期",
  disabled,
  status,
}: RangePickerProps) {
  const base = value?.[0] ? new Date(value[0] + "T00:00:00") : new Date();
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState({ year: base.getFullYear(), month: base.getMonth() });
  const [draft, setDraft] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const next = addMonths(cursor.year, cursor.month, 1);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const label = value ? `${value[0]} ~ ${value[1]}` : placeholder;

  function pick(day: string) {
    if (!draft) {
      setDraft(day);
      return;
    }
    const start = compareYMD(draft, day) <= 0 ? draft : day;
    const end = compareYMD(draft, day) <= 0 ? day : draft;
    onChange?.([start, end]);
    setDraft(null);
    setOpen(false);
  }

  return (
    <div className="ag-field" ref={ref}>
      <div className="ag-datepicker">
        <div
          role="combobox"
          aria-expanded={open}
          className={["ag-input-wrap", "ag-select__trigger", disabled ? "is-disabled" : "", status ? `is-${status}` : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => !disabled && setOpen((v) => !v)}
        >
          <span className={["ag-select__value", value ? "" : "is-placeholder"].filter(Boolean).join(" ")}>
            {label}
          </span>
          <Glyph name="chevronDown" />
        </div>
        {open ? (
          <div className="ag-calendar ag-calendar--range">
            <MonthPanel
              year={cursor.year}
              month={cursor.month}
              rangeStart={draft ?? value?.[0]}
              rangeEnd={draft ? null : value?.[1]}
              onPick={pick}
              onPrev={() => setCursor((c) => addMonths(c.year, c.month, -1))}
            />
            <MonthPanel
              year={next.year}
              month={next.month}
              rangeStart={draft ?? value?.[0]}
              rangeEnd={draft ? null : value?.[1]}
              onPick={pick}
              onNext={() => setCursor((c) => addMonths(c.year, c.month, 1))}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
