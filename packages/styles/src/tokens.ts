/**
 * Argon 设计令牌 —— 唯一权威源（single source of truth）。
 * tokens.css 的调色段由 scripts/generate-tokens.mjs 从本文件生成；
 * charts/plugins 的 JS 侧颜色也从这里 import。
 * 改色板只改这里，然后跑 `pnpm gen:tokens`。
 */

export const agPalette = {
  primary: "#5e72e4",
  info: "#11cdef",
  success: "#2dce89",
  warning: "#fb6340",
  danger: "#f5365c",
  default: "#172b4d",
} as const;

export const agGray = {
  100: "#f6f9fc",
  200: "#e9ecef",
  300: "#dee2e6",
  400: "#ced4da",
  500: "#adb5bd",
  600: "#8898aa",
  700: "#525f7f",
  800: "#32325d",
  900: "#212529",
} as const;

export const agSemantic = {
  white: "#ffffff",
  bodyBg: "#f8f9fe",
} as const;

/** hex → [r, g, b]（worldMap 色阶插值用） */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export type PaletteName = keyof typeof agPalette;
export type GrayName = keyof typeof agGray;
