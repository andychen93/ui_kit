<script lang="ts">
  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
  }: {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
  } = $props();

  const percent = $derived(((value - min) / (max - min)) * 100);

  function onInput(e: Event) {
    value = Number((e.currentTarget as HTMLInputElement).value);
  }
</script>

<div class={disabled ? "ag-slider ag-slider--disabled" : "ag-slider"}>
  <input
    type="range"
    class="ag-slider__input"
    {min}
    {max}
    {step}
    {value}
    {disabled}
    style="--ag-slider-percent:{percent}%"
    oninput={onInput}
  />
  <span class="ag-slider__value">{value}</span>
</div>
