export interface ShellMenuItem {
  key: string;
  label: string;
  icon?: string;
  children?: ShellMenuItem[];
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface TransferItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export type StatVariant = "primary" | "info" | "success" | "warning" | "danger" | "default";

export type ResultStatus = "403" | "404" | "500";

export interface TimelineItem {
  content: string;
  time?: string;
  color?: "primary" | "info" | "success" | "warning" | "danger" | "gray";
}

export interface StepItem {
  title: string;
  description?: string;
}

export interface DescriptionItem {
  label: string;
  content: string;
  span?: number;
}
