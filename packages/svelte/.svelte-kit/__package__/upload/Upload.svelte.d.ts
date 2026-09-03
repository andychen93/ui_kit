type $$ComponentProps = {
    files?: File[];
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    buttonText?: string;
};
declare const Upload: import("svelte").Component<$$ComponentProps, {}, "files">;
type Upload = ReturnType<typeof Upload>;
export default Upload;
