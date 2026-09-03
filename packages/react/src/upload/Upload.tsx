import { useRef } from "react";
import { Button } from "../button/Button";

export interface UploadProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  files?: File[];
  onChange?: (files: File[]) => void;
  buttonText?: string;
}

export function Upload({
  accept,
  multiple,
  disabled,
  files = [],
  onChange,
  buttonText = "选择文件",
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="ag-upload">
      <input
        ref={inputRef}
        className="ag-upload__input"
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => onChange?.(Array.from(e.target.files ?? []))}
      />
      <Button
        variant="neutral"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {buttonText}
      </Button>
      {files.length > 0 ? (
        <ul className="ag-upload__list">
          {files.map((f) => (
            <li key={f.name + f.size} className="ag-upload__item">
              {f.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
