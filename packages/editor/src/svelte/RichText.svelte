<script lang="ts">
  import { onMount } from "svelte";
  import Quill from "quill";
  import "quill/dist/quill.snow.css";
  import { defaultToolbar, type RichTextProps } from "../core/toolbar";

  let {
    modelValue = "",
    placeholder = "请输入内容…",
    toolbar = defaultToolbar,
    readonly = false,
    height = 220,
    onchange,
  }: RichTextProps & { onchange?: (html: string) => void } = $props();

  let el: HTMLDivElement;

  onMount(() => {
    if (!el) return;
    const quill = new Quill(el, {
      theme: "snow",
      placeholder,
      readOnly: readonly,
      modules: { toolbar: toolbar as never },
    });
    // 经 clipboard 转 Delta（直接 innerHTML 会被 Quill 规范化清洗）
    if (modelValue) {
      quill.clipboard.dangerouslyPasteHTML(modelValue);
      quill.setSelection(null);
    }
    quill.on("text-change", () => {
      onchange?.(quill.root.innerHTML);
    });
  });
</script>

<div class={readonly ? "ag-quill is-readonly" : "ag-quill"}>
  <div bind:this={el} style="min-height:{height}px"></div>
</div>
