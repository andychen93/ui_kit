<script lang="ts">
  import Button from "../button/Button.svelte";

  let {
    files = $bindable<File[]>([]),
    accept,
    multiple = false,
    disabled = false,
    buttonText = "选择文件",
  }: {
    files?: File[];
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    buttonText?: string;
  } = $props();

  let inputEl: HTMLInputElement | undefined;
</script>

<div class="ag-upload">
  <input
    bind:this={inputEl}
    class="ag-upload__input"
    type="file"
    {accept}
    {multiple}
    {disabled}
    onchange={(e) => (files = Array.from((e.currentTarget as HTMLInputElement).files ?? []))}
  />
  <Button variant="neutral" {disabled} onclick={() => inputEl?.click()}>
    {buttonText}
  </Button>
  {#if files.length}
    <ul class="ag-upload__list">
      {#each files as f}
        <li class="ag-upload__item">{f.name}</li>
      {/each}
    </ul>
  {/if}
</div>
