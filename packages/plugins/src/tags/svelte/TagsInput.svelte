<script lang="ts">
  import type { TagsInputProps } from "../../core/types";

  let {
    value = $bindable([]),
    placeholder = "输入后回车添加",
    maxTags = Infinity,
    onlyUnique = false,
    disabled = false,
    onchange,
  }: TagsInputProps & { value?: string[] } = $props();

  let input = $state("");

  const canAdd = $derived(
    !disabled &&
      input.trim().length > 0 &&
      value.length < maxTags &&
      (!onlyUnique || !value.includes(input.trim())),
  );

  function commit() {
    if (!canAdd) {
      input = "";
      return;
    }
    value = [...value, input.trim()];
    onchange?.(value);
    input = "";
  }

  function remove(tag: string) {
    if (disabled) return;
    value = value.filter((t) => t !== tag);
    onchange?.(value);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && input === "" && value.length) {
      remove(value[value.length - 1]);
    }
  }
</script>

<div class={disabled ? "ag-tags is-disabled" : "ag-tags"}>
  {#each value as tag (tag)}
    <span class="ag-tags__tag">
      {tag}
      {#if !disabled}
        <button type="button" class="ag-tags__remove" aria-label="remove" onclick={() => remove(tag)}>×</button>
      {/if}
    </span>
  {/each}
  <input
    class="ag-tags__input"
    placeholder={value.length ? "" : placeholder}
    {disabled}
    bind:value={input}
    onkeydown={onKeydown}
    onblur={commit}
  />
</div>
