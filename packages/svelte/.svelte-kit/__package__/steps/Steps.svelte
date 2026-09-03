<script lang="ts">
  import type { StepItem } from "@argon-kit/core";

  let {
    items,
    current = 0,
    direction = "horizontal",
  }: {
    items: StepItem[];
    current?: number;
    direction?: "horizontal" | "vertical";
  } = $props();
</script>

<div class={direction === "vertical" ? "ag-steps ag-steps--vertical" : "ag-steps"}>
  {#each items as item, i (i)}
    <div
      class={"ag-steps__item"
        + (i < current ? " is-finish" : "")
        + (i === current ? " is-active" : "")}
    >
      <span class="ag-steps__marker">{#if i < current}✓{:else}{i + 1}{/if}</span>
      <div class="ag-steps__meta">
        <div class="ag-steps__title">{item.title}</div>
        {#if item.description}<div class="ag-steps__desc">{item.description}</div>{/if}
      </div>
    </div>
  {/each}
</div>
