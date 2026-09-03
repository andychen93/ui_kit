type $$ComponentProps = {
    percent?: number;
    variant?: "primary" | "info" | "success" | "warning" | "danger" | "gradient-primary" | "gradient-info" | "gradient-success" | "gradient-warning" | "gradient-danger";
    thin?: boolean;
    striped?: boolean;
    showLabel?: boolean;
};
declare const Progress: import("svelte").Component<$$ComponentProps, {}, "">;
type Progress = ReturnType<typeof Progress>;
export default Progress;
