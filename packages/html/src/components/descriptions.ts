/**
 * Descriptions component
 */

import { ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { descriptionsClasses, descriptionsItemClasses } from '../utils/css-classes';

export interface DescriptionItemOptions {
  label?: string;
  span?: number;
  content?: string;
  className?: string;
}

export interface DescriptionsOptions {
  title?: string;
  bordered?: boolean;
  size?: ComponentSize;
  column?: number;
  className?: string;
}

export class Descriptions {
  private element: HTMLDivElement;
  private options: DescriptionsOptions;
  private items: HTMLDivElement[] = [];

  constructor(
    element: HTMLDivElement | string,
    options: DescriptionsOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      bordered: false,
      size: 'md',
      column: 3,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createHeader();
    this.processItems();
  }

  private createHeader(): void {
    if (this.options.title) {
      const header = dom.createElement('div', {
        className: 'ag-descriptions-header',
      });

      const title = dom.createElement('div', {
        className: 'ag-descriptions-title',
        textContent: this.options.title,
      });
      header.appendChild(title);
      this.element.appendChild(header);
    }
  }

  private processItems(): void {
    this.items = Array.from(this.element.children)
      .filter(el => el.classList.contains('ag-descriptions-item'))
      .map(el => el as HTMLDivElement);
  }

  private updateClasses(): void {
    const classes = descriptionsClasses({
      title: !!this.options.title,
      bordered: this.options.bordered,
      size: this.options.size,
      column: this.options.column,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Add description item
   */
  addItem(options: DescriptionItemOptions): HTMLDivElement {
    const item = dom.createElement('div', {
      className: 'ag-descriptions-item',
    });

    if (this.options.bordered) {
      item.style.flex = `0 0 ${(1 / this.options.column!) * 100}%`;
    }

    if (options.label) {
      const label = dom.createElement('div', {
        className: 'ag-descriptions-item-label',
        textContent: options.label,
      });
      item.appendChild(label);
    }

    if (options.content) {
      const content = dom.createElement('div', {
        className: 'ag-descriptions-item-content',
        textContent: options.content,
      });
      item.appendChild(content);
    }

    this.element.appendChild(item);
    this.items.push(item);

    return item;
  }

  /**
   * Set title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const header = this.element.querySelector('.ag-descriptions-header');
    
    if (title) {
      if (!header) {
        this.createHeader();
      } else {
        const titleEl = header.querySelector('.ag-descriptions-title');
        if (titleEl) {
          titleEl.textContent = title;
        }
      }
    } else if (header) {
      header.remove();
    }
  }

  /**
   * Set column count
   */
  setColumn(column: number): void {
    this.options.column = column;
    this.items.forEach(item => {
      if (this.options.bordered) {
        item.style.flex = `0 0 ${(1 / column) * 100}%`;
      }
    });
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
 * Create descriptions from scratch
 */
export function createDescriptions(options: DescriptionsOptions = {}): Descriptions {
  const container = dom.createElement('div', {
    className: 'ag-descriptions',
  });

  const instance = new Descriptions(container, options);
  return instance;
}
