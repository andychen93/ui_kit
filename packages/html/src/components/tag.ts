/**
 * Tag component
 */

import { ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { tagClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export type TagVariant = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export interface TagOptions {
  variant?: TagVariant;
  size?: ComponentSize;
  closeable?: boolean;
  onClose?: () => void;
  className?: string;
}

export class Tag {
  private element: HTMLSpanElement;
  private options: TagOptions;
  private closeButton: HTMLButtonElement | null = null;
  private eventManager = new EventManager();
  private closed = false;

  constructor(
    element: HTMLSpanElement | string,
    options: TagOptions = {}
  ) {
    this.element = dom.getElement<HTMLSpanElement>(element);
    this.options = {
      variant: 'default',
      size: 'md',
      closeable: false,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    if (this.options.closeable) {
      this.createCloseButton();
    }
    this.bindEvents();
  }

  private createCloseButton(): void {
    const button = dom.createElement('button', {
      className: 'ag-tag-close',
      attributes: {
        type: 'button',
        'aria-label': 'Close tag',
      },
      innerHTML:
        '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    });
    this.element.appendChild(button);
    this.closeButton = button;
  }

  private updateClasses(): void {
    const classes = tagClasses({
      variant: this.options.variant,
      size: this.options.size,
      closeable: this.options.closeable,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private bindEvents(): void {
    if (this.closeButton) {
      this.eventManager.on(this.closeButton, 'click', () => this.close());
    }
  }

  /**
   * Close the tag: removes it from the DOM, cleans up listeners, and
   * invokes `onClose`. Safe to call more than once.
   */
  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.destroy();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.options.onClose?.();
  }

  /**
   * Set variant
   */
  setVariant(variant: TagVariant): void {
    this.options.variant = variant;
    this.updateClasses();
  }

  /**
   * Get variant
   */
  getVariant(): TagVariant {
    return this.options.variant || 'default';
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
  getElement(): HTMLSpanElement {
    return this.element;
  }

  /**
   * Destroy component: removes listeners and the close button (if any),
   * without removing the tag element itself from the DOM. Use `close()`
   * to both destroy and remove the element.
   */
  destroy(): void {
    this.eventManager.removeAll();
    if (this.closeButton) {
      this.closeButton.remove();
      this.closeButton = null;
    }
  }
}

/**
 * Create tag from scratch
 */
export function createTag(options: TagOptions = {}): Tag {
  const container = dom.createElement('span', {
    className: 'ag-tag',
  });

  const instance = new Tag(container, options);
  return instance;
}
