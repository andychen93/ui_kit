/**
 * Table and Pagination components
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';
import { ChangeHandler } from '../types/index';

export interface Column {
  key: string;
  title: string;
  dataIndex?: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  /** Sticky column. Requires `width` to compute the correct offset. */
  fixed?: 'left' | 'right';
  /** Truncate overflowing text with an ellipsis (adds title attr as tooltip). */
  ellipsis?: boolean;
  /** Enables a clickable sort header for this column. */
  sorter?: (a: any, b: any) => number;
  render?: (value: any, record: any, index: number) => string | HTMLElement;
}

export interface TableOptions {
  columns: Column[];
  data: any[];
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  emptyText?: string;
  loading?: boolean;
  /** Horizontal scroll min-width (px), typically set when using fixed columns. */
  scrollX?: number;
  onRowClick?: (record: any, index: number) => void;
  onSortChange?: (key: string | null, order: 'asc' | 'desc' | null) => void;
}

/**
 * Table component.
 *
 * Wraps the `<table>` element passed/created into an
 * `.ag-table-wrap > .ag-table-scroll > table` structure so a horizontal
 * scroll container is always present when columns overflow the viewport
 * (required for `fixed` columns to make sense).
 */
export class Table {
  private wrapElement: HTMLDivElement;
  private scrollElement: HTMLDivElement;
  private element: HTMLTableElement;
  private options: TableOptions;
  private eventManager = new EventManager();
  private sortKey: string | null = null;
  private sortOrder: 'asc' | 'desc' | null = null;

  constructor(
    element: HTMLTableElement | string,
    options: TableOptions
  ) {
    this.element = dom.getElement<HTMLTableElement>(element);
    this.options = {
      striped: true,
      hover: true,
      ...options
    };

    // Wrap the table in scroll + state containers if not already wrapped
    // (idempotent: re-wrapping an already-wrapped table is a no-op).
    const existingScroll = this.element.parentElement;
    if (existingScroll?.classList.contains('ag-table-scroll')) {
      this.scrollElement = existingScroll as HTMLDivElement;
      this.wrapElement = this.scrollElement.parentElement as HTMLDivElement;
    } else {
      this.scrollElement = dom.createElement('div', { className: 'ag-table-scroll' });
      this.wrapElement = dom.createElement('div', { className: 'ag-table-wrap' });

      const parent = this.element.parentNode;
      const next = this.element.nextSibling;
      this.scrollElement.appendChild(this.element);
      this.wrapElement.appendChild(this.scrollElement);
      if (parent) {
        parent.insertBefore(this.wrapElement, next);
      }
    }

    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.renderTable();
  }

  private updateClasses(): void {
    const classes = ['ag-table'];
    if (this.options.striped) classes.push('ag-table--striped');
    if (this.options.hover) classes.push('ag-table--hover');
    if (this.options.bordered) classes.push('ag-table--bordered');
    this.element.className = classes.join(' ');

    this.wrapElement.classList.toggle('ag-table-wrap--loading', !!this.options.loading);

    if (this.options.scrollX) {
      this.scrollElement.style.minWidth = `${this.options.scrollX}px`;
    }
  }

  private cellClasses(column: Column): string {
    return [
      column.fixed ? `ag-table-cell--fixed ag-table-cell--fixed-${column.fixed}` : '',
      column.align ? `ag-table-cell--${column.align}` : '',
      column.ellipsis ? 'ag-table-cell--ellipsis' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private applyFixedStyle(cell: HTMLElement, column: Column, offset: number): void {
    if (!column.fixed) return;
    cell.style.position = 'sticky';
    if (column.fixed === 'left') {
      cell.style.left = `${offset}px`;
    } else {
      cell.style.right = `${offset}px`;
    }
  }

  private computeFixedOffsets(): { left: Map<string, number>; right: Map<string, number> } {
    const left = new Map<string, number>();
    const right = new Map<string, number>();

    let acc = 0;
    for (const col of this.options.columns) {
      if (col.fixed === 'left') {
        left.set(col.key, acc);
        acc += Number(col.width ?? 160);
      }
    }

    acc = 0;
    for (let i = this.options.columns.length - 1; i >= 0; i--) {
      const col = this.options.columns[i];
      if (col.fixed === 'right') {
        right.set(col.key, acc);
        acc += Number(col.width ?? 160);
      }
    }

    return { left, right };
  }

  private getSortedData(): any[] {
    if (!this.sortKey || !this.sortOrder) {
      return this.options.data;
    }
    const column = this.options.columns.find((c) => c.key === this.sortKey);
    if (!column?.sorter) return this.options.data;

    const sorted = [...this.options.data].sort(column.sorter);
    return this.sortOrder === 'asc' ? sorted : sorted.reverse();
  }

  private handleSortClick(column: Column): void {
    if (!column.sorter) return;

    if (this.sortKey === column.key) {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else {
        // Third click resets to unsorted, matching common table UX.
        this.sortKey = null;
        this.sortOrder = null;
      }
    } else {
      this.sortKey = column.key;
      this.sortOrder = 'asc';
    }

    this.options.onSortChange?.(this.sortKey, this.sortOrder);
    this.renderTable();
  }

  private renderTable(): void {
    this.eventManager.removeAll();
    this.element.innerHTML = '';

    const { left, right } = this.computeFixedOffsets();

    // Header
    const thead = dom.createElement('thead');
    const headerRow = dom.createElement('tr');

    this.options.columns.forEach((column) => {
      const th = dom.createElement('th', {
        className: this.cellClasses(column),
      });
      if (column.width) {
        th.style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
      }
      this.applyFixedStyle(
        th,
        column,
        column.fixed === 'left' ? left.get(column.key) ?? 0 : right.get(column.key) ?? 0
      );

      const titleSpan = dom.createElement('span', {
        className: 'ag-table-cell-title',
        textContent: column.title,
      });
      th.appendChild(titleSpan);

      if (column.sorter) {
        th.classList.add('ag-table-cell--sortable');
        const isActive = this.sortKey === column.key;
        th.setAttribute(
          'aria-sort',
          isActive ? (this.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'
        );
        const indicator = dom.createElement('span', {
          className: 'ag-table-sort-indicator',
          textContent: isActive ? (this.sortOrder === 'asc' ? '▲' : '▼') : '↕',
        });
        th.appendChild(indicator);

        this.eventManager.on(th, 'click', () => this.handleSortClick(column));
      }

      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    this.element.appendChild(thead);

    // Body
    const tbody = dom.createElement('tbody');
    const data = this.getSortedData();

    if (!data || data.length === 0) {
      const emptyRow = dom.createElement('tr');
      const emptyCell = dom.createElement('td', {
        className: 'ag-table-empty',
        textContent: this.options.loading ? 'Loading...' : (this.options.emptyText || 'No data'),
      });
      emptyCell.setAttribute('colspan', String(this.options.columns.length || 1));
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    } else {
      data.forEach((record, index) => {
        const row = dom.createElement('tr', {
          className: this.options.onRowClick ? 'ag-table-row ag-table-row--clickable' : 'ag-table-row',
        });

        if (this.options.onRowClick) {
          this.eventManager.on(row, 'click', () => this.options.onRowClick?.(record, index));
        }

        this.options.columns.forEach((column) => {
          const td = dom.createElement('td', {
            className: this.cellClasses(column),
          });
          this.applyFixedStyle(
            td,
            column,
            column.fixed === 'left' ? left.get(column.key) ?? 0 : right.get(column.key) ?? 0
          );

          const value = record[column.dataIndex ?? column.key];

          if (column.render) {
            const rendered = column.render(value, record, index);
            if (typeof rendered === 'string') {
              // Caller-controlled HTML string. See README security notes:
              // this is NOT sanitized — only pass trusted content.
              td.innerHTML = rendered;
            } else {
              td.appendChild(rendered);
            }
          } else {
            const text = String(value ?? '');
            td.textContent = text;
            if (column.ellipsis) {
              td.title = text;
            }
          }

          row.appendChild(td);
        });

        tbody.appendChild(row);
      });
    }

    this.element.appendChild(tbody);
  }

  /**
   * Update data and re-render, preserving current sort state.
   */
  setData(data: any[]): void {
    this.options.data = data;
    this.renderTable();
  }

  /**
   * Get data (current, unsorted-order source array)
   */
  getData(): any[] {
    return this.options.data;
  }

  /**
   * Update column definitions and re-render.
   */
  setColumns(columns: Column[]): void {
    this.options.columns = columns;
    this.renderTable();
  }

  /**
   * Set loading state (renders the loading placeholder row when there is
   * no data, and toggles the wrapper's loading class).
   */
  setLoading(loading: boolean): void {
    this.options.loading = loading;
    this.updateClasses();
    this.renderTable();
  }

  /**
   * Add row
   */
  addRow(record: any): void {
    this.options.data.push(record);
    this.renderTable();
  }

  /**
   * Remove row
   */
  removeRow(index: number): void {
    this.options.data.splice(index, 1);
    this.renderTable();
  }

  /**
   * Get current sort state
   */
  getSort(): { key: string | null; order: 'asc' | 'desc' | null } {
    return { key: this.sortKey, order: this.sortOrder };
  }

  /**
   * Get element
   */
  getElement(): HTMLTableElement {
    return this.element;
  }

  /**
   * Get the outer wrapper element (`.ag-table-wrap`), useful for
   * inserting the table into the DOM or measuring its scroll container.
   */
  getWrapElement(): HTMLDivElement {
    return this.wrapElement;
  }

  /**
   * Destroy: removes all listeners and unwraps the table from the
   * scroll/wrap containers it created.
   */
  destroy(): void {
    this.eventManager.removeAll();
    if (this.wrapElement.parentNode) {
      this.wrapElement.parentNode.insertBefore(this.element, this.wrapElement);
      this.wrapElement.remove();
    }
  }
}

/**
 * Create table
 */
export function createTable(options: TableOptions): Table {
  const table = dom.createElement('table', {
    className: 'ag-table'
  });

  const instance = new Table(table, options);
  return instance;
}

export interface PaginationOptions {
  total: number;
  pageSize?: number;
  current?: number;
  onChange?: ChangeHandler<number>;
}

export class Pagination {
  private element: HTMLDivElement;
  private options: PaginationOptions;
  private current: number;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: PaginationOptions
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      pageSize: 10,
      current: 1,
      ...options
    };
    this.current = this.options.current || 1;
    this.init();
  }

  private init(): void {
    this.render();
  }

  private render(): void {
    // Clean up old event listeners before re-rendering
    this.eventManager.removeAll();

    this.element.innerHTML = '';
    dom.addClass(this.element, 'ag-pagination');

    const pageCount = Math.ceil(this.options.total / (this.options.pageSize || 10));

    // Previous button
    const prevBtn = dom.createElement('button', {
      className: 'ag-pagination__prev',
      textContent: 'Previous',
      attributes: {
        disabled: this.current <= 1 ? 'disabled' : undefined
      }
    });

    this.eventManager.on(prevBtn, 'click', () => {
      if (this.current > 1) {
        this.setCurrentPage(this.current - 1);
      }
    });

    this.element.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
      const pageBtn = dom.createElement('button', {
        className: ['ag-pagination__page', i === this.current ? 'ag-pagination__page--active' : null].filter(Boolean).join(' '),
        textContent: String(i)
      });

      this.eventManager.on(pageBtn, 'click', () => {
        this.setCurrentPage(i);
      });

      this.element.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = dom.createElement('button', {
      className: 'ag-pagination__next',
      textContent: 'Next',
      attributes: {
        disabled: this.current >= pageCount ? 'disabled' : undefined
      }
    });

    this.eventManager.on(nextBtn, 'click', () => {
      if (this.current < pageCount) {
        this.setCurrentPage(this.current + 1);
      }
    });

    this.element.appendChild(nextBtn);
  }

  /**
   * Set current page
   */
  setCurrentPage(page: number): void {
    this.current = page;
    this.render();
    if (this.options.onChange) {
      this.options.onChange(page, new Event('change'));
    }
  }

  /**
   * Get current page
   */
  getCurrentPage(): number {
    return this.current;
  }

  /**
   * Get element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy
   */
  destroy(): void {
    this.eventManager.removeAll();
  }
}

/**
 * Create pagination
 */
export function createPagination(options: PaginationOptions): Pagination {
  const div = dom.createElement('div', {
    className: 'ag-pagination'
  });

  const instance = new Pagination(div, options);
  return instance;
}
