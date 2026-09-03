import { useEffect, useRef } from "react";
import DropzoneLib from "dropzone";
import "dropzone/dist/dropzone.css";
import { DZ_PREVIEW_TEMPLATE } from "../../core/dropzoneInner";
import type { DropzoneProps } from "../../core/types";

function UploadIcon() {
  return (
    <svg
      className="ag-dz__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 8 5-5 5 5" />
      <path d="M12 3v12" />
    </svg>
  );
}

export function Dropzone({
  url = "/",
  acceptedFiles = "image/*",
  maxFiles = 1,
  maxFilesize = 5,
  multiple = false,
  disabled = false,
  hint = "拖拽文件到此处，或点击上传",
  onAdded,
  onRemoved,
}: DropzoneProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const cbRef = useRef({ onAdded, onRemoved });
  cbRef.current = { onAdded, onRemoved };

  useEffect(() => {
    if (!elRef.current || disabled) return;
    DropzoneLib.autoDiscover = false;
    const dz = new DropzoneLib(elRef.current, {
      url,
      acceptedFiles,
      maxFiles: multiple ? maxFiles : 1,
      maxFilesize,
      addRemoveLinks: true,
      previewTemplate: DZ_PREVIEW_TEMPLATE,
      clickable: ".ag-dz__click",
      init() {
        this.on("addedfile", (file: File) => {
          const reader = new FileReader();
          reader.onload = () => {
            cbRef.current.onAdded?.({
              name: file.name,
              size: file.size,
              dataUrl: String(reader.result),
            });
          };
          reader.readAsDataURL(file);
        });
        this.on("removedfile", () => cbRef.current.onRemoved?.());
      },
    });
    return () => dz.destroy();
  }, [url, acceptedFiles, maxFiles, maxFilesize, multiple, disabled]);

  return (
    <div ref={elRef} className={disabled ? "ag-dz ag-dz--disabled" : "ag-dz"}>
      <div className="ag-dz__click">
        <div className="ag-dz__inner">
          <span className="ag-dz__icon-wrap">
            <UploadIcon />
          </span>
          <p className="ag-dz__title">{hint}</p>
          <p className="ag-dz__sub">
            单文件不超过 {maxFilesize}MB，支持{acceptedFiles === "image/*" ? "图片" : "指定类型"}格式
          </p>
        </div>
      </div>
    </div>
  );
}
