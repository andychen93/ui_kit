import { Plus } from "lucide-react";
import { Button, type ButtonVariant } from "@argon-kit/react";

const solids: ButtonVariant[] = [
  "primary",
  "info",
  "success",
  "warning",
  "danger",
  "default",
];
const gradients: ButtonVariant[] = [
  "gradient-primary",
  "gradient-info",
  "gradient-success",
  "gradient-warning",
  "gradient-danger",
  "gradient-default",
];

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2
        style={{
          color: "var(--ag-heading)",
          fontSize: 20,
          margin: "0 0 12px",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{children}</div>
    </section>
  );
}

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 32 }}>
      <p style={{ color: "var(--ag-gray-600)", fontSize: 13, margin: 0 }}>
        React playground
      </p>
      <h1 style={{ color: "var(--ag-heading)", fontSize: 20, margin: "4px 0 32px" }}>
        Argon Button
      </h1>

      <Row title="实心">
        {solids.map((v) => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ))}
      </Row>

      <Row title="渐变">
        {gradients.map((v) => (
          <Button key={v} variant={v}>
            {v.replace("gradient-", "")}
          </Button>
        ))}
      </Row>

      <Row title="中性 / 描边 / 链接 / 禁用 / 加载">
        <Button variant="neutral">Neutral</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="link">Link</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </Row>

      <Row title="尺寸与图标">
        <Button size="sm" icon={<Plus size={16} />}>
          Small
        </Button>
        <Button icon={<Plus size={16} />}>Default</Button>
        <Button size="lg" icon={<Plus size={16} />}>
          Large
        </Button>
        <Button iconOnly icon={<Plus size={16} />} aria-label="add" />
      </Row>

      <Row title="社交登录">
        <Button variant="social-github">GitHub</Button>
        <Button variant="social-google">Google</Button>
        <Button variant="social-wechat">微信</Button>
        <Button variant="social-github" iconOnly aria-label="GitHub" />
      </Row>
    </div>
  );
}
