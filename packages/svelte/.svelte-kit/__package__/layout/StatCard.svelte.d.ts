import type { StatVariant } from "@argon-kit/core";
type $$ComponentProps = {
    variant?: StatVariant;
    label: string;
    value?: string | number;
    progress?: number;
    hint?: string;
};
declare const StatCard: import("svelte").Component<$$ComponentProps, {}, "">;
type StatCard = ReturnType<typeof StatCard>;
export default StatCard;
