/**
 * Popconfirm component
 */

import { ComponentVariant, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { popconfirmClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface PopconfirmOptions {
  title?: string;
  description?: string;
  variant?: ComponentVariant;
  okText?: string;
  cancelText?: string;
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onVisibleChange?: (visible: boolean) => void;
  className?: string;
}

export class Popconfirm {
  private target: HTMLElement;
  private element: HTMLDivElement = document.createElement("div");
  private options: PopconfirmOptions;
  private visible: boolean = false;
  private eventManager = new EventManager();
  private confirmButton: HTMLButtonElement | null = null;
  private cancelButton: HTMLButtonElement | null = null;

  constructor(
    target: HTMLElement | string,
    options: PopconfirmOptions = {}
  ) {
    this.target = dom.getElement<HTMLElement>(target);
    this.options = {
      variant: 'warning',
      okText: 'OK',
      cancelText: 'Cancel',
      trigger: 'click',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createPopconfirmElement();
    this.updateClasses();
    this.bindEvents();
  }

  private createPopconfirmElement(): void {
    const contentDiv = dom.createElement('div', {
      className: 'ag-popconfirm-content',
    });

    if (this.options.title) {
      const header = dom.createElement('div', {
        className: 'ag-popconfirm-header',
        textContent: this.options.title,
      });
      contentDiv.appendChild(header);
    }

    if (this.options.description) {
      const body = dom.createElement('div', {
        className: 'ag-popconfirm-body',
        textContent: this.options.description,
      });
      contentDiv.appendChild(body);
    }

    // Action buttons
    const footer = dom.createElement('div', {
      className: 'ag-popconfirm-actions',
    });

    const cancelBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--sm',
      textContent: this.options.cancelText,
    });
    footer.appendChild(cancelBtn);
    this.cancelButton = cancelBtn;

    const okBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--sm ag-btn--primary',
      textContent: this.options.okText,
    });
    footer.appendChild(okBtn);
    this.confirmButton = okBtn;

    contentDiv.appendChild(footer);

    // Arrow
    const arrow = dom.createElement('div', {
      className: 'ag-popconfirm-arrow',
    });

    this.element = dom.createElement('div', {
      className: 'ag-popconfirm',
      attributes: {
        role: 'dialog',
        'aria-modal': 'true',
        id: `popconfirm-${this.generateId()}`,
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
    const classes = popconfirmClasses({
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

    // Button click handlers
    if (this.confirmButton) {
      this.eventManager.on(this.confirmButton, 'click', (e) => {
        e.stopPropagation();
        this.handleConfirm();
      });
    }

    if (this.cancelButton) {
      this.eventManager.on(this.cancelButton, 'click', (e) => {
        e.stopPropagation();
        this.handleCancel();
      });
    }

    // Hide on document click outside
    this.eventManager.on(document, 'click', (e: MouseEvent) => {
      if (this.visible &&
          e.target !== this.target &&
          !this.element.contains(e.target as Node) &&
          !this.target.contains(e.target as Node)) {
        this.hide();
      }
    });
  }

  /**
   * Show popconfirm
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
   * Hide popconfirm
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
   * Toggle popconfirm visibility
   */
  toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Handle confirm action
   */
  private handleConfirm(): void {
    if (this.options.onConfirm) {
      this.options.onConfirm();
    }
    this.hide();
  }

  /**
   * Handle cancel action
   */
  private handleCancel(): void {
    if (this.options.onCancel) {
      this.options.onCancel();
    }
    this.hide();
  }

  /**
   * Position popconfirm relative to target
   */
  private position(): void {
    const targetRect = this.target.getBoundingClientRect();
    const popconfirmRect = this.element.getBoundingClientRect();
    const arrow = this.element.querySelector('.ag-popconfirm-arrow');

    const gap = 8;
    const arrowSize = 8;

    this.element.style.top = `${targetRect.top + (targetRect.height - popconfirmRect.height) / 2}px`;
    this.element.style.left = `${targetRect.right + gap}px`;

    this.element.className = popconfirmClasses({
      variant: this.options.variant,
      title: !!this.options.title,
      className: this.options.className,
    });

    if (arrow) {
      arrow.className = 'ag-popconfirm-arrow ag-popconfirm-arrow--left';
    }
  }

  /**
   * Update title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const header = this.element.querySelector('.ag-popconfirm-header');

    if (title) {
      if (!header) {
        const headerEl = dom.createElement('div', {
          className: 'ag-popconfirm-header',
          textContent: title,
        });
        const content = this.element.querySelector('.ag-popconfirm-content');
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
   * Update description
   */
  setDescription(description: string): void {
    this.options.description = description;
    const body = this.element.querySelector('.ag-popconfirm-body');
    if (body) {
      body.textContent = description;
    }
  }

  /**
   * Update OK text
   */
  setOkText(text: string): void {
    this.options.okText = text;
    if (this.confirmButton) {
      this.confirmButton.textContent = text;
    }
  }

  /**
   * Update cancel text
   */
  setCancelText(text: string): void {
    this.options.cancelText = text;
    if (this.cancelButton) {
      this.cancelButton.textContent = text;
    }
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
   * Get popconfirm element
   */
  getPopconfirmElement(): HTMLDivElement {
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
    if (this.confirmButton) {
      this.confirmButton.remove();
      this.confirmButton = null;
    }
    if (this.cancelButton) {
      this.cancelButton.remove();
      this.cancelButton = null;
    }
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

/**
 * Create popconfirm from scratch
 */
export function createPopconfirm(options: PopconfirmOptions): Popconfirm {
  throw new Error('Popconfirm requires a target element');
}
