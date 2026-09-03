/** 默认精简工具栏（对齐 Argon react-quill 用法） */
export const defaultToolbar = [
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image", "code-block"],
  [{ header: [1, 2, 3, false] }],
  ["clean"],
];

export interface RichTextProps {
  modelValue?: string;
  placeholder?: string;
  toolbar?: unknown[][];
  readonly?: boolean;
  /** 编辑区高度（不含工具栏） */
  height?: number;
  onChange?: (html: string) => void;
}
