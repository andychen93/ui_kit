/**
 * Steps component
 */

import { ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { stepsClasses, stepItemClasses } from '../utils/css-classes';

export interface StepItemOptions {
  title?: string;
  description?: string;
  status?: 'wait' | 'process' | 'finish' | 'error';
  index?: number;
  className?: string;
}

export interface StepsOptions {
  current?: number;
  size?: ComponentSize;
  direction?: 'horizontal' | 'vertical';
  status?: 'wait' | 'process' | 'finish' | 'error';
  className?: string;
}

export class Steps {
  private element: HTMLDivElement;
  private options: StepsOptions;
  private items: HTMLDivElement[] = [];

  constructor(
    element: HTMLDivElement | string,
    options: StepsOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      current: 0,
      direction: 'horizontal',
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
      .filter(el => el.classList.contains('ag-step-item'))
      .map(el => el as HTMLDivElement);

    this.updateItemStates();
  }

  private updateItemStates(): void {
    this.items.forEach((item, index) => {
      const isCurrent = index === this.options.current;
      const isFinished = index < this.options.current;
      
      let status: 'wait' | 'process' | 'finish' | 'error';
      if (isFinished) {
        status = 'finish';
      } else if (isCurrent) {
        status = this.options.status || 'process';
      } else {
        status = 'wait';
      }

      const classes = stepItemClasses({
        current: this.options.current,
        status: status,
        index: index,
        className: '',
      });

      // Apply status classes
      item.classList.remove('ag-step-item--wait', 'ag-step-item--process', 'ag-step-item--finish', 'ag-step-item--error');
      item.classList.add(`ag-step-item--${status}`);

      // Update icon
      const icon = item.querySelector('.ag-step-icon');
      if (icon) {
        if (status === 'finish') {
          icon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
        } else if (status === 'error') {
          icon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
        } else {
          icon.textContent = String(index + 1);
        }
      }
    });
  }

  private updateClasses(): void {
    const classes = stepsClasses({
      current: this.options.current,
      size: this.options.size,
      direction: this.options.direction,
      status: this.options.status,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Add step
   */
  addItem(options: StepItemOptions): HTMLDivElement {
    const item = dom.createElement('div', {
      className: 'ag-step-item',
    });

    const icon = dom.createElement('div', {
      className: 'ag-step-icon',
      textContent: String(this.items.length + 1),
    });

    const content = dom.createElement('div', {
      className: 'ag-step-content',
    });

    if (options.title) {
      const title = dom.createElement('div', {
        className: 'ag-step-title',
        textContent: options.title,
      });
      content.appendChild(title);
    }

    if (options.description) {
      const description = dom.createElement('div', {
        className: 'ag-step-description',
        textContent: options.description,
      });
      content.appendChild(description);
    }

    item.appendChild(icon);
    item.appendChild(content);
    this.element.appendChild(item);
    this.items.push(item);

    return item;
  }

  /**
   * Set current step
   */
  setCurrent(current: number): void {
    this.options.current = current;
    this.updateItemStates();
  }

  /**
   * Set direction
   */
  setDirection(direction: 'horizontal' | 'vertical'): void {
    this.options.direction = direction;
    this.updateClasses();
    this.updateItemStates();
  }

  /**
   * Set status
   */
  setStatus(status: 'wait' | 'process' | 'finish' | 'error'): void {
    this.options.status = status;
    this.updateItemStates();
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
 * Create steps from scratch
 */
export function createSteps(options: StepsOptions = {}): Steps {
  const container = dom.createElement('div', {
    className: 'ag-steps',
  });

  const instance = new Steps(container, options);
  return instance;
}
