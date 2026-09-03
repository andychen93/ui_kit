import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CrudField } from "@argon-kit/core";
import { message } from "@argon-kit/core";
import { Modal } from "../overlay/Modal";
import { Form, FormItem } from "../form/Form";
import { Input } from "../input/Input";
import { Password } from "../input/Password";
import { Textarea } from "../input/Textarea";
import { InputNumber } from "../input/InputNumber";
import { Select } from "../select/Select";
import { Switch } from "../switch/Switch";
import { DatePicker, RangePicker } from "../datepicker/DatePicker";
import { TreeSelect } from "../tree/TreeSelect";

export interface CrudFormModalProps {
  open: boolean;
  recordId: string | number | null;
  fields: CrudField[];
  title: string;
  onLoad?: (id: string | number) => Promise<Record<string, unknown>>;
  onSubmit: (values: Record<string, unknown>, isEdit: boolean) => Promise<void>;
  onSuccess?: () => void;
  onCancel: () => void;
  width?: number;
  /** render 逃逸字段 */
  renderField?: (field: CrudField, model: Record<string, unknown>) => ReactNode;
}

export function CrudFormModal({
  open,
  recordId,
  fields,
  title,
  onLoad,
  onSubmit,
  onSuccess,
  onCancel,
  width = 600,
  renderField,
}: CrudFormModalProps) {
  const isEdit = recordId != null;
  const [model, setModel] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(false);

  const emptyModel = useMemo(() => {
    const m: Record<string, unknown> = {};
    for (const f of fields) m[f.name] = f.type === "switch" ? false : f.type === "dateRange" ? null : "";
    return m;
  }, [fields]);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setErrors({});
    if (isEdit && onLoad) {
      setLoadingRecord(true);
      onLoad(recordId)
        .then((record) => {
          if (!alive) return;
          const next = { ...emptyModel };
          for (const f of fields) {
            const v = record[f.name];
            if (v !== undefined) next[f.name] = f.type === "switch" ? v === 1 || v === true : v;
          }
          setModel(next);
        })
        .finally(() => alive && setLoadingRecord(false));
    } else {
      setModel(emptyModel);
    }
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, recordId]);

  const setField = (name: string, v: unknown) => setModel((m) => ({ ...m, [name]: v }));

  async function handleConfirm() {
    if (submitting) return;
    // 本地校验（字段级规则聚合）
    const errs: Record<string, string> = {};
    await Promise.all(
      fields.map(async (f) => {
        if (!f.rules?.length) return;
        const { validateField } = await import("@argon-kit/core");
        const msg = await validateField(model[f.name], f.rules);
        if (msg) errs[f.name] = msg;
      }),
    );
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const values: Record<string, unknown> = { ...model };
    for (const f of fields) {
      if (f.type === "switch") values[f.name] = values[f.name] ? 1 : 0;
    }
    setSubmitting(true);
    try {
      await onSubmit(values, isEdit);
      message.success(isEdit ? "编辑成功" : "新增成功");
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? `编辑${title}` : `新增${title}`}
      width={width}
      confirmLoading={submitting}
      onClose={onCancel}
      onConfirm={handleConfirm}
    >
      {loadingRecord ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--ag-gray-500)" }}>加载中…</div>
      ) : (
        <Form model={model} layout="vertical">
          {fields.map((f) => {
            const err = errors[f.name];
            const control =
              f.type === "render" ? (
                renderField?.(f, model)
              ) : f.type === "password" ? (
                <Password
                  placeholder={f.placeholder}
                  value={String(model[f.name] ?? "")}
                  onChange={(e) => setField(f.name, e.target.value)}
                  status={err ? "error" : undefined}
                />
              ) : f.type === "textarea" ? (
                <Textarea
                  rows={2}
                  placeholder={f.placeholder}
                  value={String(model[f.name] ?? "")}
                  onChange={(e) => setField(f.name, e.target.value)}
                  status={err ? "error" : undefined}
                />
              ) : f.type === "number" ? (
                <InputNumber
                  placeholder={f.placeholder}
                  value={String(model[f.name] ?? "")}
                  onChange={(e) => setField(f.name, e.target.value)}
                  status={err ? "error" : undefined}
                />
              ) : f.type === "select" ? (
                <Select
                  options={f.options ?? []}
                  placeholder={f.placeholder}
                  value={(model[f.name] as string | number | null) ?? null}
                  onChange={(v) => setField(f.name, v)}
                  status={err ? "error" : undefined}
                />
              ) : f.type === "switch" ? (
                <Switch
                  checked={Boolean(model[f.name])}
                  onChange={(v) => setField(f.name, v)}
                />
              ) : f.type === "date" ? (
                <DatePicker
                  placeholder={f.placeholder}
                  value={(model[f.name] as string | null) ?? null}
                  onChange={(v) => setField(f.name, v)}
                  status={err ? "error" : undefined}
                />
              ) : f.type === "dateRange" ? (
                <RangePicker
                  value={(model[f.name] as [string, string] | null) ?? null}
                  onChange={(v) => setField(f.name, v)}
                  status={err ? "error" : undefined}
                />
              ) : f.type === "treeSelect" ? (
                <TreeSelect
                  data={f.data ?? []}
                  placeholder={f.placeholder}
                  value={(model[f.name] as string | number | null) ?? null}
                  onChange={(v) => setField(f.name, v)}
                  status={err ? "error" : undefined}
                />
              ) : (
                <Input
                  placeholder={f.placeholder}
                  value={String(model[f.name] ?? "")}
                  onChange={(e) => setField(f.name, e.target.value)}
                  status={err ? "error" : undefined}
                />
              );
            return (
              <FormItem key={f.name} label={f.label} name={f.name} span={f.span}>
                {control}
                {err ? <span className="ag-form-item__error">{err}</span> : null}
              </FormItem>
            );
          })}
        </Form>
      )}
    </Modal>
  );
}
