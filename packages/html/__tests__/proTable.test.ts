import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProTable, createProTable } from '../src/components/pro-table';
import type { TableColumn, ProTableRequestResult } from '../src/components/pro-table';

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

interface Row {
  id: number;
  name: string;
}

function makeRows(count: number, offset = 0): Row[] {
  return Array.from({ length: count }, (_, i) => ({
    id: offset + i + 1,
    name: `Row ${offset + i + 1}`,
  }));
}

describe('ProTable Component', () => {
  let container: HTMLDivElement;
  let rootEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    rootEl = document.createElement('div');
    container.appendChild(rootEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const columns: TableColumn[] = [
    { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
    { key: 'name', title: 'Name', dataIndex: 'name' },
  ];

  function getRows(pt: ProTable): HTMLTableRowElement[] {
    return Array.from(
      pt.getElement().querySelectorAll('.ag-table-row')
    ) as HTMLTableRowElement[];
  }

  function getHeader(pt: ProTable, key: string): HTMLElement {
    const idx = columns.findIndex((c) => c.key === key);
    const ths = pt.getElement().querySelectorAll('thead th');
    return ths[idx] as HTMLElement;
  }

  function getPageButton(pt: ProTable, label: string): HTMLButtonElement {
    return Array.from(pt.getElement().querySelectorAll('.ag-pro-table-footer button')).find(
      (b) => b.textContent === label
    ) as HTMLButtonElement;
  }

  describe('constructor with request', () => {
    it('should call request on construction with page 1 and render the returned data', async () => {
      const rows = makeRows(3);
      const request = vi.fn().mockResolvedValue({ data: rows, total: 3 });
      const pt = new ProTable(rootEl, { columns, request });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        expect.objectContaining({ current: 1, pageSize: 10 })
      );

      await flush();

      expect(getRows(pt).length).toBe(3);
      expect(getRows(pt)[0].textContent).toContain('Row 1');
    });

    it('should throw for a selector that does not exist', () => {
      expect(() => new ProTable('#missing-pro-table')).toThrow(
        'Element not found for selector: #missing-pro-table'
      );
    });
  });

  describe('sorting', () => {
    it('should cycle asc -> desc -> unsorted on repeated clicks and call onSortChange each time', async () => {
      const rows = makeRows(2);
      const request = vi.fn().mockResolvedValue({ data: rows, total: 2 });
      const onSortChange = vi.fn();
      const pt = new ProTable(rootEl, { columns, request, onSortChange });
      await flush();

      const th = getHeader(pt, 'id');

      th.dispatchEvent(new Event('click', { bubbles: true }));
      expect(onSortChange).toHaveBeenLastCalledWith('id', 'asc');
      await flush();
      expect(request).toHaveBeenLastCalledWith(
        expect.objectContaining({ sortKey: 'id', sortOrder: 'asc' })
      );

      th.dispatchEvent(new Event('click', { bubbles: true }));
      expect(onSortChange).toHaveBeenLastCalledWith('id', 'desc');
      await flush();
      expect(request).toHaveBeenLastCalledWith(
        expect.objectContaining({ sortKey: 'id', sortOrder: 'desc' })
      );

      th.dispatchEvent(new Event('click', { bubbles: true }));
      expect(onSortChange).toHaveBeenLastCalledWith(null, null);
      await flush();
      expect(request).toHaveBeenLastCalledWith(
        expect.objectContaining({ sortKey: null, sortOrder: null })
      );

      expect(request).toHaveBeenCalledTimes(4); // initial + 3 sort clicks
    });

    it('should not attach a click handler for non-sortable columns', async () => {
      const rows = makeRows(1);
      const request = vi.fn().mockResolvedValue({ data: rows, total: 1 });
      const onSortChange = vi.fn();
      const pt = new ProTable(rootEl, { columns, request, onSortChange });
      await flush();

      const th = getHeader(pt, 'name');
      th.dispatchEvent(new Event('click', { bubbles: true }));

      expect(onSortChange).not.toHaveBeenCalled();
    });
  });

  describe('pagination', () => {
    it('should re-issue request with the new current page and re-render on page button click', async () => {
      const page1 = makeRows(10, 0);
      const page2 = makeRows(5, 10);
      const request = vi
        .fn()
        .mockResolvedValueOnce({ data: page1, total: 15 })
        .mockResolvedValueOnce({ data: page2, total: 15 });
      const onPaginationChange = vi.fn();
      const pt = new ProTable(rootEl, {
        columns,
        request,
        onPaginationChange,
        pagination: { pageSize: 10 },
      });
      await flush();

      const page2Btn = getPageButton(pt, '2');
      page2Btn.click();
      await flush();

      expect(onPaginationChange).toHaveBeenCalledWith(2, 10);
      expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ current: 2 }));
      expect(getRows(pt).length).toBe(5);
      expect(getRows(pt)[0].textContent).toContain('Row 11');
    });
  });

  describe('loading / error / empty states', () => {
    it('should show the loading state while the request is pending', () => {
      let resolveFn: (v: ProTableRequestResult) => void;
      const request = vi.fn(() => new Promise<ProTableRequestResult>((resolve) => { resolveFn = resolve; }));
      const pt = new ProTable(rootEl, { columns, request });

      expect(pt.isLoading()).toBe(true);
      const state = pt.getElement().querySelector('.ag-pro-table-state--loading');
      expect(state?.textContent).toBe('Loading...');

      resolveFn!({ data: [], total: 0 });
    });

    it('should show the error state and clear data when the request rejects', async () => {
      const request = vi.fn().mockRejectedValue(new Error('boom'));
      const pt = new ProTable(rootEl, { columns, request });

      await flush();

      expect(pt.getError()).toBe('boom');
      const state = pt.getElement().querySelector('.ag-pro-table-state--error');
      expect(state?.textContent).toBe('boom');
      expect(getRows(pt).length).toBe(0);
    });

    it('should show the empty state when the request resolves with no data', async () => {
      const request = vi.fn().mockResolvedValue({ data: [], total: 0 });
      const pt = new ProTable(rootEl, { columns, request, emptyText: 'Nothing here' });

      await flush();

      const empty = pt.getElement().querySelector('.ag-table-empty');
      expect(empty?.textContent).toBe('Nothing here');
      expect(getRows(pt).length).toBe(0);
    });
  });

  describe('reload / search', () => {
    it('reload() should re-issue the request with the same page by default', async () => {
      const request = vi.fn().mockResolvedValue({ data: makeRows(1), total: 1 });
      const pt = new ProTable(rootEl, { columns, request, pagination: { current: 2 } });
      await flush();
      request.mockClear();

      pt.reload();
      await flush();

      expect(request).toHaveBeenCalledWith(expect.objectContaining({ current: 2 }));
    });

    it('reload(true) should reset to page 1', async () => {
      const request = vi.fn().mockResolvedValue({ data: makeRows(1), total: 1 });
      const pt = new ProTable(rootEl, { columns, request, pagination: { current: 3 } });
      await flush();
      request.mockClear();

      pt.reload(true);
      await flush();

      expect(request).toHaveBeenCalledWith(expect.objectContaining({ current: 1 }));
    });

    it('search(params) should merge extra params, reset to page 1, and reload', async () => {
      const request = vi.fn().mockResolvedValue({ data: makeRows(1), total: 1 });
      const pt = new ProTable(rootEl, { columns, request, pagination: { current: 3 } });
      await flush();
      request.mockClear();

      pt.search({ keyword: 'foo' });
      await flush();

      expect(request).toHaveBeenCalledWith(
        expect.objectContaining({ current: 1, keyword: 'foo' })
      );
    });

    it('search() params should persist across a subsequent reload()', async () => {
      const request = vi.fn().mockResolvedValue({ data: makeRows(1), total: 1 });
      const pt = new ProTable(rootEl, { columns, request });
      await flush();

      await pt.search({ keyword: 'bar' });
      request.mockClear();

      pt.reload();
      await flush();

      expect(request).toHaveBeenCalledWith(expect.objectContaining({ keyword: 'bar' }));
    });
  });

  describe('destroy', () => {
    it('should prevent a stale in-flight response from applying after destroy', async () => {
      let resolveFn: (v: ProTableRequestResult) => void;
      const request = vi.fn(() => new Promise<ProTableRequestResult>((resolve) => { resolveFn = resolve; }));
      const pt = new ProTable(rootEl, { columns, request });

      // Request is in flight (loading state rendered, promise unresolved).
      expect(pt.isLoading()).toBe(true);

      pt.destroy();

      // Now let the stale response resolve.
      resolveFn!({ data: makeRows(5), total: 5 });
      await flush();

      // Data must not have been applied post-destroy.
      expect(getRows(pt).length).toBe(0);
      expect(pt.isLoading()).toBe(true); // loading flag frozen at time of destroy, never updated
    });

    it('should remove the rendered table and pagination controls from the DOM', async () => {
      const request = vi.fn().mockResolvedValue({ data: makeRows(2), total: 2 });
      const pt = new ProTable(rootEl, { columns, request });
      await flush();

      expect(getRows(pt).length).toBe(2);

      pt.destroy();

      expect(pt.getElement().querySelectorAll('.ag-table-row').length).toBe(0);
      expect(pt.getElement().querySelector('.ag-pagination')).toBeNull();
    });
  });

  describe('createProTable', () => {
    it('should create a pro-table from scratch wired to the given request', async () => {
      const rows = makeRows(2);
      const request = vi.fn().mockResolvedValue({ data: rows, total: 2 });
      const pt = createProTable({ columns, request });

      expect(pt.getElement().className).toContain('ag-pro-table');

      await flush();

      expect(pt.getElement().querySelectorAll('.ag-table-row').length).toBe(2);
    });
  });
});
