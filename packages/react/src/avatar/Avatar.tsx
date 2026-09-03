import type { ReactNode } from "react";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  square?: boolean;
  children?: ReactNode;
}

export function Avatar({
  src,
  alt,
  size = "md",
  square = false,
  children,
}: AvatarProps) {
  const className = [
    "ag-avatar",
    size !== "md" ? `ag-avatar--${size}` : "",
    square ? "ag-avatar--square" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={className}>
      {src ? <img src={src} alt={alt ?? ""} /> : children}
    </span>
  );
}

export interface AvatarGroupProps {
  children?: ReactNode;
}

export function AvatarGroup({ children }: AvatarGroupProps) {
  return <span className="ag-avatar-group">{children}</span>;
}
