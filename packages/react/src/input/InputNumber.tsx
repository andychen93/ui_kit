import type { InputProps } from "./types";
import { Input } from "./Input";

export function InputNumber(props: Omit<InputProps, "type">) {
  return <Input type="number" {...props} />;
}
