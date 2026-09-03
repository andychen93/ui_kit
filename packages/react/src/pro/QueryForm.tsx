import { useState } from "react";
import type { QueryField } from "@argon-kit/core";
import { Button } from "../button/Button";
import { RangePicker } from "../datepicker/DatePicker";
import { Input } from "../input/Input";
import { Select } from "../select/Select";

export type { QueryField };

export interface QueryFormProps {
  fields: QueryField[];
  onSearch: (values: Record<string, unknown>) => void;
}

function compact(values: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== undefined && v !== "" && v !== null),
  );
}

export function QueryForm({ fields, onSearch }: QueryFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>({});

  return (
    <div className="ag-card ag-query-form">
      <div className="ag-query-form__grid">
        {fields.map((f) => (
          <div key={f.name} className="ag-field">
            <span className="ag-field__label">{f.label}</span>
            {f.type === "select" ? (
              <Select
                options={f.options ?? []}
                value={(values[f.name] as string | number | null) ?? null}
                onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
                allowClear
                placeholder={f.placeholder ?? "全部"}
              />
            ) : f.type === "dateRange" ? (
              <RangePicker
                value={(values[f.name] as [string, string] | null) ?? null}
                onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
                placeholder={f.placeholder ?? "开始日期 ~ 结束日期"}
              />
            ) : (
              <Input
                value={String(values[f.name] ?? "")}
                onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.value }))}
                placeholder={f.placeholder ?? "请输入"}
              />
            )}
          </div>
        ))}
        <div className="ag-query-form__actions">
          <Button onClick={() => onSearch(compact(values))}>查询</Button>
          <Button
            variant="neutral"
            onClick={() => {
              setValues({});
              onSearch({});
            }}
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}
