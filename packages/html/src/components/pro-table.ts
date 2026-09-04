/**
 * ProTable component - A table with search, pagination, and operations
 */

import { ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface TableColumn {
  key: string;
  title?: string;
  dataIndex?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ProTableOptions {
  columns?: TableColumn[];
  dataSource?: any[];
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  onRowClick?: (record: any, index: number) => void;
  onPaginationChange?: (current: number, pageSize: number) => void;
  className?: string;
}

export class ProTable {
  private element: HTMLDivElement;
  private options: ProTableOptions;
  private tableElement: HTMLTableElement | null;
  private paginationElement: HTMLDivElement | null;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: ProTableOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createLayout();
    this.createTable();
    this.createPagination();
  }

  private createLayout(): void {
    const header = dom.createElement('div', {
      className: 'ag-pro-table-header',
    });
    this.element.appendChild(header);

    const content = dom.createElement('div', {
      className: 'ag-pro-table-content',
    });
    this.element.appendChild(content);

    const footer = dom.createElement('div', {
      className: 'ag-pro-table-footer',
    });
    this.element.appendChild(footer);
  }

  private createTable(): void {
    const table = dom.createElement('table', {
      className: 'ag-table',
    });

    // Header
    const thead = dom.createElement('thead');
    const tr = dom.createElement('tr');

    this.options.columns?.forEach(col => {
      const th = dom.createElement('th', {
        className: `ag-table-cell ag-table-cell--${col.align || 'left'}`,
        attributes: {
          width: col.width || '',
        },
      });

      if (col.title) {
        const title = dom.createElement('div', {
          className: 'ag-table-cell-title',
          textContent: col.title,
        });
        th.appendChild(title);
      }

      tr.appendChild(th);
    });

    thead.appendChild(tr);
    table.appendChild(thead);

    // Body
    const tbody = dom.createElement('tbody');
    const startIndex = (this.options.pagination?.current! - 1) * this.options.pagination!.pageSize!;
    const endIndex = startIndex + this.options.pagination!.pageSize!;
    const paginatedData = this.options.dataSource?.slice(startIndex, endIndex) || [];

    paginatedData.forEach((record, index) => {
      const tr = dom.createElement('tr', {
        className: 'ag-table-row',
        attributes: {
          'data-index': String(index),
        },
      });

      tr.addEventListener('click', () => {
        if (this.options.onRowClick) {
          this.options.onRowClick(record, index);
        }
      });

      this.options.columns?.forEach(col => {
        const td = dom.createElement('td', {
          className: 'ag-table-cell',
        });

        const content = dom.createElement('div', {
          className: 'ag-table-cell-content',
          textContent: String(record[col.dataIndex!] ?? ''),
        });
        td.appendChild(content);

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    this.tableElement = table;
    this.element.querySelector('.ag-pro-table-content')?.appendChild(table);
  }

  private createPagination(): void {
    const total = this.options.pagination?.total || 0;
    const current = this.options.pagination?.current || 1;
    const pageSize = this.options.pagination?.pageSize || 10;
    const totalPages = Math.ceil(total / pageSize);

    if (totalPages <= 1) return;

    const pagination = dom.createElement('div', {
      className: 'ag-pagination',
    });

    const prevBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default ag-btn--sm',
      textContent: 'Previous',
      disabled: current === 1,
    });
    pagination.appendChild(prevBtn);

    // Simple page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = dom.createElement('button', {
        className: `ag-btn ag-btn--default ag-btn--sm ${i === current ? 'ag-btn--primary' : ''}`,
        textContent: String(i),
      });
      pagination.appendChild(pageBtn);
    }

    const nextBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default ag-btn--sm',
      textContent: 'Next',
      disabled: current === totalPages,
    });
    pagination.appendChild(nextBtn);

    this.element.querySelector('.ag-pro-table-footer')?.appendChild(pagination);
    this.paginationElement = pagination;

    // Bind events
    this.eventManager.on(prevBtn, 'click', () => {
      if (current > 1 && this.options.onPaginationChange) {
        this.options.onPaginationChange(current - 1, pageSize);
      }
    });

    this.eventManager.on(nextBtn, 'click', () => {
      if (current < totalPages && this.options.onPaginationChange) {
        this.options.onPaginationChange(current + 1, pageSize);
      }
    });

    const pageBtns = pagination.querySelectorAll('button:not(:first-child):not(:last-child)');
    pageBtns.forEach((btn, index) => {
      this.eventManager.on(btn, 'click', () => {
        if (this.options.onPaginationChange) {
          this.options.onPaginationChange(index + 1, pageSize);
        }
      });
    });
  }

  /**
   * Refresh table data
   */
  refresh(data?: any[]): void {
    const content = this.element.querySelector('.ag-pro-table-content');
    if (content && this.tableElement) {
      content.removeChild(this.tableElement);
    }

    if (data) {
      this.options.dataSource = data;
    }

    this.createTable();
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
