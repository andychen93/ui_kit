/**
 * Badge component
 */

import { ComponentVariant, ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { badgeClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface BadgeOptions {
  count?: number | string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  dot?: boolean;
  overflowCount?: number;
  className?: string;
}

export class Badge {
  private element: HTMLDivElement;
  private options: BadgeOptions;
  private countElement: HTMLSpanElement | null = null;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: BadgeOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      variant: 'primary',
      size: 'md',
      overflowCount: 99,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createBadge();
  }

  private createBadge(): void {
    const count = this.formatCount(this.options.count);
    const showCount = (typeof count === 'number')
      ? (count as number) <= this.options.overflowCount!
      : (count !== undefined && count !== null);

    const badge = dom.createElement('span', {
      className: 'ag-badge-content',
      textContent: showCount ? String(count) : `${this.options.overflowCount}+`,
    });

    if (this.options.dot) {
      badge.className += ' ag-badge-dot';
    }

    this.element.appendChild(badge);
    this.countElement = badge;
  }

  private formatCount(count: BadgeOptions['count']): number | string {
    if (count === undefined || count === null) {
      return 0;
    }
    return count;
  }

  private updateClasses(): void {
    const classes = badgeClasses({
      variant: this.options.variant,
      size: this.options.size,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Set count value
   */
  setCount(count: number | string): void {
    this.options.count = count;
    if (this.countElement) {
      const formatted = this.formatCount(count);
      const showCount = (typeof formatted === 'number')
        ? (formatted as number) <= this.options.overflowCount!
        : (formatted !== undefined && formatted !== null);
      this.countElement.textContent = showCount ? String(formatted) : `${this.options.overflowCount}+`;
    }
  }

  /**
   * Set dot mode
   */
  setDot(dot: boolean): void {
    this.options.dot = dot;
    if (this.countElement) {
      this.countElement.className = dot
        ? 'ag-badge-content ag-badge-dot'
        : 'ag-badge-content';
    }
  }

  /**
   * Set variant
   */
  setVariant(variant: ComponentVariant): void {
    this.options.variant = variant;
    this.updateClasses();
  }

  /**
   * Get variant
   */
  getVariant(): ComponentVariant {
    return this.options.variant || 'primary';
  }

  /**
   * Set size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
  }

  /**
   * Get size
   */
  getSize(): ComponentSize {
    return this.options.size || 'md';
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
    if (this.countElement) {
      this.countElement.remove();
    }
    this.eventManager.removeAll();
  }
}

/**
 * Create badge from scratch
 */
export function createBadge(options: BadgeOptions = {}): Badge {
  const container = dom.createElement('div', {
    className: 'ag-badge',
  });

  const instance = new Badge(container, options);
  return instance;
}
