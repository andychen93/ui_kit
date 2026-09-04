import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PageSelect, createPageSelect } from '../src/components/page-select';

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
    name: `Item ${offset + i + 1}`,
  }));
}

describe('PageSelect Component', () => {
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

  function getInput(ps: PageSelect): HTMLInputElement {
    return ps.getElement().querySelector('input.ag-input') as HTMLInputElement;
  }

  function getRows(ps: PageSelect): HTMLTableRowElement[] {
    return Array.from(
      ps.getElement().querySelectorAll('.ag-page-select-row')
    ) as HTMLTableRowElement[];
  }

  function getState(ps: PageSelect, kind: 'loading' | 'error' | 'empty'): Element | null {
    return ps.getElement().querySelector(`.ag-page-select-state--${kind}`);
  }

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const service = vi.fn().mockResolvedValue({ list: [], total: 0 });
      const ps = new PageSelect(rootEl, { service, labelField: 'name' });
      expect(ps.getElement()).toBe(rootEl);
    });

    it('should initialize with a selector string', () => {
      rootEl.id = 'test-page-select';
      const service = vi.fn().mockResolvedValue({ list: [], total: 0 });
      const ps = new PageSelect('#test-page-select', { service, labelField: 'name' });
      expect(ps.getElement()).toBe(rootEl);
    });

    it('should throw for a selector that does not exist', () => {
      const service = vi.fn().mockResolvedValue({ list: [], total: 0 });
      expect(() => new PageSelect('#missing-page-select', { service })).toThrow(
        'Element not found for selector: #missing-page-select'
      );
    });
  });

  describe('opening the panel', () => {
    it('should trigger an initial load via service on focus and show loading state first', async () => {
      let resolveFn: (v: { list: Row[]; total: number }) => void;
      const service = vi.fn(
        () => new Promise<{ list: Row[]; total: number }>((resolve) => { resolveFn = resolve; })
      );
      const ps = new PageSelect(rootEl, { service, labelField: 'name' });

      const input = getInput(ps);
      input.dispatchEvent(new Event('focus'));

      expect(service).toHaveBeenCalledTimes(1);
      expect(service).toHaveBeenCalledWith({ pageNum: 1, pageSize: 10 });
      expect(getState(ps, 'loading')?.textContent).toBe('Loading...');

      resolveFn!({ list: makeRows(3), total: 3 });
      await flush();

      expect(getState(ps, 'loading')).toBeNull();
      expect(getRows(ps).length).toBe(3);
    });

    it('should show the empty state when the resolved list is empty', async () => {
      const service = vi.fn().mockResolvedValue({ list: [], total: 0 });
      const ps = new PageSelect(rootEl, { service, labelField: 'name' });

      getInput(ps).dispatchEvent(new Event('focus'));
      await flush();

      expect(getState(ps, 'empty')?.textContent).toBe('No data');
      expect(getRows(ps).length).toBe(0);
    });

    it('should show the error state when service rejects', async () => {
      const service = vi.fn().mockRejectedValue(new Error('network down'));
      const ps = new PageSelect(rootEl, { service, labelField: 'name' });

      getInput(ps).dispatchEvent(new Event('focus'));
      await flush();

      expect(getState(ps, 'error')?.textContent).toBe('network down');
      expect(getRows(ps).length).toBe(0);
    });
  });

  describe('debounced search', () => {
    it('should only call service once with the final keyword after typing settles', async () => {
      vi.useFakeTimers();
      try {
        const service = vi.fn().mockResolvedValue({ list: makeRows(1), total: 1 });
        const ps = new PageSelect(rootEl, {
          service,
          labelField: 'name',
          searchField: 'name',
          searchDebounce: 300,
        });
        const input = getInput(ps);

        // Opening the panel issues the initial load (call #1).
        input.dispatchEvent(new Event('focus'));
        expect(service).toHaveBeenCalledTimes(1);

        input.value = 'a';
        input.dispatchEvent(new Event('input'));
        vi.advanceTimersByTime(100);
        input.value = 'ab';
        input.dispatchEvent(new Event('input'));
        vi.advanceTimersByTime(100);
        input.value = 'abc';
        input.dispatchEvent(new Event('input'));

        // Debounce not yet elapsed since last keystroke.
        vi.advanceTimersByTime(299);
        expect(service).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1);
        expect(service).toHaveBeenCalledTimes(2);
        expect(service).toHaveBeenLastCalledWith({
          pageNum: 1,
          pageSize: 10,
          keyword: 'abc',
        });
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('selecting a row', () => {
    it('should select the full record, call onChange with it, and show its label in the input', async () => {
      const rows = makeRows(2);
      const service = vi.fn().mockResolvedValue({ list: rows, total: 2 });
      const onChange = vi.fn();
      const ps = new PageSelect(rootEl, { service, labelField: 'name', onChange });

      getInput(ps).dispatchEvent(new Event('focus'));
      await flush();

      const rowEls = getRows(ps);
      rowEls[1].dispatchEvent(new Event('click', { bubbles: true }));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(rows[1]);
      expect(getInput(ps).value).toBe('Item 2');
      expect(ps.getValue()).toEqual(rows[1]);
      expect(ps.isOpen()).toBe(false);
    });
  });

  describe('pagination', () => {
    it('should re-issue service with the next pageNum when Next is clicked', async () => {
      const page1 = makeRows(10, 0);
      const page2 = makeRows(5, 10);
      const service = vi
        .fn()
        .mockResolvedValueOnce({ list: page1, total: 15 })
        .mockResolvedValueOnce({ list: page2, total: 15 });
      const ps = new PageSelect(rootEl, { service, labelField: 'name', pageSize: 10 });

      getInput(ps).dispatchEvent(new Event('focus'));
      await flush();

      const nextBtn = Array.from(ps.getElement().querySelectorAll('button')).find(
        (b) => b.textContent === 'Next'
      ) as HTMLButtonElement;
      expect(nextBtn.disabled).toBe(false);

      nextBtn.click();
      await flush();

      expect(service).toHaveBeenCalledTimes(2);
      expect(service).toHaveBeenLastCalledWith({ pageNum: 2, pageSize: 10 });
      expect(getRows(ps).length).toBe(5);
      expect(getRows(ps)[0].textContent).toContain('Item 11');
    });

    it('should re-issue service with the previous pageNum when Previous is clicked', async () => {
      const page1 = makeRows(10, 0);
      const page2 = makeRows(5, 10);
      const service = vi
        .fn()
        .mockResolvedValueOnce({ list: page1, total: 15 })
        .mockResolvedValueOnce({ list: page2, total: 15 })
        .mockResolvedValueOnce({ list: page1, total: 15 });
      const ps = new PageSelect(rootEl, { service, labelField: 'name', pageSize: 10 });

      getInput(ps).dispatchEvent(new Event('focus'));
      await flush();

      const findBtn = (label: string) =>
        Array.from(ps.getElement().querySelectorAll('button')).find(
          (b) => b.textContent === label
        ) as HTMLButtonElement;

      findBtn('Next').click();
      await flush();

      const prevBtn = findBtn('Previous');
      expect(prevBtn.disabled).toBe(false);
      prevBtn.click();
      await flush();

      expect(service).toHaveBeenCalledTimes(3);
      expect(service).toHaveBeenLastCalledWith({ pageNum: 1, pageSize: 10 });
      expect(getRows(ps).length).toBe(10);
    });
  });

  describe('allowClear', () => {
    it('should show the clear button once a value is selected and hide it initially', async () => {
      const rows = makeRows(1);
      const service = vi.fn().mockResolvedValue({ list: rows, total: 1 });
      const ps = new PageSelect(rootEl, { service, labelField: 'name', allowClear: true });

      const clearBtn = ps.getElement().querySelector(
        '.ag-page-select-clear'
      ) as HTMLButtonElement;
      expect(clearBtn.style.display).toBe('none');

      getInput(ps).dispatchEvent(new Event('focus'));
      await flush();
      getRows(ps)[0].dispatchEvent(new Event('click', { bubbles: true }));

      expect(clearBtn.style.display).toBe('inline');
    });

    it('should call onChange(null) and clear the input when the clear button is clicked', async () => {
      const rows = makeRows(1);
      const service = vi.fn().mockResolvedValue({ list: rows, total: 1 });
      const onChange = vi.fn();
      const ps = new PageSelect(rootEl, {
        service,
        labelField: 'name',
        allowClear: true,
        onChange,
      });

      getInput(ps).dispatchEvent(new Event('focus'));
      await flush();
      getRows(ps)[0].dispatchEvent(new Event('click', { bubbles: true }));
      onChange.mockClear();

      const clearBtn = ps.getElement().querySelector(
        '.ag-page-select-clear'
      ) as HTMLButtonElement;
      clearBtn.dispatchEvent(new Event('click', { bubbles: true }));

      expect(onChange).toHaveBeenCalledWith(null);
      expect(ps.getValue()).toBeNull();
      expect(getInput(ps).value).toBe('');
      expect(clearBtn.style.display).toBe('none');
    });
  });

  describe('destroy', () => {
    it('should cancel a pending debounce timer so the scheduled search never fires', async () => {
      vi.useFakeTimers();
      try {
        const service = vi.fn().mockResolvedValue({ list: [], total: 0 });
        const ps = new PageSelect(rootEl, { service, labelField: 'name', searchField: 'name' });

        const input = getInput(ps);
        input.dispatchEvent(new Event('focus'));
        expect(service).toHaveBeenCalledTimes(1);

        input.value = 'query';
        input.dispatchEvent(new Event('input'));

        ps.destroy();
        vi.advanceTimersByTime(1000);

        // Debounced search never fired after destroy.
        expect(service).toHaveBeenCalledTimes(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should remove the input, clear button, and panel from the DOM', () => {
      const service = vi.fn().mockResolvedValue({ list: [], total: 0 });
      const ps = new PageSelect(rootEl, { service, labelField: 'name', allowClear: true });

      ps.destroy();

      expect(rootEl.querySelector('input.ag-input')).toBeNull();
      expect(rootEl.querySelector('.ag-page-select-clear')).toBeNull();
      expect(rootEl.querySelector('.ag-page-select-panel')).toBeNull();
    });
  });

  describe('createPageSelect', () => {
    it('should create a page-select from scratch wired to the given service', async () => {
      const rows = makeRows(2);
      const service = vi.fn().mockResolvedValue({ list: rows, total: 2 });
      const ps = createPageSelect({ service, labelField: 'name' });

      expect(ps.getElement().className).toContain('ag-page-select');

      document.body.appendChild(ps.getElement());
      const input = ps.getElement().querySelector('input.ag-input') as HTMLInputElement;
      input.dispatchEvent(new Event('focus'));
      await flush();

      expect(service).toHaveBeenCalledWith({ pageNum: 1, pageSize: 10 });
      expect(ps.getElement().querySelectorAll('.ag-page-select-row').length).toBe(2);
      ps.getElement().remove();
    });
  });
});
