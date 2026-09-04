/**
 * CrudFormModal component - A modal with form for CRUD operations
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface CrudFormOptions {
  title?: string;
  okText?: string;
  cancelText?: string;
  visible?: boolean;
  onOk?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  className?: string;
}

export class CrudFormModal {
  private element: HTMLDivElement;
  private options: CrudFormOptions;
  private formElement: HTMLFormElement | null = null;
  private eventManager = new EventManager();
  private visible: boolean = false;

  constructor(
    element: HTMLDivElement | string,
    options: CrudFormOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      okText: 'OK',
      cancelText: 'Cancel',
      visible: false,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createHeader();
    this.createBody();
    this.createFooter();
    this.bindEvents();
  }

  private createHeader(): void {
    const header = dom.createElement('div', {
      className: 'ag-modal-header',
    });

    const title = dom.createElement('div', {
      className: 'ag-modal-title',
      textContent: this.options.title || 'Form',
    });
    header.appendChild(title);

    const closeBtn = dom.createElement('button', {
      className: 'ag-modal-close',
      innerHTML: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    });
    header.appendChild(closeBtn);

    this.element.appendChild(header);
  }

  private createBody(): void {
    const body = dom.createElement('div', {
      className: 'ag-modal-body',
    });

    const form = dom.createElement('form', {
      className: 'ag-form',
    });

    // Add some default form fields
    const nameItem = this.createFormItem('name', 'text', 'Name');
    form.appendChild(nameItem);

    const emailItem = this.createFormItem('email', 'email', 'Email');
    form.appendChild(emailItem);

    body.appendChild(form);
    this.element.appendChild(body);
    this.formElement = form;
  }

  private createFormItem(name: string, type: string, label: string): HTMLDivElement {
    const item = dom.createElement('div', {
      className: 'ag-form-item',
    });

    const labelEl = dom.createElement('label', {
      className: 'ag-form-label',
      textContent: label,
    });
    item.appendChild(labelEl);

    const input = dom.createElement('input', {
      type: type,
      className: 'ag-input',
      name: name,
    });
    item.appendChild(input);

    return item;
  }

  private createFooter(): void {
    const footer = dom.createElement('div', {
      className: 'ag-modal-footer',
    });

    const cancelBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default',
      textContent: this.options.cancelText,
    });
    footer.appendChild(cancelBtn);

    const okBtn = dom.createElement('button', {
      type: 'submit',
      className: 'ag-btn ag-btn--primary',
      textContent: this.options.okText,
    });
    footer.appendChild(okBtn);

    this.element.appendChild(footer);
  }

  private bindEvents(): void {
    // Close button
    const closeBtn = this.element.querySelector('.ag-modal-close');
    if (closeBtn) {
      this.eventManager.on(closeBtn, 'click', () => this.close());
    }

    // Form submit
    if (this.formElement) {
      this.eventManager.on(this.formElement, 'submit', (e) => {
        e.preventDefault();
        this.handleOk();
      });
    }

    // Cancel button
    const cancelBtn = this.element.querySelector('.ag-modal-footer button:first-child');
    if (cancelBtn) {
      this.eventManager.on(cancelBtn, 'click', () => this.handleCancel());
    }

    // Background click to close
    this.eventManager.on(this.element, 'click', (e: MouseEvent) => {
      if (e.target === this.element) {
        this.close();
      }
    });
  }

  private handleOk(): void {
    if (!this.formElement) return;

    const formData = new FormData(this.formElement);
    const values: Record<string, any> = {};

    formData.forEach((value, key) => {
      values[key] = value;
    });

    if (this.options.onOk) {
      this.options.onOk(values);
    }
    this.close();
  }

  private handleCancel(): void {
    if (this.options.onCancel) {
      this.options.onCancel();
    }
    this.close();
  }

  private updateClasses(): void {
    this.element.className = 'ag-modal ag-modal--visible';
  }

  /**
   * Show modal
   */
  show(): void {
    this.visible = true;
    this.element.style.display = 'block';
    this.element.classList.add('ag-modal--visible');
  }

  /**
   * Close modal
   */
  close(): void {
    this.visible = false;
    this.element.style.display = 'none';
    this.element.classList.remove('ag-modal--visible');
  }

  /**
   * Get form values
   */
  getValues(): Record<string, any> {
    if (!this.formElement) return {};

    const formData = new FormData(this.formElement);
    const values: Record<string, any> = {};

    formData.forEach((value, key) => {
      values[key] = value;
    });

    return values;
  }

  /**
   * Set form values
   */
  setValues(values: Record<string, any>): void {
    if (!this.formElement) return;

    Object.entries(values).forEach(([key, value]) => {
      const input = this.formElement.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = String(value);
      }
    });
  }

  /**
   * Set title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const titleEl = this.element.querySelector('.ag-modal-title');
    if (titleEl) {
      titleEl.textContent = title;
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
  }
}

/**
 * Create CRUD form modal from scratch
 */
export function createCrudFormModal(options: CrudFormOptions = {}): CrudFormModal {
  const container = dom.createElement('div', {
    className: 'ag-modal',
  });

  const instance = new CrudFormModal(container, options);
  return instance;
}
