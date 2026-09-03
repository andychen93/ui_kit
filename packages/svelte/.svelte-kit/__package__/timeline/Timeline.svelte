<script lang="ts">
  import type { TimelineItem } from "@argon-kit/core";

  let {
    items,
  }: {
    items: TimelineItem[];
  } = $props();
</script>

<ul class="ag-timeline">
  {#each items as item, i (i)}
    <li class="ag-timeline__item">
      <span class={item.color ? `ag-timeline__dot ag-timeline__dot--${item.color}` : "ag-timeline__dot"}></span>
      <div class="ag-timeline__content">{item.content}</div>
      {#if item.time}<div class="ag-timeline__time">{item.time}</div>{/if}
    </li>
  {/each}
</ul>
