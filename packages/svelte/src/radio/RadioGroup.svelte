<script lang="ts">
  import Radio from "./Radio.svelte";

  export interface RadioOption {
    label: string;
    value: string | number;
    disabled?: boolean;
  }

  let {
    value = $bindable<string | number | null>(null),
    options,
    name,
    disabled = false,
  }: {
    value?: string | number | null;
    options: RadioOption[];
    name?: string;
    disabled?: boolean;
  } = $props();
</script>

<div role="radiogroup" style="display:flex;gap:16px;flex-wrap:wrap">
  {#each options as opt}
    <Radio
      {name}
      checked={opt.value === value}
      disabled={disabled || opt.disabled}
      onchange={() => (value = opt.value)}
    >
      {opt.label}
    </Radio>
  {/each}
</div>
