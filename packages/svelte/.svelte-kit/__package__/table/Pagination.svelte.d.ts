type $$ComponentProps = {
    current: number;
    pageSize: number;
    total: number;
    showTotal?: boolean;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    onchange?: (page: number, pageSize: number) => void;
};
declare const Pagination: import("svelte").Component<$$ComponentProps, {}, "">;
type Pagination = ReturnType<typeof Pagination>;
export default Pagination;
