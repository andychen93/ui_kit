import type { QueryField } from "@argon-kit/core";
type $$ComponentProps = {
    fields: QueryField[];
    onsearch?: (values: Record<string, unknown>) => void;
};
declare const QueryForm: import("svelte").Component<$$ComponentProps, {}, "">;
type QueryForm = ReturnType<typeof QueryForm>;
export default QueryForm;
