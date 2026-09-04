/**
 * Popover component
 */

import { ComponentVariant, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { popoverClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface PopoverOptions {
  title?: string;
  content?: string;
  variant?: ComponentVariant;
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
  className?: string;
  onVisibleChange?: (visible: boolean) => void;
}

export class Popover {
  private target: HTMLElement;
  private element: HTMLDivElement = document.createElement("div");
  private options: PopoverOptions;
  private visible: boolean = false;
  private eventManager = new EventManager();

  constructor(
    target: HTMLElement | string,
    options: PopoverOptions = {}
  ) {
    this.target = dom.getElement<HTMLElement>(target);
    this.options = {
      variant: 'light',
      trigger: 'hover',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createPopoverElement();
    this.updateClasses();
    this.bindEvents();
  }

  private createPopoverElement(): void {
    const contentDiv = dom.createElement('div', {
      className: 'ag-popover-content',
    });
    
    if (this.options.title) {
      const header = dom.createElement('div', {
        className: 'ag-popover-header',
        textContent: this.options.title,
      });
      contentDiv.appendChild(header);
    }
    
    const body = dom.createElement('div', {
      className: 'ag-popover-body',
      textContent: this.options.content || '',
    });
    contentDiv.appendChild(body);
    
    // Arrow
    const arrow = dom.createElement('div', {
      className: 'ag-popover-arrow',
    });
    
    this.element = dom.createElement('div', {
      className: 'ag-popover',
      attributes: {
        role: 'dialog',
        'aria-modal': 'false',
        id: `popover-${this.generateId()}`,
      },
    });
    this.element.appendChild(arrow);
    this.element.appendChild(contentDiv);
    
    document.body.appendChild(this.element);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private updateClasses(): void {
    const classes = popoverClasses({
      variant: this.options.variant,
      title: !!this.options.title,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private bindEvents(): void {
    if (this.options.disabled) return;

    if (this.options.trigger === 'hover') {
      this.eventManager.on(this.target, 'mouseenter', () => this.show());
      this.eventManager.on(this.target, 'mouseleave', () => this.hide());
    } else if (this.options.trigger === 'click') {
      this.eventManager.on(this.target, 'click', () => this.toggle());
    } else if (this.options.trigger === 'focus') {
      this.eventManager.on(this.target, 'focus', () => this.show());
      this.eventManager.on(this.target, 'blur', () => this.hide());
    }

    // Hide on document click
    this.eventManager.on(document, 'click', (e: MouseEvent) => {
      if (this.visible && e.target !== this.target && !this.element.contains(e.target as Node)) {
        this.hide();
      }
    });
  }

  /**
   * Show popover
   */
  show(): void {
    if (this.visible || this.options.disabled) return;
    
    this.visible = true;
    this.element.style.display = 'block';
    this.position();
    
    if (this.options.onVisibleChange) {
      this.options.onVisibleChange(true);
    }
  }

  /**
   * Hide popover
   */
  hide(): void {
    if (!this.visible) return;
    
    this.visible = false;
    this.element.style.display = 'none';
    
    if (this.options.onVisibleChange) {
      this.options.onVisibleChange(false);
    }
  }

  /**
   * Toggle popover visibility
   */
  toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Position popover relative to target
   */
  private position(): void {
    const targetRect = this.target.getBoundingClientRect();
    const popoverRect = this.element.getBoundingClientRect();
    const arrow = this.element.querySelector('.ag-popover-arrow');
    
    const gap = 8;
    const arrowSize = 8;

    this.element.style.top = `${targetRect.top + (targetRect.height - popoverRect.height) / 2}px`;
    this.element.style.left = `${targetRect.right + gap}px`;
    
    this.element.className = popoverClasses({
      variant: this.options.variant,
      title: !!this.options.title,
      className: this.options.className,
    });
    
    if (arrow) {
      arrow.className = 'ag-popover-arrow ag-popover-arrow--left';
    }
  }

  /**
   * Update content
   */
  setContent(content: string): void {
    const body = this.element.querySelector('.ag-popover-body');
    if (body) {
      body.textContent = content;
    }
  }

  /**
   * Update title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const header = this.element.querySelector('.ag-popover-header');
    
    if (title) {
      if (!header) {
        const headerEl = dom.createElement('div', {
          className: 'ag-popover-header',
          textContent: title,
        });
        const content = this.element.querySelector('.ag-popover-content');
        if (content) {
          content.insertBefore(headerEl, content.firstChild);
        }
      } else {
        header.textContent = title;
      }
    } else if (header) {
      header.remove();
    }
    
    this.updateClasses();
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    if (disabled) {
      this.hide();
    }
  }

  /**
   * Check if disabled
   */
  isDisabled(): boolean {
    return this.options.disabled || false;
  }

  /**
   * Check if visible
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * Get popover element
   */
  getPopoverElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Get target element
   */
  getTarget(): HTMLElement {
    return this.target;
  }

  /**
   * Destroy component
   */
  destroy(): void {
    this.eventManager.removeAll();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

/**
 * Create popover from scratch
 */
export function createPopover(options: PopoverOptions): Popover {
  throw new Error('Popover requires a target element');
}
