import type { Snippet } from "svelte";
type $$ComponentProps = {
    open?: boolean;
    title?: string;
    /** 弹窗宽度 px */
    width?: number;
    /** 确认按钮 loading（防重复提交） */
    confirmLoading?: boolean;
    /** 隐藏底部（纯展示弹窗） */
    hideFooter?: boolean;
    onclose?: () => void;
    onconfirm?: () => void;
    children?: Snippet;
    footer?: Snippet;
};
declare const Modal: import("svelte").Component<$$ComponentProps, {}, "">;
type Modal = ReturnType<typeof Modal>;
export default Modal;
