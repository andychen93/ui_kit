/**
 * PageSelect component - A page selector with pagination
 */

import { ComponentSize, ComponentVariant } from '../types/index';
import * as dom from '../utils/dom';
import { pageSelectClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface PageSelectOptions {
  size?: ComponentSize;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export class PageSelect {
  private element: HTMLDivElement;
  private options: PageSelectOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: PageSelectOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      size: 'md',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
  }

  private updateClasses(): void {
    const classes = pageSelectClasses({
      size: this.options.size,
      disabled: this.options.disabled,
      error: !!this.options.error,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.updateClasses();
  }

  /**
   * Set size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
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
  }
}

/**
 * Create page select from scratch
 */
export function createPageSelect(options: PageSelectOptions = {}): PageSelect {
  const container = dom.createElement('div', {
    className: 'ag-page-select',
  });

  const instance = new PageSelect(container, options);
  return instance;
}
