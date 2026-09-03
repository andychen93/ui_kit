import { useState } from "react";
import type { TagsInputProps } from "../../core/types";

export function TagsInput({
  value = [],
  placeholder = "输入后回车添加",
  maxTags = Infinity,
  onlyUnique = false,
  disabled = false,
  onChange,
}: TagsInputProps) {
  const [input, setInput] = useState("");

  const canAdd =
    !disabled &&
    input.trim().length > 0 &&
    value.length < maxTags &&
    (!onlyUnique || !value.includes(input.trim()));

  const commit = () => {
    if (!canAdd) {
      setInput("");
      return;
    }
    const next = [...value, input.trim()];
    onChange?.(next);
    setInput("");
  };

  const remove = (tag: string) => {
    if (disabled) return;
    onChange?.(value.filter((t) => t !== tag));
  };

  const onKeydown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && input === "" && value.length) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div className={disabled ? "ag-tags is-disabled" : "ag-tags"}>
      {value.map((tag) => (
        <span key={tag} className="ag-tags__tag">
          {tag}
          {!disabled ? (
            <button
              type="button"
              className="ag-tags__remove"
              aria-label="remove"
              onClick={() => remove(tag)}
            >
              ×
            </button>
          ) : null}
        </span>
      ))}
      <input
        className="ag-tags__input"
        placeholder={value.length ? "" : placeholder}
        disabled={disabled}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeydown}
        onBlur={commit}
      />
    </div>
  );
}
