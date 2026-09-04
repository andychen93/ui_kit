/**
 * SweetAlert component
 */

import { ComponentVariant, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { sweetAlertClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface SweetAlertOptions {
  variant?: ComponentVariant;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'question';
  showConfirm?: boolean;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}

export class SweetAlert {
  private element: HTMLDivElement;
  private options: SweetAlertOptions;
  private confirmButton: HTMLButtonElement | null = null;
  private cancelButton: HTMLButtonElement | null = null;
  private eventManager = new EventManager();
  private closed = false;

  constructor(
    element: HTMLDivElement | string,
    options: SweetAlertOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      variant: 'info',
      showConfirm: true,
      showCancel: false,
      confirmText: 'OK',
      cancelText: 'Cancel',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createContent();
    this.createButtons();
    this.bindEvents();
  }

  private createContent(): void {
    const contentDiv = dom.createElement('div', {
      className: 'ag-sweet-alert-content',
    });

    // Icon
    const icon = dom.createElement('div', {
      className: 'ag-sweet-alert-icon',
    });
    icon.innerHTML = this.getIconHTML();
    contentDiv.appendChild(icon);

    // Title
    if (this.options.title) {
      const title = dom.createElement('div', {
        className: 'ag-sweet-alert-title',
        textContent: this.options.title,
      });
      contentDiv.appendChild(title);
    }

    // Description
    if (this.options.description) {
      const description = dom.createElement('div', {
        className: 'ag-sweet-alert-description',
        textContent: this.options.description,
      });
      contentDiv.appendChild(description);
    }

    this.element.appendChild(contentDiv);
  }

  private createButtons(): void {
    const actions = dom.createElement('div', {
      className: 'ag-sweet-alert-actions',
    });

    if (this.options.showCancel) {
      const cancelBtn = dom.createElement('button', {
        className: 'ag-btn ag-btn--default',
        textContent: this.options.cancelText,
      });
      actions.appendChild(cancelBtn);
      this.cancelButton = cancelBtn;
    }

    if (this.options.showConfirm) {
      const confirmBtn = dom.createElement('button', {
        className: 'ag-btn ag-btn--primary',
        textContent: this.options.confirmText,
      });
      actions.appendChild(confirmBtn);
      this.confirmButton = confirmBtn;
    }

    this.element.appendChild(actions);
  }

  private getIconHTML(): string {
    switch (this.options.type) {
      case 'success':
        return '<svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
      case 'error':
        return '<svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
      case 'warning':
        return '<svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
      case 'info':
        return '<svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
      case 'question':
        return '<svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25l1.02 1.02c.69-.82 1.11-1.96 1.11-3.25 0-2.76-2.24-5-5-5s-5 2.24-5 5H6c0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.08-1.26 3.85-3.04 4.65z"/></svg>';
      default:
        return '';
    }
  }

  private updateClasses(): void {
    const classes = sweetAlertClasses({
      variant: this.options.variant,
      title: !!this.options.title,
      type: this.options.type,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private bindEvents(): void {
    if (this.confirmButton) {
      this.eventManager.on(this.confirmButton, 'click', () => {
        this.options.onConfirm?.();
        this.close();
      });
    }

    if (this.cancelButton) {
      this.eventManager.on(this.cancelButton, 'click', () => {
        this.options.onCancel?.();
        this.close();
      });
    }
  }

  /**
   * Close the alert and clean up listeners/DOM. Safe to call multiple times.
   */
  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.destroy();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  /**
   * Whether the alert has been closed
   */
  isClosed(): boolean {
    return this.closed;
  }

  /**
   * Show the alert
   */
  show(): void {
    this.element.style.display = 'block';
  }

  /**
   * Set title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const titleEl = this.element.querySelector('.ag-sweet-alert-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * Set description
   */
  setDescription(description: string): void {
    this.options.description = description;
    const descEl = this.element.querySelector('.ag-sweet-alert-description');
    if (descEl) {
      descEl.textContent = description;
    }
  }

  /**
   * Set type
   */
  setType(type: 'success' | 'error' | 'warning' | 'info' | 'question'): void {
    this.options.type = type;
    this.updateClasses();

    const icon = this.element.querySelector('.ag-sweet-alert-icon');
    if (icon) {
      icon.innerHTML = this.getIconHTML();
    }
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
    if (this.confirmButton) {
      this.confirmButton.remove();
      this.confirmButton = null;
    }
    if (this.cancelButton) {
      this.cancelButton.remove();
      this.cancelButton = null;
    }
  }
}

/**
 * Create sweet alert from scratch
 */
export function createSweetAlert(options: SweetAlertOptions): SweetAlert {
  const container = dom.createElement('div', {
    className: 'ag-sweet-alert',
  });

  const instance = new SweetAlert(container, options);
  return instance;
}

/**
 * Show a sweet alert attached to `document.body` and resolve a promise
 * once the user confirms or cancels. Mirrors the common `Swal.fire`-style
 * API used by React/Vue/Svelte wrappers around SweetAlert2.
 *
 * The overlay mask and alert are both removed from the DOM and all
 * listeners are cleaned up as soon as the promise settles.
 */
export function fireSweetAlert(
  options: SweetAlertOptions
): Promise<{ confirmed: boolean }> {
  return new Promise((resolve) => {
    const mask = dom.createElement('div', {
      className: 'ag-sweet-alert-mask',
    });

    let settled = false;
    const settle = (confirmed: boolean) => {
      if (settled) return;
      settled = true;
      mask.remove();
      resolve({ confirmed });
    };

    const instance = createSweetAlert({
      ...options,
      onConfirm: () => {
        options.onConfirm?.();
        settle(true);
      },
      onCancel: () => {
        options.onCancel?.();
        settle(false);
      },
    });

    mask.appendChild(instance.getElement());
    document.body.appendChild(mask);
  });
}
