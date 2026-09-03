export interface RadioOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}
type $$ComponentProps = {
    value?: string | number | null;
    options: RadioOption[];
    name?: string;
    disabled?: boolean;
};
declare const RadioGroup: import("svelte").Component<$$ComponentProps, {}, "value">;
type RadioGroup = ReturnType<typeof RadioGroup>;
export default RadioGroup;
