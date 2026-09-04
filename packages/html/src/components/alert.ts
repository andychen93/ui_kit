/**
 * Alert component
 */

import { ComponentVariant, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { alertClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface AlertOptions {
  variant?: ComponentVariant;
  title?: string;
  description?: string;
  closeable?: boolean;
  onClose?: () => void;
  className?: string;
}

export class Alert {
  private element: HTMLDivElement;
  private options: AlertOptions;
  private closeButton: HTMLButtonElement | null = null;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: AlertOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      variant: 'info',
      closeable: false,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createContent();
    if (this.options.closeable) {
      this.createCloseButton();
    }
    this.bindEvents();
  }

  private createContent(): void {
    const contentDiv = dom.createElement('div', {
      className: 'ag-alert-content',
    });

    if (this.options.title) {
      const title = dom.createElement('div', {
        className: 'ag-alert-title',
        textContent: this.options.title,
      });
      contentDiv.appendChild(title);
    }

    if (this.options.description) {
      const description = dom.createElement('div', {
        className: 'ag-alert-description',
        textContent: this.options.description,
      });
      contentDiv.appendChild(description);
    }

    this.element.appendChild(contentDiv);
  }

  private createCloseButton(): void {
    const button = dom.createElement('button', {
      className: 'ag-alert-close',
      attributes: {
        type: 'button',
        'aria-label': 'Close alert',
      },
      innerHTML: '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    });
    this.element.appendChild(button);
    this.closeButton = button;
  }

  private updateClasses(): void {
    const classes = alertClasses({
      variant: this.options.variant,
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
   * Close the alert
   */
  close(): void {
    this.element.style.opacity = '0';
    this.element.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      if (this.options.onClose) {
        this.options.onClose();
      }
    }, 300);
  }

  /**
   * Set title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const titleEl = this.element.querySelector('.ag-alert-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * Set description
   */
  setDescription(description: string): void {
    this.options.description = description;
    const descEl = this.element.querySelector('.ag-alert-description');
    if (descEl) {
      descEl.textContent = description;
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
    return this.options.variant || 'info';
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
    if (this.closeButton) {
      this.closeButton.remove();
      this.closeButton = null;
    }
  }
}

/**
 * Create alert from scratch
 */
export function createAlert(options: AlertOptions): Alert {
  const container = dom.createElement('div', {
    className: 'ag-alert',
  });

  const instance = new Alert(container, options);
  return instance;
}
