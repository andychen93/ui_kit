import { useState } from "react";
import { Glyph } from "../glyph/Glyph";
import { Input } from "./Input";
import type { InputProps } from "./types";

export function Password({ suffix, ...rest }: InputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...rest}
      type={visible ? "text" : "password"}
      suffix={
        suffix ?? (
          <button
            type="button"
            className="ag-input__addon-btn"
            aria-label={visible ? "隐藏密码" : "显示密码"}
            onClick={() => setVisible((v) => !v)}
          >
            <Glyph name={visible ? "eyeOff" : "eye"} />
          </button>
        )
      }
    />
  );
}
