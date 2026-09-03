<script lang="ts">
  import { getContext, setContext } from "svelte";
  import type { Snippet } from "svelte";

  let {
    value = $bindable([]),
    accordion = false,
    onChange,
    children,
  }: {
    value?: string[];
    accordion?: boolean;
    onChange?: (keys: string[]) => void;
    children?: Snippet;
  } = $props();

  function toggle(key: string) {
    if (accordion) {
      value = value.includes(key) ? [] : [key];
    } else {
      value = value.includes(key)
        ? value.filter((k) => k !== key)
        : [...value, key];
    }
    onChange?.(value);
  }

  function isActive(key: string) {
    return value.includes(key);
  }

  setContext("agCollapse", { toggle, isActive });
</script>

<div class="ag-collapse" data-accordion={accordion}>
  {@render children?.()}
</div>
