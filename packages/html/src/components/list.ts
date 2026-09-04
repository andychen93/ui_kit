/**
 * List component
 */

import { ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { listClasses, listItemClasses } from '../utils/css-classes';

export interface ListItemOptions {
  title?: string;
  description?: string;
  action?: string;
  extra?: string;
  className?: string;
}

export interface ListOptions {
  size?: ComponentSize;
  bordered?: boolean;
  split?: boolean;
  className?: string;
}

export class List {
  private element: HTMLDivElement;
  private options: ListOptions;
  private items: HTMLDivElement[] = [];

  constructor(
    element: HTMLDivElement | string,
    options: ListOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      split: true,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.processItems();
  }

  private processItems(): void {
    this.items = Array.from(this.element.children)
      .filter(el => el.classList.contains('ag-list-item'))
      .map(el => el as HTMLDivElement);
  }

  private updateClasses(): void {
    const classes = listClasses({
      size: this.options.size,
      bordered: this.options.bordered,
      split: this.options.split,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Add list item
   */
  addItem(options: ListItemOptions): HTMLDivElement {
    const item = dom.createElement('div', {
      className: 'ag-list-item',
    });

    const content = dom.createElement('div', {
      className: 'ag-list-item-content',
    });

    if (options.title) {
      const title = dom.createElement('div', {
        className: 'ag-list-item-title',
        textContent: options.title,
      });
      content.appendChild(title);
    }

    if (options.description) {
      const description = dom.createElement('div', {
        className: 'ag-list-item-description',
        textContent: options.description,
      });
      content.appendChild(description);
    }

    item.appendChild(content);

    if (options.action) {
      const action = dom.createElement('div', {
        className: 'ag-list-item-action',
        textContent: options.action,
      });
      item.appendChild(action);
    }

    if (options.extra) {
      const extra = dom.createElement('div', {
        className: 'ag-list-item-extra',
        textContent: options.extra,
      });
      item.appendChild(extra);
    }

    this.element.appendChild(item);
    this.items.push(item);

    return item;
  }

  /**
   * Remove item
   */
  removeItem(index: number): void {
    if (index >= 0 && index < this.items.length) {
      const item = this.items[index];
      item.remove();
      this.items.splice(index, 1);
    }
  }

  /**
   * Set split
   */
  setSplit(split: boolean): void {
    this.options.split = split;
    this.updateClasses();
  }

  /**
   * Get items
   */
  getItems(): HTMLDivElement[] {
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
 * Create list from scratch
 */
export function createList(options: ListOptions = {}): List {
  const container = dom.createElement('div', {
    className: 'ag-list',
  });

  const instance = new List(container, options);
  return instance;
}
