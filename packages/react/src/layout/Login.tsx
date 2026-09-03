import { type FormEvent, type ReactNode, useState } from "react";
import type { SelectOption } from "../select/Select";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import { Password } from "../input/Password";
import { Select } from "../select/Select";
import { Glyph } from "../glyph/Glyph";
import { Tabs } from "./Tabs";

export interface LoginValues {
  username: string;
  password: string;
  tenantCode?: string;
}

export function Login({
  title = "Argon UI Kit",
  subtitle = "欢迎回来",
  logo = "A",
  loading,
  showTenant = true,
  tenantOptions = [{ label: "默认租户", value: "" }],
  captcha,
  hint,
  embed,
  onSubmit,
}: {
  title?: string;
  subtitle?: string;
  logo?: string;
  loading?: boolean;
  showTenant?: boolean;
  tenantOptions?: SelectOption[];
  captcha?: ReactNode;
  hint?: string;
  embed?: boolean;
  onSubmit?: (values: LoginValues) => void;
}) {
  const [tab, setTab] = useState<"default" | "tenant">("default");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tenantCode, setTenantCode] = useState<string | number | null>("");

  function submit(e: FormEvent) {
    e.preventDefault();
    onSubmit?.({
      username,
      password,
      tenantCode: tab === "tenant" ? String(tenantCode ?? "") : undefined,
    });
  }

  const form = (
    <form onSubmit={submit}>
      {tab === "tenant" ? (
        <Select
          options={tenantOptions}
          value={tenantCode}
          onChange={setTenantCode}
          placeholder="选择租户"
        />
      ) : null}
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="用户名"
        prefix={<Glyph name="user" />}
        required
      />
      <Password
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="密码"
        prefix={<Glyph name="lock" />}
        required
      />
      {captcha}
      <Button type="submit" block loading={loading} style={{ marginTop: 8 }}>
        登录
      </Button>
    </form>
  );

  return (
    <div className={["ag-login", embed ? "ag-login--embed" : ""].filter(Boolean).join(" ")}>
      <div className="ag-login__card">
        <div className="ag-login__brand">
          <div className="ag-login__mark">{logo}</div>
          <h1 className="ag-login__title">{title}</h1>
          <p className="ag-login__sub">{subtitle}</p>
        </div>
        {showTenant ? (
          <Tabs
            center
            items={[
              { key: "default", label: "默认登录" },
              { key: "tenant", label: "租户登录" },
            ]}
            active={tab}
            onChange={(k) => setTab(k as "default" | "tenant")}
          >
            {form}
          </Tabs>
        ) : (
          form
        )}
        {hint ? <p className="ag-login__hint">{hint}</p> : null}
      </div>
    </div>
  );
}
