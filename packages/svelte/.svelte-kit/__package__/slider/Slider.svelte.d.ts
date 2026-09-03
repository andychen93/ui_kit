type $$ComponentProps = {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
};
declare const Slider: import("svelte").Component<$$ComponentProps, {}, "value">;
type Slider = ReturnType<typeof Slider>;
export default Slider;
