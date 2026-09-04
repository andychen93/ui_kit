/**
 * Message component (toast notifications)
 */

import { ComponentVariant } from '../types/index';
import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

let messageContainer: HTMLDivElement | null = null;

function getMessageContainer(): HTMLDivElement {
  if (!messageContainer) {
    messageContainer = dom.createElement('div', {
      className: 'ag-message-container',
      attributes: {
        role: 'alert',
        'aria-live': 'polite'
      }
    });
    document.body.appendChild(messageContainer);
  }
  return messageContainer;
}

export interface MessageOptions {
  type?: ComponentVariant;
  duration?: number; // ms, 0 = no auto-close
  closeable?: boolean;
}

export class Message {
  private element: HTMLDivElement;
  private options: MessageOptions;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private eventManager = new EventManager();

  constructor(content: string | HTMLElement, options: MessageOptions = {}) {
    this.options = {
      type: 'info',
      duration: 3000,
      closeable: true,
      ...options
    };

    this.element = this.createMessageElement(content);
  }

  private createMessageElement(content: string | HTMLElement): HTMLDivElement {
    const message = dom.createElement('div', {
      className: `ag-message ag-message--${this.options.type || 'info'}`
    });

    if (typeof content === 'string') {
      message.textContent = content;
    } else {
      message.appendChild(content);
    }

    if (this.options.closeable) {
      const closeBtn = dom.createElement('button', {
        className: 'ag-message__close',
        innerHTML: '&times;'
      });

      this.eventManager.on(closeBtn, 'click', () => this.close());
      message.appendChild(closeBtn);
    }

    return message;
  }

  /**
   * Show message
   */
  show(): void {
    const container = getMessageContainer();
    container.appendChild(this.element);

    if (this.options.duration && this.options.duration > 0) {
      this.timeout = setTimeout(() => this.close(), this.options.duration);
    }
  }

  /**
   * Close message
   */
  close(): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.element.remove();
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
 * Show message with auto-close
 */
export function showMessage(
  content: string | HTMLElement,
  options?: MessageOptions
): Message {
  const message = new Message(content, options);
  message.show();
  return message;
}

/**
 * Message type shortcuts
 */
export const message = {
  success: (content: string, duration?: number) =>
    showMessage(content, { type: 'success', duration }),
  error: (content: string, duration?: number) =>
    showMessage(content, { type: 'danger', duration }),
  warning: (content: string, duration?: number) =>
    showMessage(content, { type: 'warning', duration }),
  info: (content: string, duration?: number) =>
    showMessage(content, { type: 'info', duration }),
};
