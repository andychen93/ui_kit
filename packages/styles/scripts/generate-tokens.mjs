/**
 * 从 src/tokens.ts 生成 tokens.css 的调色段（:root 变量）。
 * 用法：pnpm gen:tokens（root script）。
 * 产物直接入库；tokens.css 用 BEGIN/END 标记定界，其余手工段不被动。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, "..");

const src = readFileSync(join(pkgRoot, "src/tokens.ts"), "utf8");

function extractObject(varName) {
  const re = new RegExp(`export const ${varName} = \\{([\\s\\S]*?)\\} as const`, "m");
  const m = src.match(re);
  if (!m) throw new Error(`${varName} not found in tokens.ts`);
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^\s*(?:\"([^\"]+)\"|([a-zA-Z0-9_]+)):\s*\"(#[0-9a-fA-F]+)\"/);
    if (kv) out[kv[1] ?? kv[2]] = kv[3];
  }
  return out;
}

const palette = extractObject("agPalette");
const gray = extractObject("agGray");
const semantic = extractObject("agSemantic");

const BEGIN = "/* @generated:palette:begin */";
const END = "/* @generated:palette:end */";

const lines = [
  BEGIN,
  ...Object.entries(palette).map(([k, v]) => `  --ag-${k}: ${v};`),
  `  --ag-white: ${semantic.white};`,
  `  --ag-body-bg: ${semantic.bodyBg};`,
  ...Object.entries(gray).map(([k, v]) => `  --ag-gray-${k}: ${v};`),
  `  --ag-text: var(--ag-gray-700);`,
  `  --ag-heading: var(--ag-gray-800);`,
  END,
].join("\n");

const cssPath = join(pkgRoot, "src/tokens.css");
const css = readFileSync(cssPath, "utf8");

let out;
if (css.includes(BEGIN) && css.includes(END)) {
  // 替换既有生成段
  const start = css.indexOf(BEGIN);
  const end = css.indexOf(END) + END.length;
  out = css.slice(0, start) + lines + css.slice(end);
} else {
  // 首次：插到 :root { 之后
  out = css.replace(/^:root\s*\{/m, `:root {\n${lines}\n`);
}
if (!out.includes(BEGIN)) throw new Error("生成段插入失败");

writeFileSync(cssPath, out);
console.log(`tokens.css 调色段已重新生成`);
