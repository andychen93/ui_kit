import type { Snippet } from "svelte";
import type { ResultStatus } from "@argon-kit/core";
type $$ComponentProps = {
    status?: ResultStatus;
    title?: string;
    subTitle?: string;
    extra?: Snippet;
};
declare const Result: import("svelte").Component<$$ComponentProps, {}, "">;
type Result = ReturnType<typeof Result>;
export default Result;
