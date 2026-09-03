<script lang="ts">
  import { getContext, setContext } from "svelte";
  import type { Snippet } from "svelte";
  import { validateForm, type FormRule, type FormRules } from "@argon-kit/core";

  let {
    model,
    rules,
    layout = "horizontal",
    children,
  }: {
    model: Record<string, unknown>;
    rules?: FormRules;
    layout?: "horizontal" | "vertical";
    children?: Snippet;
  } = $props();

  let errors = $state<Record<string, string>>({});

  export type FormApi = {
    validate: () => Promise<Record<string, unknown>>;
    clearValidate: () => void;
    resetFields: () => void;
  };

  setContext("agForm", {
    get rules() {
      return rules;
    },
    get errors() {
      return errors;
    },
    getModel: (name: string) => model[name],
    setFieldError: (name: string, msg: string | null) => {
      if (msg) errors[name] = msg;
      else delete errors[name];
    },
  });

  const initialSnapshot = $state.snapshot(JSON.parse(JSON.stringify(model)));

  export const formApi: FormApi = {
    async validate() {
      try {
        return await validateForm(model, rules ?? {});
      } catch (errs) {
        errors = { ...(errs as Record<string, string>) };
        throw errs;
      }
    },
    clearValidate() {
      errors = {};
    },
    resetFields() {
      Object.keys(model).forEach((k) => delete model[k]);
      Object.assign(model, JSON.parse(JSON.stringify(initialSnapshot)));
      errors = {};
    },
  };
</script>

<form
  class={layout === "vertical" ? "ag-form ag-form--vertical" : "ag-form"}
  onsubmit={(e) => e.preventDefault()}
>
  {@render children?.()}
</form>
