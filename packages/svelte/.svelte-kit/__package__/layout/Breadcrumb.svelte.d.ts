import type { BreadcrumbItem } from "@argon-kit/core";
type $$ComponentProps = {
    items: BreadcrumbItem[];
    onnavigate?: (item: BreadcrumbItem, index: number) => void;
};
declare const Breadcrumb: import("svelte").Component<$$ComponentProps, {}, "">;
type Breadcrumb = ReturnType<typeof Breadcrumb>;
export default Breadcrumb;
