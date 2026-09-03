type $$ComponentProps = {
    id: string | number;
    status: number;
    disabled?: boolean;
    confirmTitle?: (nextEnabled: boolean) => string;
    ontoggle?: (id: string | number, checked: boolean) => void;
};
declare const StatusSwitch: import("svelte").Component<$$ComponentProps, {}, "">;
type StatusSwitch = ReturnType<typeof StatusSwitch>;
export default StatusSwitch;
