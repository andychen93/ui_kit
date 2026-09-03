<script lang="ts">
  import type { CrudField } from "@argon-kit/core";
  import { message, validateField } from "@argon-kit/core";
  import Modal from "../overlay/Modal.svelte";
  import Form from "../form/Form.svelte";
  import FormItem from "../form/FormItem.svelte";
  import Input from "../input/Input.svelte";
  import Password from "../input/Password.svelte";
  import Textarea from "../input/Textarea.svelte";
  import InputNumber from "../input/InputNumber.svelte";
  import Select from "../select/Select.svelte";
  import Switch from "../switch/Switch.svelte";
  import DatePicker from "../datepicker/DatePicker.svelte";
  import RangePicker from "../datepicker/RangePicker.svelte";
  import TreeSelect from "../tree/TreeSelect.svelte";

  let {
    open,
    recordId,
    fields,
    title,
    onLoad,
    onSubmit,
    onSuccess,
    onCancel,
    width = 600,
  }: {
    open: boolean;
    recordId: string | number | null;
    fields: CrudField[];
    title: string;
    onLoad?: (id: string | number) => Promise<Record<string, unknown>>;
    onSubmit: (values: Record<string, unknown>, isEdit: boolean) => Promise<void>;
    onSuccess?: () => void;
    onCancel: () => void;
    width?: number;
  } = $props();

  const isEdit = $derived(recordId != null);
  const modalTitle = $derived(isEdit ? `编辑${title}` : `新增${title}`);

  let model = $state<Record<string, unknown>>({});
  let errors = $state<Record<string, string>>({});
  let submitting = $state(false);
  let loadingRecord = $state(false);

  function resetModel() {
    const m: Record<string, unknown> = {};
    for (const f of fields) m[f.name] = f.type === "switch" ? false : f.type === "dateRange" ? null : "";
    model = m;
  }

  $effect(() => {
    if (!open) return;
    void recordId;
    resetModel();
    errors = {};
    if (isEdit && onLoad) {
      loadingRecord = true;
      onLoad(recordId as string | number)
        .then((record) => {
          for (const f of fields) {
            const v = record[f.name];
            if (v === undefined) continue;
            model[f.name] = f.type === "switch" ? v === 1 || v === true : v;
          }
        })
        .finally(() => (loadingRecord = false));
    }
  });

  async function handleConfirm() {
    if (submitting) return;
    const errs: Record<string, string> = {};
    await Promise.all(
      fields.map(async (f) => {
        if (!f.rules?.length) return;
        const msg = await validateField(model[f.name], f.rules);
        if (msg) errs[f.name] = msg;
      }),
    );
    if (Object.keys(errs).length) {
      errors = errs;
      return;
    }
    const values: Record<string, unknown> = { ...model };
    for (const f of fields) {
      if (f.type === "switch") values[f.name] = values[f.name] ? 1 : 0;
    }
    submitting = true;
    try {
      await onSubmit(values, isEdit);
      message.success(isEdit ? "编辑成功" : "新增成功");
      onSuccess?.();
    } finally {
      submitting = false;
    }
  }
</script>

<Modal
  {open}
  title={modalTitle}
  {width}
  confirmLoading={submitting}
  onclose={onCancel}
  onconfirm={handleConfirm}
>
  {#if loadingRecord}
    <div style="padding:40px;text-align:center;color:var(--ag-gray-500)">加载中…</div>
  {:else}
    <Form {model} layout="vertical">
      {#each fields as f (f.name)}
        {@const err = errors[f.name] ?? null}
        <FormItem label={f.label} name={f.name} span={f.span}>
          {#if f.type === "password"}
            <Password placeholder={f.placeholder} bind:value={model[f.name] as string} status={err ? "error" : undefined} />
          {:else if f.type === "textarea"}
            <Textarea rows={2} placeholder={f.placeholder} bind:value={model[f.name] as string} status={err ? "error" : undefined} />
          {:else if f.type === "number"}
            <InputNumber placeholder={f.placeholder} bind:value={model[f.name] as string} status={err ? "error" : undefined} />
          {:else if f.type === "select"}
            <Select options={f.options ?? []} placeholder={f.placeholder} bind:value={model[f.name] as string | number | null} status={err ? "error" : undefined} />
          {:else if f.type === "switch"}
            <Switch bind:checked={model[f.name] as boolean} />
          {:else if f.type === "date"}
            <DatePicker placeholder={f.placeholder} bind:value={model[f.name] as string | null} status={err ? "error" : undefined} />
          {:else if f.type === "dateRange"}
            <RangePicker bind:value={model[f.name] as [string, string] | null} status={err ? "error" : undefined} />
          {:else if f.type === "treeSelect"}
            <TreeSelect data={f.data ?? []} placeholder={f.placeholder} bind:value={model[f.name] as string | number | null} status={err ? "error" : undefined} />
          {:else if f.type === "render"}
            <slot name="field" {model} field={f} />
          {:else}
            <Input placeholder={f.placeholder} bind:value={model[f.name] as string} status={err ? "error" : undefined} />
          {/if}
          {#if err}<span class="ag-form-item__error">{err}</span>{/if}
        </FormItem>
      {/each}
    </Form>
  {/if}
</Modal>
