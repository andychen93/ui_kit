/**
 * Notification component (persistent notifications)
 */

import { ComponentVariant } from '../types/index';
import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

let notificationContainer: HTMLDivElement | null = null;

function getNotificationContainer(): HTMLDivElement {
  if (!notificationContainer) {
    notificationContainer = dom.createElement('div', {
      className: 'ag-notification-container',
      attributes: {
        role: 'region',
        'aria-live': 'assertive'
      }
    });
    document.body.appendChild(notificationContainer);
  }
  return notificationContainer;
}

export interface NotificationOptions {
  type?: ComponentVariant;
  title?: string;
  description?: string;
  duration?: number; // 0 = no auto-close
  closeable?: boolean;
  onClose?: () => void;
}

export class Notification {
  private element: HTMLDivElement;
  private options: NotificationOptions;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private eventManager = new EventManager();

  constructor(options: NotificationOptions = {}) {
    this.options = {
      type: 'info',
      duration: 5000,
      closeable: true,
      ...options
    };

    this.element = this.createNotificationElement();
  }

  private createNotificationElement(): HTMLDivElement {
    const notification = dom.createElement('div', {
      className: `ag-notification ag-notification--${this.options.type || 'info'}`
    });

    const content = dom.createElement('div', {
      className: 'ag-notification__content'
    });

    if (this.options.title) {
      const title = dom.createElement('div', {
        className: 'ag-notification__title',
        textContent: this.options.title
      });
      content.appendChild(title);
    }

    if (this.options.description) {
      const desc = dom.createElement('div', {
        className: 'ag-notification__description',
        textContent: this.options.description
      });
      content.appendChild(desc);
    }

    notification.appendChild(content);

    if (this.options.closeable) {
      const closeBtn = dom.createElement('button', {
        className: 'ag-notification__close',
        innerHTML: '&times;'
      });

      this.eventManager.on(closeBtn, 'click', () => this.close());
      notification.appendChild(closeBtn);
    }

    return notification;
  }

  /**
   * Show notification
   */
  show(): void {
    const container = getNotificationContainer();
    container.appendChild(this.element);

    if (this.options.duration && this.options.duration > 0) {
      this.timeout = setTimeout(() => this.close(), this.options.duration);
    }
  }

  /**
   * Close notification
   */
  close(): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.element.remove();
    if (this.options.onClose) {
      this.options.onClose();
    }
  }

  /**
   * Get element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy
   */
  destroy(): void {
    this.close();
    this.eventManager.removeAll();
  }
}

/**
 * Show notification
 */
export function showNotification(options: NotificationOptions = {}): Notification {
  const notification = new Notification(options);
  notification.show();
  return notification;
}

/**
 * Notification shortcuts
 */
export const notification = {
  success: (title: string, description?: string, duration?: number) =>
    showNotification({ type: 'success', title, description, duration }),
  error: (title: string, description?: string, duration?: number) =>
    showNotification({ type: 'danger', title, description, duration }),
  warning: (title: string, description?: string, duration?: number) =>
    showNotification({ type: 'warning', title, description, duration }),
  info: (title: string, description?: string, duration?: number) =>
    showNotification({ type: 'info', title, description, duration }),
};
