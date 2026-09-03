<script lang="ts">
  import type { DescriptionItem } from "@argon-kit/core";

  let {
    title,
    items,
    border = false,
  }: {
    title?: string;
    items: DescriptionItem[];
    border?: boolean;
  } = $props();
</script>

<div>
  {#if title}<h4 class="ag-descriptions__title">{title}</h4>{/if}
  <div class={border ? "ag-descriptions ag-descriptions--border" : "ag-descriptions"}>
    <table class="ag-descriptions__table">
      <tbody>
        {#each items as item, i (i)}
          <tr class="ag-descriptions__row">
            <td class="ag-descriptions__label">{item.label}</td>
            <td class="ag-descriptions__content">{item.content}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
