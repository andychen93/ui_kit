type $$ComponentProps = {
    value?: string | null;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    status?: "error" | "success";
};
declare const DatePicker: import("svelte").Component<$$ComponentProps, {}, "value">;
type DatePicker = ReturnType<typeof DatePicker>;
export default DatePicker;
