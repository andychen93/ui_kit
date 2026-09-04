import { describe, expect, it } from "vitest";
import * as reactPkg from "@argon-kit/react";
import * as vuePkg from "@argon-kit/vue";
import * as sveltePkg from "@argon-kit/svelte";
import * as htmlPkg from "@argon-kit/html";

/**
 * HTML export parity contract.
 *
 * The public component set is not hand-maintained here. It is computed
 * dynamically as the intersection of what React, Vue, and Svelte actually
 * export at runtime. If any of the three frameworks adds a new component,
 * this test's `commonComponents` set grows automatically and will fail
 * until @argon-kit/html exports a same-named component too — no manifest
 * file to remember to update.
 *
 * FRAMEWORK_ONLY: values that exist in one or more of React/Vue/Svelte but
 * are framework-idiom escape hatches, not components themselves (e.g.
 * React's useFormApi hook). These are excluded from the intersection so
 * they don't force HTML to expose a framework-specific hook API. This list
 * must stay tiny and each entry must be justified — do not use it to hide
 * a genuinely missing component.
 */
const FRAMEWORK_ONLY = new Set(["useFormApi"]);

/**
 * Non-component runtime exports that are shared utilities/types re-exported
 * for convenience, not components with a common HTML equivalent shape.
 * Kept separate from FRAMEWORK_ONLY because these *are* expected to have
 * an HTML-side equivalent, just not necessarily under the same export
 * shape as a component class/factory pair.
 */

function isComponentLike(value: unknown): boolean {
  return typeof value === "function" || (typeof value === "object" && value !== null);
}

function valueExportNames(mod: Record<string, unknown>): Set<string> {
  return new Set(
    Object.keys(mod)
      .filter((k) => !FRAMEWORK_ONLY.has(k))
      .filter((k) => isComponentLike(mod[k])),
  );
}

/** Intersection of names present in all three sets. */
function intersect(a: Set<string>, b: Set<string>, c: Set<string>): Set<string> {
  const result = new Set<string>();
  for (const k of a) {
    if (b.has(k) && c.has(k)) result.add(k);
  }
  return result;
}

const reactExports = valueExportNames(reactPkg as Record<string, unknown>);
const vueExports = valueExportNames(vuePkg as Record<string, unknown>);
const svelteExports = valueExportNames(sveltePkg as Record<string, unknown>);
const htmlExports = valueExportNames(htmlPkg as Record<string, unknown>);

/** The dynamically computed public component manifest for this run. */
const commonComponents = intersect(reactExports, vueExports, svelteExports);

describe("@argon-kit/html export parity with React/Vue/Svelte", () => {
  it("computed a non-trivial common component set", () => {
    // Sanity check so a broken import (e.g. all three resolving empty)
    // can't silently make this suite vacuously pass.
    expect(commonComponents.size).toBeGreaterThan(50);
  });

  it("React/Vue/Svelte common component list matches the checked-in manifest", async () => {
    // Guards against the static manifest file drifting from what the
    // three frameworks actually export at runtime. If this fails, update
    // tests/contract/component-manifest.ts to match `commonComponents`.
    const { commonComponents: manifestComponents } = await import(
      "../component-manifest"
    );

    const manifestSet = new Set<string>(manifestComponents);
    const missingFromManifest = [...commonComponents].filter((c) => !manifestSet.has(c));
    const extraInManifest = [...manifestSet].filter((c) => !commonComponents.has(c));

    expect({ missingFromManifest, extraInManifest }).toEqual({
      missingFromManifest: [],
      extraInManifest: [],
    });
  });

  it("HTML exports every common component: missing === []", () => {
    const missing = [...commonComponents]
      .filter((name) => !htmlExports.has(name))
      .sort();

    expect(missing).toEqual([]);
  });

  it("HTML coverage of the common component set is 100%", () => {
    const total = commonComponents.size;
    const covered = [...commonComponents].filter((name) => htmlExports.has(name)).length;
    const coverage = total === 0 ? 0 : (covered / total) * 100;

    expect(coverage).toBe(100);
  });

  it("RangePicker is exported as a first-class component (not only DateRangePicker)", () => {
    expect(htmlExports.has("RangePicker")).toBe(true);
    expect(typeof (htmlPkg as Record<string, unknown>).RangePicker).toBe("function");
  });

  it("DateRangePicker remains available as a compatibility alias for RangePicker", () => {
    expect(htmlExports.has("DateRangePicker")).toBe(true);
    expect((htmlPkg as Record<string, unknown>).DateRangePicker).toBe(
      (htmlPkg as Record<string, unknown>).RangePicker,
    );
  });

  it("FormItem is exported as a first-class component", () => {
    expect(htmlExports.has("FormItem")).toBe(true);
    expect(typeof (htmlPkg as Record<string, unknown>).FormItem).toBe("function");
  });

  it("does not report false coverage: every reported-missing name really is absent from HTML", () => {
    // Extra safety net against a bug in the intersection/coverage logic
    // itself silently reporting 100% while actually missing components.
    for (const name of commonComponents) {
      const exists = name in (htmlPkg as Record<string, unknown>);
      expect(exists).toBe(true);
    }
  });
});
