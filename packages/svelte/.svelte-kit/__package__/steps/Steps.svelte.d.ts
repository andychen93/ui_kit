import type { StepItem } from "@argon-kit/core";
type $$ComponentProps = {
    items: StepItem[];
    current?: number;
    direction?: "horizontal" | "vertical";
};
declare const Steps: import("svelte").Component<$$ComponentProps, {}, "">;
type Steps = ReturnType<typeof Steps>;
export default Steps;
