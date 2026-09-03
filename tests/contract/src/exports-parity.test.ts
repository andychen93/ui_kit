import { describe, expect, it } from "vitest";
import * as vuePkg from "@argon-kit/vue";
import * as reactPkg from "@argon-kit/react";
import * as sveltePkg from "@argon-kit/svelte";
import * as chartsVue from "@argon-kit/charts/vue";
import * as chartsReact from "@argon-kit/charts/react";
import * as chartsSvelte from "@argon-kit/charts/svelte";
import * as pluginsVue from "@argon-kit/plugins/vue";
import * as pluginsReact from "@argon-kit/plugins/react";
import * as pluginsSvelte from "@argon-kit/plugins/svelte";
import * as editorVue from "@argon-kit/editor/vue";
import * as editorReact from "@argon-kit/editor/react";
import * as editorSvelte from "@argon-kit/editor/svelte";
import * as calendarVue from "@argon-kit/calendar/vue";
import * as calendarReact from "@argon-kit/calendar/react";
import * as calendarSvelte from "@argon-kit/calendar/svelte";

/** 三框架导出名集合必须一致——这是 @argon-kit 的核心承诺。
 *  新组件落地时若某框架漏了导出，这里会立刻红。
 *  FRAMEWORK_ONLY：框架惯例差异的工具钩子（React 用 hook 取 form 实例，
 *  Vue 用 template ref、Svelte 用模块导出），不参与对齐。 */
const FRAMEWORK_ONLY = new Set(["useFormApi"]);

function valueExports(mod: Record<string, unknown>): Set<string> {
  return new Set(
    Object.keys(mod)
      .filter((k) => !FRAMEWORK_ONLY.has(k))
      .filter((k) => {
        const v = mod[k];
        return typeof v === "function" || (typeof v === "object" && v !== null);
      }),
  );
}

function expectSameExports(name: string, a: Set<string>, b: Set<string>, c: Set<string>) {
  const all = new Set([...a, ...b, ...c]);
  const diffs: string[] = [];
  for (const k of all) {
    const missing: string[] = [];
    if (!a.has(k)) missing.push("vue");
    if (!b.has(k)) missing.push("react");
    if (!c.has(k)) missing.push("svelte");
    if (missing.length) diffs.push(`  "${k}" 缺失于: ${missing.join(", ")}`);
  }
  it(`${name}: 三框架导出一致（${all.size} 个）`, () => {
    if (diffs.length) {
      throw new Error(`导出漂移：\n${diffs.join("\n")}`);
    }
    expect(a.size).toBe(all.size);
    expect(b.size).toBe(all.size);
    expect(c.size).toBe(all.size);
  });
}

describe("三框架 API 契约", () => {
  expectSameExports(
    "@argon-kit/{vue,react,svelte} 主包",
    valueExports(vuePkg),
    valueExports(reactPkg),
    valueExports(sveltePkg),
  );

  expectSameExports(
    "@argon-kit/charts",
    valueExports(chartsVue),
    valueExports(chartsReact),
    valueExports(chartsSvelte),
  );

  expectSameExports(
    "@argon-kit/plugins",
    valueExports(pluginsVue),
    valueExports(pluginsReact),
    valueExports(pluginsSvelte),
  );

  expectSameExports(
    "@argon-kit/editor",
    valueExports(editorVue),
    valueExports(editorReact),
    valueExports(editorSvelte),
  );

  expectSameExports(
    "@argon-kit/calendar",
    valueExports(calendarVue),
    valueExports(calendarReact),
    valueExports(calendarSvelte),
  );
});
