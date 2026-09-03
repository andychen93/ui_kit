<script lang="ts">
  import type { QueryField } from "@argon-kit/core";
  import Button from "../button/Button.svelte";
  import RangePicker from "../datepicker/RangePicker.svelte";
  import Input from "../input/Input.svelte";
  import Select from "../select/Select.svelte";

  let { fields, onsearch }: { fields: QueryField[]; onsearch?: (values: Record<string, unknown>) => void } =
    $props();

  let texts = $state<Record<string, string>>({});
  let selects = $state<Record<string, string | number | null>>({});
  let ranges = $state<Record<string, [string, string] | null>>({});

  $effect.pre(() => {
    for (const f of fields) {
      if (f.type === "select") selects[f.name] ??= null;
      else if (f.type === "dateRange") ranges[f.name] ??= null;
      else texts[f.name] ??= "";
    }
  });

  function compact() {
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      const v =
        f.type === "select" ? selects[f.name] : f.type === "dateRange" ? ranges[f.name] : texts[f.name];
      if (v !== undefined && v !== "" && v !== null) out[f.name] = v;
    }
    return out;
  }

  function reset() {
    texts = {};
    selects = {};
    ranges = {};
    onsearch?.({});
  }
</script>

<div class="ag-card ag-query-form">
  <div class="ag-query-form__grid">
    {#each fields as f}
      <div class="ag-field">
        <span class="ag-field__label">{f.label}</span>
        {#if f.type === "select"}
          <Select
            options={f.options ?? []}
            bind:value={selects[f.name]}
            allowClear
            placeholder={f.placeholder ?? "全部"}
          />
        {:else if f.type === "dateRange"}
          <RangePicker bind:value={ranges[f.name]} placeholder={f.placeholder ?? "开始日期 ~ 结束日期"} />
        {:else}
          <Input bind:value={texts[f.name]} placeholder={f.placeholder ?? "请输入"} />
        {/if}
      </div>
    {/each}
    <div class="ag-query-form__actions">
      <Button onclick={() => onsearch?.(compact())}>查询</Button>
      <Button variant="neutral" onclick={reset}>重置</Button>
    </div>
  </div>
</div>
