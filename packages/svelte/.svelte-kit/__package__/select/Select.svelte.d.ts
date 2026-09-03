import type { FieldStatus } from "../input/types";
export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}
type $$ComponentProps = {
    value?: string | number | null;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    status?: FieldStatus;
    hint?: string;
};
declare const Select: import("svelte").Component<$$ComponentProps, {}, "value">;
type Select = ReturnType<typeof Select>;
export default Select;
