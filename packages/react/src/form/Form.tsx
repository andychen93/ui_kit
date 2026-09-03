import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { validateField, validateForm, type FormRule, type FormRules } from "@argon-kit/core";

interface FormCtx {
  rules?: FormRules;
  errors: Record<string, string>;
  getModel: (name: string) => unknown;
  setFieldError: (name: string, msg: string | null) => void;
  /** 版本号：errors 变化时递增，驱动 FormItem 重读 */
  bump: () => void;
}

const Ctx = createContext<FormCtx | null>(null);

export interface FormProps {
  model: Record<string, unknown>;
  rules?: FormRules;
  layout?: "horizontal" | "vertical";
  children?: ReactNode;
}

export function Form({ model, rules, layout = "horizontal", children }: FormProps) {
  const errorsRef = useRef<Record<string, string>>({});
  const [, force] = useState(0);
  const initialRef = useRef<Record<string, unknown>>({ ...model });

  const ctx = useMemo<FormCtx>(() => {
    const errors = errorsRef.current;
    return {
      rules,
      errors,
      getModel: (name) => model[name],
      setFieldError: (name, msg) => {
        if (msg) errors[name] = msg;
        else delete errors[name];
      },
      bump: () => force((v) => v + 1),
    };
    // model/rules 引用变化时重建 ctx（getModel 闭包需指向最新 model）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules, model]);

  const api = useMemo(
    () => ({
      async validate(): Promise<Record<string, unknown>> {
        try {
          return await validateForm(model, rules ?? {});
        } catch (errs) {
          const errors = errorsRef.current;
          Object.keys(errors).forEach((k) => delete errors[k]);
          Object.assign(errors, errs as Record<string, string>);
          force((v) => v + 1);
          throw errs;
        }
      },
      clearValidate() {
        Object.keys(errorsRef.current).forEach((k) => delete errorsRef.current[k]);
        force((v) => v + 1);
      },
      resetFields() {
        Object.keys(model).forEach((k) => delete model[k]);
        Object.assign(model, initialRef.current);
        this.clearValidate();
      },
    }),
    [model, rules],
  );

  return (
    <Ctx.Provider value={ctx}>
      <FormApiContext.Provider value={api}>
        <form
          className={layout === "vertical" ? "ag-form ag-form--vertical" : "ag-form"}
          onSubmit={(e) => e.preventDefault()}
        >
          {children}
        </form>
      </FormApiContext.Provider>
    </Ctx.Provider>
  );
}

export const FormApiContext = createContext<{
  validate: () => Promise<Record<string, unknown>>;
  clearValidate: () => void;
  resetFields: () => void;
} | null>(null);

/** 函数子组件模式：<Form>{(form) => ...}</Form> 可拿 validate/resetFields */
export function useFormApi(): {
  validate: () => Promise<Record<string, unknown>>;
  clearValidate: () => void;
  resetFields: () => void;
} | null {
  return useContext(FormApiContext);
}

export interface FormItemProps {
  label?: string;
  name?: string;
  rules?: FormRule[];
  span?: 24 | 12 | 8;
  hint?: string;
  children?: ReactNode;
}

export function FormItem({ label, name, rules, span = 24, hint, children }: FormItemProps) {
  const ctx = useContext(Ctx);
  const [, force] = useState(0);
  const value = name && ctx ? ctx.getModel(name) : undefined;
  const error = name ? (ctx?.errors[name] ?? null) : null;

  useEffect(() => {
    if (!ctx || !name || !error) return;
    const rs = rules ?? ctx.rules?.[name];
    if (!rs?.length) return;
    let alive = true;
    void validateField(value, rs).then((msg) => {
      if (!alive) return;
      ctx.setFieldError(name, msg);
      force((v) => v + 1);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  return (
    <div
      className={[
        "ag-form-item",
        span !== 24 ? `ag-form-item--span-${span}` : "",
        error ? "is-error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label ? <label className="ag-form-item__label">{label}</label> : null}
      <div className="ag-form-item__control">
        {children}
        {error ? (
          <span className="ag-form-item__error">{error}</span>
        ) : hint ? (
          <span className="ag-form-item__hint">{hint}</span>
        ) : null}
      </div>
    </div>
  );
}
