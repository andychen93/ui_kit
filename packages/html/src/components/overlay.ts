/**
 * Modal and Drawer overlay components
 */

import * as dom from '../utils/dom';
import { EventManager, preventDefault } from '../utils/event';

export interface ModalOptions {
  title?: string;
  content?: string | HTMLElement;
  footer?: string | HTMLElement;
  centered?: boolean;
  closeable?: boolean;
  maskClosable?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  onCancel?: () => void;
}

export class Modal {
  private mask: HTMLDivElement;
  private element: HTMLDivElement;
  private options: ModalOptions;
  private eventManager = new EventManager();

  constructor(options: ModalOptions = {}) {
    this.options = {
      centered: true,
      closeable: true,
      maskClosable: true,
      ...options
    };

    this.mask = this.createMask();
    this.element = this.createModal();
  }

  private createMask(): HTMLDivElement {
    return dom.createElement('div', {
      className: 'ag-modal-mask'
    });
  }

  private createModal(): HTMLDivElement {
    const modal = dom.createElement('div', {
      className: ['ag-modal', this.options.centered ? 'ag-modal--centered' : null].filter(Boolean).join(' ')
    });

    const content = dom.createElement('div', {
      className: 'ag-modal__content'
    });

    // Header
    if (this.options.title || this.options.closeable) {
      const header = dom.createElement('div', {
        className: 'ag-modal__header'
      });

      if (this.options.title) {
        const title = dom.createElement('h3', {
          className: 'ag-modal__title',
          textContent: this.options.title
        });
        header.appendChild(title);
      }

      if (this.options.closeable) {
        const closeBtn = dom.createElement('button', {
          className: 'ag-modal__close',
          innerHTML: '&times;'
        });
        this.eventManager.on(closeBtn, 'click', () => this.close());
        header.appendChild(closeBtn);
      }

      content.appendChild(header);
    }

    // Body
    const body = dom.createElement('div', {
      className: 'ag-modal__body'
    });

    if (this.options.content) {
      if (typeof this.options.content === 'string') {
        body.innerHTML = this.options.content;
      } else {
        body.appendChild(this.options.content);
      }
    }

    content.appendChild(body);

    // Footer
    if (this.options.footer || this.options.onOk || this.options.onCancel) {
      const footer = dom.createElement('div', {
        className: 'ag-modal__footer'
      });

      if (this.options.onCancel) {
        const cancelBtn = dom.createElement('button', {
          className: 'ag-btn ag-btn--secondary',
          textContent: 'Cancel'
        });
        this.eventManager.on(cancelBtn, 'click', () => {
          this.options.onCancel?.();
          this.close();
        });
        footer.appendChild(cancelBtn);
      }

      if (this.options.onOk) {
        const okBtn = dom.createElement('button', {
          className: 'ag-btn ag-btn--primary',
          textContent: 'OK'
        });
        this.eventManager.on(okBtn, 'click', () => {
          this.options.onOk?.();
          this.close();
        });
        footer.appendChild(okBtn);
      }

      if (this.options.footer && !this.options.onOk && !this.options.onCancel) {
        if (typeof this.options.footer === 'string') {
          footer.innerHTML = this.options.footer;
        } else {
          footer.appendChild(this.options.footer);
        }
      }

      content.appendChild(footer);
    }

    modal.appendChild(content);
    return modal;
  }

  /**
   * Show modal
   */
  show(): void {
    document.body.appendChild(this.mask);
    document.body.appendChild(this.element);

    if (this.options.maskClosable) {
      this.eventManager.on(this.mask, 'click', () => this.close());
    }
  }

  /**
   * Close modal
   */
  close(): void {
    dom.removeElement(this.mask);
    dom.removeElement(this.element);
    this.options.onClose?.();
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

export interface DrawerOptions {
  title?: string;
  content?: string | HTMLElement;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  closeable?: boolean;
  maskClosable?: boolean;
  onClose?: () => void;
}

export class Drawer {
  private mask: HTMLDivElement;
  private element: HTMLDivElement;
  private options: DrawerOptions;
  private eventManager = new EventManager();

  constructor(options: DrawerOptions = {}) {
    this.options = {
      placement: 'right',
      closeable: true,
      maskClosable: true,
      ...options
    };

    this.mask = this.createMask();
    this.element = this.createDrawer();
  }

  private createMask(): HTMLDivElement {
    return dom.createElement('div', {
      className: 'ag-drawer-mask'
    });
  }

  private createDrawer(): HTMLDivElement {
    const drawer = dom.createElement('div', {
      className: `ag-drawer ag-drawer--${this.options.placement || 'right'}`
    });

    const content = dom.createElement('div', {
      className: 'ag-drawer__content'
    });

    // Header
    if (this.options.title || this.options.closeable) {
      const header = dom.createElement('div', {
        className: 'ag-drawer__header'
      });

      if (this.options.title) {
        const title = dom.createElement('h3', {
          className: 'ag-drawer__title',
          textContent: this.options.title
        });
        header.appendChild(title);
      }

      if (this.options.closeable) {
        const closeBtn = dom.createElement('button', {
          className: 'ag-drawer__close',
          innerHTML: '&times;'
        });
        this.eventManager.on(closeBtn, 'click', () => this.close());
        header.appendChild(closeBtn);
      }

      content.appendChild(header);
    }

    // Body
    const body = dom.createElement('div', {
      className: 'ag-drawer__body'
    });

    if (this.options.content) {
      if (typeof this.options.content === 'string') {
        body.innerHTML = this.options.content;
      } else {
        body.appendChild(this.options.content);
      }
    }

    content.appendChild(body);
    drawer.appendChild(content);
    return drawer;
  }

  /**
   * Show drawer
   */
  show(): void {
    document.body.appendChild(this.mask);
    document.body.appendChild(this.element);

    if (this.options.maskClosable) {
      this.eventManager.on(this.mask, 'click', () => this.close());
    }
  }

  /**
   * Close drawer
   */
  close(): void {
    dom.removeElement(this.mask);
    dom.removeElement(this.element);
    this.options.onClose?.();
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
 * Show modal
 */
export function showModal(options: ModalOptions = {}): Modal {
  const modal = new Modal(options);
  modal.show();
  return modal;
}

/**
 * Show drawer
 */
export function showDrawer(options: DrawerOptions = {}): Drawer {
  const drawer = new Drawer(options);
  drawer.show();
  return drawer;
}
