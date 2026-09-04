/**
 * Breadcrumb component
 */

import * as dom from '../utils/dom';

export interface BreadcrumbItem {
  title?: string;
  href?: string;
  className?: string;
}

export interface BreadcrumbOptions {
  items?: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

export class Breadcrumb {
  private element: HTMLDivElement;
  private options: BreadcrumbOptions;
  private items: HTMLSpanElement[] = [];

  constructor(
    element: HTMLDivElement | string,
    options: BreadcrumbOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      separator: '/',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createItems();
  }

  private createItems(): void {
    this.options.items?.forEach((item, index) => {
      const separator = index > 0 
        ? dom.createElement('span', {
            className: 'ag-breadcrumb-separator',
            textContent: this.options.separator,
          })
        : null;

      const crumb = dom.createElement('span', {
        className: 'ag-breadcrumb-item',
      });

      if (item.href) {
        const link = dom.createElement('a', {
          className: 'ag-breadcrumb-link',
          href: item.href,
          textContent: item.title || '',
        });
        crumb.appendChild(link);
      } else {
        const text = dom.createElement('span', {
          className: 'ag-breadcrumb-text',
          textContent: item.title || '',
        });
        crumb.appendChild(text);
      }

      if (separator) {
        this.element.appendChild(separator);
      }
      this.element.appendChild(crumb);
      this.items.push(crumb);
    });
  }

  /**
   * Add breadcrumb item
   */
  addItem(item: BreadcrumbItem): HTMLSpanElement {
    const separator = dom.createElement('span', {
      className: 'ag-breadcrumb-separator',
      textContent: this.options.separator,
    });
    this.element.appendChild(separator);

    const crumb = dom.createElement('span', {
      className: 'ag-breadcrumb-item',
    });

    if (item.href) {
      const link = dom.createElement('a', {
        className: 'ag-breadcrumb-link',
        href: item.href,
        textContent: item.title || '',
      });
      crumb.appendChild(link);
    } else {
      const text = dom.createElement('span', {
        className: 'ag-breadcrumb-text',
        textContent: item.title || '',
      });
      crumb.appendChild(text);
    }

    this.element.appendChild(crumb);
    this.items.push(crumb);

    return crumb;
  }

  /**
   * Remove item
   */
  removeItem(index: number): void {
    if (index >= 0 && index < this.items.length) {
      const item = this.items[index];
      item.remove();
      
      // Also remove the separator before this item
      const prevItem = this.items[index - 1];
      if (prevItem) {
        const separator = prevItem.nextElementSibling;
        if (separator?.classList.contains('ag-breadcrumb-separator')) {
          separator.remove();
        }
      }
      
      this.items.splice(index, 1);
    }
  }

  /**
   * Get items
   */
  getItems(): HTMLSpanElement[] {
    return this.items;
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
    this.items.forEach(item => {
      item.remove();
    });
    this.items = [];
  }
}

/**
 * Create breadcrumb from scratch
 */
export function createBreadcrumb(options: BreadcrumbOptions = {}): Breadcrumb {
  const container = dom.createElement('div', {
    className: 'ag-breadcrumb',
  });

  const instance = new Breadcrumb(container, options);
  return instance;
}
