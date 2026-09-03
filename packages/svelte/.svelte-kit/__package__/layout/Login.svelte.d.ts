import type { Snippet } from "svelte";
export interface LoginValues {
    username: string;
    password: string;
    tenantCode?: string;
}
type $$ComponentProps = {
    title?: string;
    subtitle?: string;
    logo?: string;
    loading?: boolean;
    showTenant?: boolean;
    tenantOptions?: {
        label: string;
        value: string | number;
    }[];
    hint?: string;
    captcha?: Snippet;
    embed?: boolean;
    onsubmit?: (values: LoginValues) => void;
};
declare const Login: import("svelte").Component<$$ComponentProps, {}, "">;
type Login = ReturnType<typeof Login>;
export default Login;
