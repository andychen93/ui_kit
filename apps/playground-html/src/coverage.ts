/**
 * Component coverage panel.
 *
 * The component list and coverage percentage are NOT hand-typed here.
 * `commonComponents` is imported from the same manifest file that
 * `tests/contract/src/html-exports-parity.test.ts` uses, and that test
 * asserts the manifest matches the *dynamically computed* intersection of
 * React/Vue/Svelte's actual runtime exports (see that file for the live
 * computation). This panel then checks the real `@argon-kit/html` runtime
 * exports against the manifest, so a regression here means either:
 *  - a real missing HTML export (bug), or
 *  - the manifest is stale (contract test will fail first, in CI).
 */

import { commonComponents } from '../../../tests/contract/component-manifest';
import * as htmlPkg from '@argon-kit/html';

export interface CoverageResult {
  total: number;
  covered: number;
  missing: string[];
  coveragePercent: number;
}

function computeCoverage(): CoverageResult {
  const exportsRecord = htmlPkg as unknown as Record<string, unknown>;
  const missing = commonComponents.filter((name) => !(name in exportsRecord));
  const total = commonComponents.length;
  const covered = total - missing.length;

  return {
    total,
    covered,
    missing: [...missing],
    coveragePercent: total === 0 ? 0 : Math.round((covered / total) * 1000) / 10,
  };
}

/**
 * Render the coverage banner into `container`. Call once on page load.
 */
export function renderCoveragePanel(container: HTMLElement): void {
  const result = computeCoverage();
  const isFullCoverage = result.missing.length === 0;

  container.className = isFullCoverage
    ? 'ag-coverage-panel ag-coverage-panel--ok'
    : 'ag-coverage-panel ag-coverage-panel--warning';

  const heading = document.createElement('div');
  heading.className = 'ag-coverage-panel__heading';
  heading.textContent = isFullCoverage
    ? `Component coverage: ${result.coveragePercent}% (${result.covered}/${result.total})`
    : `Component coverage: ${result.coveragePercent}% (${result.covered}/${result.total}) — missing ${result.missing.length}`;
  container.appendChild(heading);

  if (!isFullCoverage) {
    const list = document.createElement('div');
    list.className = 'ag-coverage-panel__missing';
    list.textContent = `Missing: ${result.missing.join(', ')}`;
    container.appendChild(list);
  }

  // Surface the real numbers in the console too, for anyone checking
  // via devtools rather than reading the page.
  if (isFullCoverage) {
    console.log(
      `[coverage] @argon-kit/html exports ${result.covered}/${result.total} common components (100%).`
    );
  } else {
    console.warn(
      `[coverage] @argon-kit/html is missing ${result.missing.length} common component(s): ${result.missing.join(', ')}`
    );
  }
}
