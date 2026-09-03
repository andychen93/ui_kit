import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { defaultToolbar, type RichTextProps } from "../core/toolbar";

export function RichText({
  modelValue = "",
  placeholder = "请输入内容…",
  toolbar = defaultToolbar,
  readonly = false,
  height = 220,
  onChange,
}: RichTextProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!elRef.current) return;
    const quill = new Quill(elRef.current, {
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
      onChangeRef.current?.(quill.root.innerHTML);
    });
    quillRef.current = quill;
    return () => {
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={readonly ? "ag-quill is-readonly" : "ag-quill"}>
      <div ref={elRef} style={{ minHeight: height }} />
    </div>
  );
}
