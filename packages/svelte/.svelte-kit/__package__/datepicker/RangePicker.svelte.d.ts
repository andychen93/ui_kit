type $$ComponentProps = {
    value?: [string, string] | null;
    placeholder?: string;
    disabled?: boolean;
    status?: "error" | "success";
};
declare const RangePicker: import("svelte").Component<$$ComponentProps, {}, "value">;
type RangePicker = ReturnType<typeof RangePicker>;
export default RangePicker;
