/**
 * Table and Pagination components
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';
import { ChangeHandler } from '../types/index';

export interface Column {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: any) => string | HTMLElement;
}

export interface TableOptions {
  columns: Column[];
  data: any[];
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
}

export class Table {
  private element: HTMLTableElement;
  private options: TableOptions;
  private eventManager = new EventManager();

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
  }

  private renderTable(): void {
    this.element.innerHTML = '';

    // Header
    const thead = dom.createElement('thead');
    const headerRow = dom.createElement('tr');

    this.options.columns.forEach(column => {
      const th = dom.createElement('th', {
        textContent: column.title,
        attributes: {
          style: column.width ? `width: ${column.width}` : undefined
        }
      });
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    this.element.appendChild(thead);

    // Body
    const tbody = dom.createElement('tbody');

    this.options.data.forEach(record => {
      const row = dom.createElement('tr');

      this.options.columns.forEach(column => {
        const td = dom.createElement('td');
        const value = record[column.key];

        if (column.render) {
          const rendered = column.render(value, record);
          if (typeof rendered === 'string') {
            td.innerHTML = rendered;
          } else {
            td.appendChild(rendered);
          }
        } else {
          td.textContent = String(value || '');
        }

        row.appendChild(td);
      });

      tbody.appendChild(row);
    });

    this.element.appendChild(tbody);
  }

  /**
   * Update data
   */
  setData(data: any[]): void {
    this.options.data = data;
    this.renderTable();
  }

  /**
   * Get data
   */
  getData(): any[] {
    return this.options.data;
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
   * Get element
   */
  getElement(): HTMLTableElement {
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
