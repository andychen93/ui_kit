<script lang="ts">
  import Collapse from "./Collapse.svelte";
  import CollapsePanel from "./CollapsePanel.svelte";

  let {
    value = $bindable([]),
    accordion = false,
  }: {
    value?: string[];
    accordion?: boolean;
  } = $props();
</script>

<Collapse bind:value {accordion}>
  <CollapsePanel panelKey="a" title="面板 A">内容 A</CollapsePanel>
  <CollapsePanel panelKey="b" title="面板 B">内容 B</CollapsePanel>
</Collapse>
