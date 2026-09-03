<script lang="ts">
  import type { TransferItem } from "@argon-kit/core";
  import Button from "../button/Button.svelte";
  import Checkbox from "../checkbox/Checkbox.svelte";

  let {
    data,
    value = $bindable<string[]>([]),
    titles = ["待选", "已选"] as [string, string],
  }: {
    data: TransferItem[];
    value?: string[];
    titles?: [string, string];
  } = $props();

  let leftMap = $state<Record<string, boolean>>({});
  let rightMap = $state<Record<string, boolean>>({});

  const selected = $derived(new Set(value));
  const left = $derived(data.filter((d) => !selected.has(d.key)));
  const right = $derived(data.filter((d) => selected.has(d.key)));

  $effect.pre(() => {
    for (const it of left) leftMap[it.key] ??= false;
    for (const it of right) rightMap[it.key] ??= false;
  });

  function picked(map: Record<string, boolean>) {
    return Object.entries(map)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }

  function moveRight() {
    const keys = picked(leftMap);
    value = [...value, ...keys];
    leftMap = {};
  }

  function moveLeft() {
    const drop = new Set(picked(rightMap));
    value = value.filter((k) => !drop.has(k));
    rightMap = {};
  }
</script>

<div class="ag-transfer">
  <div class="ag-transfer__panel">
    <div class="ag-transfer__head">{titles[0]}（{left.length}）</div>
    <ul class="ag-transfer__list">
      {#each left as it (it.key)}
        <li>
          <Checkbox bind:checked={leftMap[it.key]} disabled={it.disabled}>{it.label}</Checkbox>
        </li>
      {/each}
    </ul>
  </div>
  <div class="ag-transfer__ops">
    <Button size="sm" disabled={!picked(leftMap).length} aria-label="移到右侧" onclick={moveRight}>›</Button>
    <Button size="sm" variant="neutral" disabled={!picked(rightMap).length} aria-label="移到左侧" onclick={moveLeft}>
      ‹
    </Button>
  </div>
  <div class="ag-transfer__panel">
    <div class="ag-transfer__head">{titles[1]}（{right.length}）</div>
    <ul class="ag-transfer__list">
      {#each right as it (it.key)}
        <li>
          <Checkbox bind:checked={rightMap[it.key]} disabled={it.disabled}>{it.label}</Checkbox>
        </li>
      {/each}
    </ul>
  </div>
</div>
