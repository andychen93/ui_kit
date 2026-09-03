<script lang="ts">
  import Popconfirm from "../overlay/Popconfirm.svelte";

  export interface RowActionItem {
    key: string;
    label: string;
    danger?: boolean;
    confirmTitle?: string;
    onClick: () => void;
  }

  let { items }: { items: RowActionItem[] } = $props();
</script>

<div class="ag-row-actions">
  {#each items as item (item.key)}
    {#if item.confirmTitle}
      <Popconfirm title={item.confirmTitle} onconfirm={item.onClick}>
        <button type="button" class={item.danger ? "is-danger" : ""}>{item.label}</button>
      </Popconfirm>
    {:else}
      <button type="button" class={item.danger ? "is-danger" : ""} onclick={item.onClick}>
        {item.label}
      </button>
    {/if}
  {/each}
</div>
