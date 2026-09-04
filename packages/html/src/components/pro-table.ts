/**
 * ProTable component - A table with async data loading, search/query
 * integration, sorting, and pagination.
 *
 * Behavior parity with the common ProTable pattern found in
 * React/Vue/Svelte implementations:
 * - `request` is an async data source: `(params) => Promise<{ data, total }>`.
 * - Supports client-driven pagination (`current`/`pageSize`) that is passed
 *   back into `request`.
 * - Supports column sorting via clickable header cells when
 *   `column.sortable` is true; emits `onSortChange`.
 * - Renders loading / error / empty states.
 * - `reload()` re-runs the last request (optionally resetting to page 1).
 * - `search(params)` merges extra query params (from QueryForm) and reloads.
 *
 * Security note: cell content is rendered via `textContent`. Consumers that
 * need custom markup can supply `column.render` returning an `HTMLElement`
 * (preferred) or a string (inserted with `innerHTML` — caller is
 * responsible for sanitizing any untrusted content, see README).
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface TableColumn {
  key: string;
  title?: string;
  dataIndex?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, record: any, index: number) => string | HTMLElement;
}

export type SortOrder = 'asc' | 'desc' | null;

export interface ProTableRequestParams {
  current: number;
  pageSize: number;
  sortKey?: string | null;
  sortOrder?: SortOrder;
  [key: string]: any;
}

export interface ProTableRequestResult {
  data: any[];
  total: number;
}

export interface ProTableOptions {
  columns?: TableColumn[];
  /** Async data source. If omitted, `dataSource` is used as static data. */
  request?: (params: ProTableRequestParams) => Promise<ProTableRequestResult>;
  dataSource?: any[];
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  emptyText?: string;
  onRowClick?: (record: any, index: number) => void;
  onPaginationChange?: (current: number, pageSize: number) => void;
  onSortChange?: (sortKey: string | null, sortOrder: SortOrder) => void;
  className?: string;
}

export class ProTable {
  private element: HTMLDivElement;
  private options: ProTableOptions;
  private tableElement: HTMLTableElement | null = null;
  private paginationElement: HTMLDivElement | null = null;
  private stateElement: HTMLDivElement | null = null;
  private eventManager = new EventManager();

  private current: number;
  private pageSize: number;
  private total: number;
  private data: any[] = [];
  private extraParams: Record<string, any> = {};
  private sortKey: string | null = null;
  private sortOrder: SortOrder = null;
  private loading = false;
  private error: string | null = null;
  private requestId = 0;

  constructor(
    element: HTMLDivElement | string,
    options: ProTableOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = { ...options };
    this.current = options.pagination?.current ?? 1;
    this.pageSize = options.pagination?.pageSize ?? 10;
    this.total = options.pagination?.total ?? options.dataSource?.length ?? 0;
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createLayout();
    if (this.options.request) {
      this.load();
    } else {
      this.data = this.options.dataSource ?? [];
      this.total = this.options.pagination?.total ?? this.data.length;
      this.renderTable();
      this.renderPagination();
    }
  }

  private updateClasses(): void {
    this.element.className = ['ag-pro-table', this.options.className]
      .filter(Boolean)
      .join(' ');
  }

  private createLayout(): void {
    const header = dom.createElement('div', {
      className: 'ag-pro-table-header',
    });
    this.element.appendChild(header);

    const stateEl = dom.createElement('div', {
      className: 'ag-pro-table-state',
    });
    stateEl.style.display = 'none';
    this.element.appendChild(stateEl);
    this.stateElement = stateEl;

    const scroll = dom.createElement('div', {
      className: 'ag-pro-table-content ag-table-scroll',
    });
    this.element.appendChild(scroll);

    const footer = dom.createElement('div', {
      className: 'ag-pro-table-footer',
    });
    this.element.appendChild(footer);
  }

  /**
   * Load data through the async `request` function.
   */
  load(): Promise<void> {
    if (!this.options.request) {
      return Promise.resolve();
    }

    const requestId = ++this.requestId;
    this.loading = true;
    this.error = null;
    this.renderState();

    const params: ProTableRequestParams = {
      current: this.current,
      pageSize: this.pageSize,
      sortKey: this.sortKey,
      sortOrder: this.sortOrder,
      ...this.extraParams,
    };

    return this.options
      .request(params)
      .then((result) => {
        if (requestId !== this.requestId) return; // stale response
        this.loading = false;
        this.error = null;
        this.data = result.data;
        this.total = result.total;
        this.renderState();
        this.renderTable();
        this.renderPagination();
      })
      .catch((err: unknown) => {
        if (requestId !== this.requestId) return;
        this.loading = false;
        this.error = err instanceof Error ? err.message : String(err);
        this.data = [];
        this.renderState();
        this.renderTable();
        this.renderPagination();
      });
  }

  /**
   * Re-run the current request. Pass `resetPage: true` to jump back to page 1.
   */
  reload(resetPage = false): Promise<void> {
    if (resetPage) {
      this.current = 1;
    }
    return this.load();
  }

  /**
   * Merge extra query params (e.g. from QueryForm) and reload from page 1.
   */
  search(params: Record<string, any>): Promise<void> {
    this.extraParams = { ...params };
    this.current = 1;
    return this.load();
  }

  private renderState(): void {
    if (!this.stateElement) return;

    if (this.loading) {
      this.stateElement.textContent = 'Loading...';
      this.stateElement.className = 'ag-pro-table-state ag-pro-table-state--loading';
      this.stateElement.style.display = 'block';
      return;
    }

    if (this.error) {
      this.stateElement.textContent = this.error;
      this.stateElement.className = 'ag-pro-table-state ag-pro-table-state--error';
      this.stateElement.style.display = 'block';
      return;
    }

    this.stateElement.style.display = 'none';
  }

  private renderTable(): void {
    const content = this.element.querySelector('.ag-pro-table-content');
    if (this.tableElement) {
      this.tableElement.remove();
      this.tableElement = null;
    }

    if (this.loading || this.error) {
      return;
    }

    if (!this.data || this.data.length === 0) {
      const empty = dom.createElement('div', {
        className: 'ag-table-empty',
        textContent: this.options.emptyText || 'No data',
      });
      content?.appendChild(empty);
      this.tableElement = null;
      return;
    }

    const table = dom.createElement('table', {
      className: 'ag-table',
    });

    // Header
    const thead = dom.createElement('thead');
    const headRow = dom.createElement('tr');

    this.options.columns?.forEach((col) => {
      const th = dom.createElement('th', {
        className: `ag-table-cell ag-table-cell--${col.align || 'left'}`,
      });
      if (col.width) {
        th.style.width = col.width;
      }

      const titleWrap = dom.createElement('div', {
        className: 'ag-table-cell-title',
      });

      const titleText = dom.createElement('span', {
        textContent: col.title || '',
      });
      titleWrap.appendChild(titleText);

      if (col.sortable) {
        th.classList.add('ag-table-cell--sortable');
        const isActive = this.sortKey === col.key;
        const indicator = dom.createElement('span', {
          className: 'ag-table-sort-indicator',
          textContent: isActive ? (this.sortOrder === 'asc' ? '▲' : '▼') : '↕',
        });
        titleWrap.appendChild(indicator);

        this.eventManager.on(th, 'click', () => {
          this.handleSort(col.key);
        });
      }

      th.appendChild(titleWrap);
      headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    // Body
    const tbody = dom.createElement('tbody');

    this.data.forEach((record, index) => {
      const tr = dom.createElement('tr', {
        className: 'ag-table-row',
      });
      tr.dataset.index = String(index);

      this.eventManager.on(tr, 'click', () => {
        this.options.onRowClick?.(record, index);
      });

      this.options.columns?.forEach((col) => {
        const td = dom.createElement('td', {
          className: `ag-table-cell ag-table-cell--ellipsis ag-table-cell--${col.align || 'left'}`,
        });

        const value = col.dataIndex ? record[col.dataIndex] : undefined;
        if (col.render) {
          const rendered = col.render(value, record, index);
          if (typeof rendered === 'string') {
            td.innerHTML = rendered;
          } else {
            td.appendChild(rendered);
          }
        } else {
          td.textContent = value === undefined || value === null ? '' : String(value);
          td.title = td.textContent;
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    this.tableElement = table;
    content?.appendChild(table);
  }

  private handleSort(key: string): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : this.sortOrder === 'desc' ? null : 'asc';
      if (this.sortOrder === null) {
        this.sortKey = null;
      }
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }

    this.options.onSortChange?.(this.sortKey, this.sortOrder);

    if (this.options.request) {
      this.load();
    } else {
      this.renderTable();
    }
  }

  private renderPagination(): void {
    if (this.paginationElement) {
      this.paginationElement.remove();
      this.paginationElement = null;
    }

    const totalPages = Math.max(1, Math.ceil(this.total / this.pageSize));
    const pagination = dom.createElement('div', {
      className: 'ag-pagination',
    });

    const prevBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default ag-btn--sm',
      textContent: 'Previous',
      attributes: {
        type: 'button',
        disabled: this.current <= 1 ? 'disabled' : undefined,
      },
    });
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = dom.createElement('button', {
        className: `ag-btn ag-btn--default ag-btn--sm ${i === this.current ? 'ag-btn--primary' : ''}`,
        textContent: String(i),
        attributes: { type: 'button' },
      });
      this.eventManager.on(pageBtn, 'click', () => this.goToPage(i));
      pagination.appendChild(pageBtn);
    }

    const nextBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default ag-btn--sm',
      textContent: 'Next',
      attributes: {
        type: 'button',
        disabled: this.current >= totalPages ? 'disabled' : undefined,
      },
    });
    pagination.appendChild(nextBtn);

    this.eventManager.on(prevBtn, 'click', () => {
      if (this.current > 1) this.goToPage(this.current - 1);
    });
    this.eventManager.on(nextBtn, 'click', () => {
      if (this.current < totalPages) this.goToPage(this.current + 1);
    });

    this.element.querySelector('.ag-pro-table-footer')?.appendChild(pagination);
    this.paginationElement = pagination;
  }

  private goToPage(page: number): void {
    this.current = page;
    this.options.onPaginationChange?.(this.current, this.pageSize);
    if (this.options.request) {
      this.load();
    } else {
      const startIndex = (this.current - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      const source = this.options.dataSource ?? [];
      this.data = source.slice(startIndex, endIndex);
      this.renderTable();
      this.renderPagination();
    }
  }

  /**
   * Whether a request is in flight
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Current error message, if any
   */
  getError(): string | null {
    return this.error;
  }

  /**
   * Replace/refresh table data (static mode) or reload (request mode).
   */
  refresh(data?: any[]): void {
    if (this.options.request) {
      this.load();
      return;
    }

    if (data) {
      this.options.dataSource = data;
      this.total = this.options.pagination?.total ?? data.length;
    }

    const startIndex = (this.current - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.data = (this.options.dataSource ?? []).slice(startIndex, endIndex);
    this.renderTable();
    this.renderPagination();
  }

  /**
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy component
   */
  destroy(): void {
    this.requestId++; // invalidate any in-flight request callbacks
    this.eventManager.removeAll();
    if (this.tableElement) {
      this.tableElement.remove();
    }
    if (this.paginationElement) {
      this.paginationElement.remove();
    }
  }
}

/**
 * Create pro table from scratch
 */
export function createProTable(options: ProTableOptions = {}): ProTable {
  const container = dom.createElement('div', {
    className: 'ag-pro-table',
  });

  const instance = new ProTable(container, options);
  return instance;
}
