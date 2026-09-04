/**
 * Timeline component
 */

import * as dom from '../utils/dom';
import { timelineClasses } from '../utils/css-classes';

export interface TimelineOptions {
  pending?: boolean;
  pendingText?: string;
  mode?: 'left' | 'right' | 'alternate';
  className?: string;
}

export class Timeline {
  private element: HTMLDivElement;
  private options: TimelineOptions;
  private items: HTMLDivElement[] = [];

  constructor(
    element: HTMLDivElement | string,
    options: TimelineOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      mode: 'alternate',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.processItems();
  }

  private processItems(): void {
    // Remove existing items if any
    this.items = Array.from(this.element.children)
      .filter(el => el.classList.contains('ag-timeline-item'))
      .map(el => el as HTMLDivElement);

    // Add pending item if enabled
    if (this.options.pending) {
      this.createPendingItem();
    }
  }

  private createPendingItem(): void {
    const item = dom.createElement('div', {
      className: 'ag-timeline-item ag-timeline-item-pending',
    });

    const node = dom.createElement('div', {
      className: 'ag-timeline-node ag-timeline-node-pending',
    });

    const content = dom.createElement('div', {
      className: 'ag-timeline-content',
      textContent: this.options.pendingText || '',
    });

    item.appendChild(node);
    item.appendChild(content);
    this.element.appendChild(item);
    this.items.push(item);
  }

  private updateClasses(): void {
    const classes = timelineClasses({
      pending: this.options.pending,
      pendingText: this.options.pendingText,
      mode: this.options.mode,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Add timeline item
   */
  addItem(content: string, color?: string): HTMLDivElement {
    const item = dom.createElement('div', {
      className: 'ag-timeline-item',
    });

    const node = dom.createElement('div', {
      className: 'ag-timeline-node',
    });

    if (color) {
      node.style.backgroundColor = color;
    }

    const itemContent = dom.createElement('div', {
      className: 'ag-timeline-content',
      textContent: content,
    });

    item.appendChild(node);
    item.appendChild(itemContent);
    this.element.appendChild(item);
    this.items.push(item);

    return item;
  }

  /**
   * Set pending state
   */
  setPending(pending: boolean): void {
    this.options.pending = pending;
    this.updateClasses();
    this.processItems();
  }

  /**
   * Set pending text
   */
  setPendingText(text: string): void {
    this.options.pendingText = text;
    if (this.options.pending) {
      const pendingItem = this.element.querySelector('.ag-timeline-item-pending .ag-timeline-content');
      if (pendingItem) {
        pendingItem.textContent = text;
      }
    }
  }

  /**
   * Set mode
   */
  setMode(mode: 'left' | 'right' | 'alternate'): void {
    this.options.mode = mode;
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
 * Create timeline from scratch
 */
export function createTimeline(options: TimelineOptions = {}): Timeline {
  const container = dom.createElement('div', {
    className: 'ag-timeline',
  });

  const instance = new Timeline(container, options);
  return instance;
}
