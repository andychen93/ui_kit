type $$ComponentProps = {
    open?: boolean;
    type?: "success" | "error" | "warning" | "info" | "primary";
    title?: string;
    content?: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onconfirm?: () => void;
    oncancel?: () => void;
};
declare const SweetAlert: import("svelte").Component<$$ComponentProps, {}, "">;
type SweetAlert = ReturnType<typeof SweetAlert>;
export default SweetAlert;
