<script lang="ts">
  import type { CarouselProps, CarouselItem } from "../../core/types";

  let {
    items,
    interval = 5000,
    indicators = true,
    controls = true,
  }: CarouselProps & { items: CarouselItem[] } = $props();

  let active = $state(0);
  let paused = $state(false);
  let timer: ReturnType<typeof setInterval> | null = null;

  const count = $derived(items.length);

  function go(i: number) {
    active = (i + count) % count;
  }

  function start() {
    stop();
    if (interval > 0 && count > 1 && !paused) {
      timer = setInterval(() => go(active + 1), interval);
    }
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  $effect(() => {
    void interval;
    void count;
    void paused;
    start();
    return stop;
  });
</script>

<div
  class="ag-carousel"
  onmouseenter={() => (paused = true)}
  onmouseleave={() => (paused = false)}
>
  <div class="ag-carousel__track" style="transform:translateX(-{active * 100}%)">
    {#each items as item, i (item.key ?? i)}
      <div class="ag-carousel__item">
        {#if item.src}
          <img src={item.src} alt={item.alt ?? ""} />
        {:else}
          <div style="min-height:240px;display:flex;align-items:center;justify-content:center;background:var(--ag-gradient-primary);color:#fff;font-size:20px;font-weight:600">
            {item.content}
          </div>
        {/if}
        {#if item.caption}
          <div class="ag-carousel__caption">
            <h5>{item.caption}</h5>
            {#if item.description}<p>{item.description}</p>{/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
  {#if controls}
    <button type="button" class="ag-carousel__control ag-carousel__control--prev" aria-label="previous" onclick={() => go(active - 1)}>‹</button>
    <button type="button" class="ag-carousel__control ag-carousel__control--next" aria-label="next" onclick={() => go(active + 1)}>›</button>
  {/if}
  {#if indicators}
    <div class="ag-carousel__indicators">
      {#each items as _, i (i)}
        <button
          type="button"
          class={"ag-carousel__indicator" + (i === active ? " is-active" : "")}
          aria-label="slide {i + 1}"
          onclick={() => go(i)}
        ></button>
      {/each}
    </div>
  {/if}
</div>
