/**
 * PageSelect component - a searchable, paginated single-record picker.
 *
 * Behavior parity with the common PageSelect pattern:
 * - `service(params)` is an async data source returning `{ list, total }`.
 * - Typing in the input schedules a debounced (default 300ms) search
 *   against `searchField` and reopens/refreshes the results panel.
 * - Results are paginated (`pageSize`, default 10) with Previous/Next
 *   controls; changing page re-issues `service`.
 * - Clicking a row selects the *entire record* (not just its key) and
 *   calls `onChange(record)`; the input displays `record[labelField]`.
 * - Shows loading / error / empty states inside the results panel.
 * - `allowClear` shows a clear button that calls `onChange(null)`.
 * - `destroy()` removes all listeners, timers, and DOM nodes.
 */

import * as dom from '../utils/dom';
import { pageSelectClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface PageSelectColumn {
  key: string;
  title: string;
  dataIndex?: string;
}

export interface PageSelectRequestParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
}

export interface PageSelectRequestResult<T = any> {
  list: T[];
  total: number;
}

export interface PageSelectOptions<T = any> {
  service: (params: PageSelectRequestParams) => Promise<PageSelectRequestResult<T>>;
  columns?: PageSelectColumn[];
  rowKey?: string;
  labelField?: string;
  value?: T | null;
  onChange?: (record: T | null) => void;
  placeholder?: string;
  searchField?: string;
  pageSize?: number;
  searchDebounce?: number;
  allowClear?: boolean;
  disabled?: boolean;
  className?: string;
}

export class PageSelect<T = any> {
  private element: HTMLDivElement;
  private options: PageSelectOptions<T>;
  private inputElement: HTMLInputElement;
  private clearButton: HTMLButtonElement | null = null;
  private panelElement: HTMLDivElement;
  private resultsElement: HTMLDivElement;
  private paginationElement: HTMLDivElement;
  private eventManager = new EventManager();

  private value: T | null;
  private list: T[] = [];
  private total = 0;
  private page = 1;
  private pageSize: number;
  private keyword = '';
  private loading = false;
  private error: string | null = null;
  private open = false;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private requestId = 0;

  constructor(
    element: HTMLDivElement | string,
    options: PageSelectOptions<T>
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = { ...options };
    this.value = options.value ?? null;
    this.pageSize = options.pageSize ?? 10;

    this.updateClasses();

    this.inputElement = dom.createElement('input', {
      className: 'ag-input',
      attributes: {
        type: 'text',
        placeholder: this.options.placeholder || 'Select...',
      },
    });
    this.inputElement.value = this.getLabel(this.value);
    this.element.appendChild(this.inputElement);

    if (this.options.allowClear) {
      this.clearButton = dom.createElement('button', {
        className: 'ag-page-select-clear',
        attributes: { type: 'button', 'aria-label': 'Clear' },
        textContent: '×',
      });
      this.clearButton.style.display = this.value ? 'inline' : 'none';
      this.element.appendChild(this.clearButton);
    }

    this.panelElement = dom.createElement('div', {
      className: 'ag-page-select-panel',
    });
    this.panelElement.style.display = 'none';

    this.resultsElement = dom.createElement('div', {
      className: 'ag-page-select-results',
    });
    this.panelElement.appendChild(this.resultsElement);

    this.paginationElement = dom.createElement('div', {
      className: 'ag-pagination',
    });
    this.panelElement.appendChild(this.paginationElement);

    this.element.appendChild(this.panelElement);

    this.bindEvents();

    if (this.options.disabled) {
      this.setDisabled(true);
    }
  }

  private updateClasses(): void {
    this.element.className = pageSelectClasses({
      disabled: this.options.disabled,
      error: false,
      className: this.options.className,
    });
  }

  private getLabel(record: T | null): string {
    if (!record) return '';
    const field = this.options.labelField;
    if (!field) return String(record);
    return String((record as any)[field] ?? '');
  }

  private getRowKey(record: T, index: number): string {
    const field = this.options.rowKey;
    if (!field) return String(index);
    return String((record as any)[field] ?? index);
  }

  private bindEvents(): void {
    this.eventManager.on(this.inputElement, 'focus', () => {
      if (this.options.disabled) return;
      this.openPanel();
    });

    this.eventManager.on(this.inputElement, 'input', (e: Event) => {
      const text = (e.target as HTMLInputElement).value;
      this.scheduleSearch(text);
    });

    if (this.clearButton) {
      this.eventManager.on(this.clearButton, 'click', (e: Event) => {
        e.stopPropagation();
        this.clear();
      });
    }

    this.eventManager.on(document, 'click', (e: MouseEvent) => {
      if (this.open && !this.element.contains(e.target as Node)) {
        this.closePanel();
      }
    });
  }

  private scheduleSearch(text: string): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    const delay = this.options.searchDebounce ?? 300;
    this.debounceTimer = setTimeout(() => {
      this.keyword = text;
      this.page = 1;
      this.load();
    }, delay);
  }

  /**
   * Open the results panel and load page 1.
   */
  openPanel(): void {
    this.open = true;
    this.panelElement.style.display = 'block';
    this.load();
  }

  /**
   * Close the results panel (does not clear the current selection).
   */
  closePanel(): void {
    this.open = false;
    this.panelElement.style.display = 'none';
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Whether the results panel is currently open.
   */
  isOpen(): boolean {
    return this.open;
  }

  /**
   * Load (or reload) the current page from `service`.
   */
  load(): Promise<void> {
    const requestId = ++this.requestId;
    this.loading = true;
    this.error = null;
    this.renderResults();

    const params: PageSelectRequestParams = {
      pageNum: this.page,
      pageSize: this.pageSize,
    };
    if (this.options.searchField) {
      params.keyword = this.keyword;
    }

    return this.options
      .service(params)
      .then((result) => {
        if (requestId !== this.requestId) return;
        this.loading = false;
        this.list = result.list;
        this.total = result.total;
        this.renderResults();
        this.renderPagination();
      })
      .catch((err: unknown) => {
        if (requestId !== this.requestId) return;
        this.loading = false;
        this.list = [];
        this.error = err instanceof Error ? err.message : String(err);
        this.renderResults();
        this.renderPagination();
      });
  }

  private renderResults(): void {
    this.resultsElement.innerHTML = '';

    if (this.loading) {
      this.resultsElement.appendChild(
        dom.createElement('div', {
          className: 'ag-page-select-state ag-page-select-state--loading',
          textContent: 'Loading...',
        })
      );
      return;
    }

    if (this.error) {
      this.resultsElement.appendChild(
        dom.createElement('div', {
          className: 'ag-page-select-state ag-page-select-state--error',
          textContent: this.error,
        })
      );
      return;
    }

    if (!this.list || this.list.length === 0) {
      this.resultsElement.appendChild(
        dom.createElement('div', {
          className: 'ag-page-select-state ag-page-select-state--empty',
          textContent: 'No data',
        })
      );
      return;
    }

    const table = dom.createElement('table', { className: 'ag-table' });

    if (this.options.columns && this.options.columns.length > 0) {
      const thead = dom.createElement('thead');
      const headRow = dom.createElement('tr');
      this.options.columns.forEach((col) => {
        headRow.appendChild(dom.createElement('th', { textContent: col.title }));
      });
      thead.appendChild(headRow);
      table.appendChild(thead);
    }

    const tbody = dom.createElement('tbody');
    this.list.forEach((record, index) => {
      const row = dom.createElement('tr', {
        className: 'ag-page-select-row',
      });
      row.dataset.key = this.getRowKey(record, index);

      const columns = this.options.columns || [
        { key: 'label', title: 'Label', dataIndex: this.options.labelField },
      ];

      columns.forEach((col) => {
        const value = col.dataIndex ? (record as any)[col.dataIndex] : undefined;
        row.appendChild(
          dom.createElement('td', {
            textContent: value === undefined || value === null ? '' : String(value),
          })
        );
      });

      this.eventManager.on(row, 'click', () => this.select(record));
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    this.resultsElement.appendChild(table);
  }

  private renderPagination(): void {
    this.paginationElement.innerHTML = '';
    const totalPages = Math.max(1, Math.ceil(this.total / this.pageSize));

    const prevBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default ag-btn--sm',
      textContent: 'Previous',
      attributes: {
        type: 'button',
        disabled: this.page <= 1 ? 'disabled' : undefined,
      },
    });
    this.eventManager.on(prevBtn, 'click', () => {
      if (this.page > 1) {
        this.page -= 1;
        this.load();
      }
    });
    this.paginationElement.appendChild(prevBtn);

    const info = dom.createElement('span', {
      className: 'ag-pagination-info',
      textContent: `${this.page} / ${totalPages}`,
    });
    this.paginationElement.appendChild(info);

    const nextBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default ag-btn--sm',
      textContent: 'Next',
      attributes: {
        type: 'button',
        disabled: this.page >= totalPages ? 'disabled' : undefined,
      },
    });
    this.eventManager.on(nextBtn, 'click', () => {
      if (this.page < totalPages) {
        this.page += 1;
        this.load();
      }
    });
    this.paginationElement.appendChild(nextBtn);
  }

  private select(record: T): void {
    this.value = record;
    this.inputElement.value = this.getLabel(record);
    if (this.clearButton) {
      this.clearButton.style.display = 'inline';
    }
    this.closePanel();
    this.options.onChange?.(record);
  }

  /**
   * Clear the current selection.
   */
  clear(): void {
    this.value = null;
    this.inputElement.value = '';
    this.keyword = '';
    if (this.clearButton) {
      this.clearButton.style.display = 'none';
    }
    this.closePanel();
    this.options.onChange?.(null);
  }

  /**
   * Get the currently selected record (or null).
   */
  getValue(): T | null {
    return this.value;
  }

  /**
   * Programmatically set the selected record without opening the panel.
   */
  setValue(record: T | null): void {
    this.value = record;
    this.inputElement.value = this.getLabel(record);
    if (this.clearButton) {
      this.clearButton.style.display = record ? 'inline' : 'none';
    }
  }

  /**
   * Whether a request is currently in flight.
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Last request error message, if any.
   */
  getError(): string | null {
    return this.error;
  }

  /**
   * Set disabled state.
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.inputElement.disabled = disabled;
    if (this.clearButton) {
      this.clearButton.disabled = disabled;
    }
    if (disabled) {
      this.closePanel();
    }
    this.updateClasses();
  }

  /**
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy component: cleans up listeners, pending debounce timer, and
   * removes all created DOM nodes.
   */
  destroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.requestId++; // invalidate in-flight responses
    this.eventManager.removeAll();
    this.inputElement.remove();
    this.clearButton?.remove();
    this.panelElement.remove();
  }
}

/**
 * Create page select from scratch
 */
export function createPageSelect<T = any>(options: PageSelectOptions<T>): PageSelect<T> {
  const container = dom.createElement('div', {
    className: 'ag-page-select',
  });

  const instance = new PageSelect<T>(container, options);
  return instance;
}
