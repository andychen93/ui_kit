/**
 * CrudFormModal component - A modal with form for CRUD (create/edit) operations.
 *
 * Behavior parity with React/Vue/Svelte common CRUD modal patterns:
 * - `mode` controls whether the modal behaves as "create" or "edit".
 * - `initialValues` pre-fills the form (primarily used in edit mode).
 * - `fields` describes the editable fields (name/label/type/required).
 * - `onSubmit` may return a Promise; the modal shows a pending state while
 *   it resolves, closes on success, and keeps the modal open showing the
 *   returned/thrown error message on failure.
 *
 * Security note: field values are inserted using `textContent`/`value`
 * properties only. No option here writes untrusted strings into
 * `innerHTML`.
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export type CrudFormMode = 'create' | 'edit';

export interface CrudFormFieldOptions {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

export interface CrudFormOptions {
  title?: string;
  okText?: string;
  cancelText?: string;
  visible?: boolean;
  mode?: CrudFormMode;
  fields?: CrudFormFieldOptions[];
  initialValues?: Record<string, any>;
  /** Submit handler. May return a Promise to trigger the pending state. */
  onOk?: (values: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  className?: string;
}

const DEFAULT_FIELDS: CrudFormFieldOptions[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email' },
];

export class CrudFormModal {
  private element: HTMLDivElement;
  private options: CrudFormOptions;
  private formElement: HTMLFormElement | null = null;
  private errorElement: HTMLDivElement | null = null;
  private okButton: HTMLButtonElement | null = null;
  private cancelButton: HTMLButtonElement | null = null;
  private closeButton: HTMLButtonElement | null = null;
  private eventManager = new EventManager();
  private visible = false;
  private pending = false;
  private mode: CrudFormMode;
  private fields: CrudFormFieldOptions[];

  constructor(
    element: HTMLDivElement | string,
    options: CrudFormOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      okText: 'OK',
      cancelText: 'Cancel',
      visible: false,
      mode: 'create',
      ...options,
    };
    this.mode = this.options.mode ?? 'create';
    this.fields = this.options.fields ?? DEFAULT_FIELDS;
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createHeader();
    this.createBody();
    this.createFooter();
    this.bindEvents();

    if (this.options.initialValues) {
      this.setValues(this.options.initialValues);
    }

    if (this.options.visible) {
      this.show();
    }
  }

  private createHeader(): void {
    const header = dom.createElement('div', {
      className: 'ag-modal-header',
    });

    const title = dom.createElement('div', {
      className: 'ag-modal-title',
      textContent: this.options.title || (this.mode === 'edit' ? 'Edit' : 'Create'),
    });
    header.appendChild(title);

    const closeBtn = dom.createElement('button', {
      className: 'ag-modal-close',
      attributes: { type: 'button', 'aria-label': 'Close' },
      innerHTML:
        '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    });
    header.appendChild(closeBtn);
    this.closeButton = closeBtn;

    this.element.appendChild(header);
  }

  private createBody(): void {
    const body = dom.createElement('div', {
      className: 'ag-modal-body',
    });

    const errorEl = dom.createElement('div', {
      className: 'ag-crud-form-error',
    });
    errorEl.style.display = 'none';
    body.appendChild(errorEl);
    this.errorElement = errorEl;

    const form = dom.createElement('form', {
      className: 'ag-form',
      attributes: { novalidate: 'novalidate' },
    });

    this.fields.forEach((field) => {
      form.appendChild(this.createFormItem(field));
    });

    body.appendChild(form);
    this.element.appendChild(body);
    this.formElement = form;
  }

  private createFormItem(field: CrudFormFieldOptions): HTMLDivElement {
    const item = dom.createElement('div', {
      className: 'ag-form-item',
    });

    const labelEl = dom.createElement('label', {
      className: 'ag-form-label',
      textContent: field.required ? `${field.label} *` : field.label,
    });
    item.appendChild(labelEl);

    const input = dom.createElement('input', {
      className: 'ag-input',
      attributes: {
        type: field.type || 'text',
        name: field.name,
        placeholder: field.placeholder,
        required: field.required ? 'required' : undefined,
      },
    });
    item.appendChild(input);

    const fieldError = dom.createElement('div', {
      className: 'ag-form-item-error',
    });
    fieldError.style.display = 'none';
    item.appendChild(fieldError);

    return item;
  }

  private createFooter(): void {
    const footer = dom.createElement('div', {
      className: 'ag-modal-footer',
    });

    const cancelBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default',
      attributes: { type: 'button' },
      textContent: this.options.cancelText,
    });
    footer.appendChild(cancelBtn);
    this.cancelButton = cancelBtn;

    const okBtn = dom.createElement('button', {
      attributes: { type: 'submit' },
      className: 'ag-btn ag-btn--primary',
      textContent: this.options.okText,
    });
    footer.appendChild(okBtn);
    this.okButton = okBtn;

    this.element.appendChild(footer);
  }

  private bindEvents(): void {
    if (this.closeButton) {
      this.eventManager.on(this.closeButton, 'click', () => this.close());
    }

    if (this.formElement) {
      this.eventManager.on(this.formElement, 'submit', (e: Event) => {
        e.preventDefault();
        this.handleOk();
      });
    }

    if (this.cancelButton) {
      this.eventManager.on(this.cancelButton, 'click', () => this.handleCancel());
    }

    // Background click to close
    this.eventManager.on(this.element, 'click', (e: Event) => {
      if (e.target === this.element) {
        this.close();
      }
    });
  }

  private validate(values: Record<string, any>): Record<string, string> {
    const errors: Record<string, string> = {};
    this.fields.forEach((field) => {
      if (field.required && !values[field.name]) {
        errors[field.name] = `${field.label} is required`;
      }
    });
    return errors;
  }

  private showFieldErrors(errors: Record<string, string>): void {
    if (!this.formElement) return;
    this.fields.forEach((field) => {
      const item = this.formElement!.querySelector(
        `[name="${field.name}"]`
      )?.closest('.ag-form-item');
      const errorEl = item?.querySelector('.ag-form-item-error');
      if (errorEl instanceof HTMLElement) {
        const message = errors[field.name];
        errorEl.textContent = message || '';
        errorEl.style.display = message ? 'block' : 'none';
      }
    });
  }

  private setSubmitError(message: string | null): void {
    if (!this.errorElement) return;
    this.errorElement.textContent = message || '';
    this.errorElement.style.display = message ? 'block' : 'none';
  }

  private setPending(pending: boolean): void {
    this.pending = pending;
    if (this.okButton) {
      this.okButton.disabled = pending;
    }
    if (this.cancelButton) {
      this.cancelButton.disabled = pending;
    }
    this.element.classList.toggle('ag-modal--pending', pending);
  }

  private handleOk(): void {
    if (!this.formElement || this.pending) return;

    const values = this.getValues();
    const errors = this.validate(values);
    this.showFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    this.setSubmitError(null);

    if (!this.options.onOk) {
      this.close();
      return;
    }

    let result: void | Promise<void>;
    try {
      result = this.options.onOk(values);
    } catch (err) {
      this.setSubmitError(err instanceof Error ? err.message : String(err));
      return;
    }

    if (result && typeof (result as Promise<void>).then === 'function') {
      this.setPending(true);
      (result as Promise<void>)
        .then(() => {
          this.setPending(false);
          this.close();
        })
        .catch((err: unknown) => {
          this.setPending(false);
          this.setSubmitError(err instanceof Error ? err.message : String(err));
        });
    } else {
      this.close();
    }
  }

  private handleCancel(): void {
    if (this.options.onCancel) {
      this.options.onCancel();
    }
    this.close();
  }

  private updateClasses(): void {
    this.element.className = 'ag-modal ag-crud-form-modal';
  }

  /**
   * Set mode (create/edit)
   */
  setMode(mode: CrudFormMode): void {
    this.mode = mode;
    const titleEl = this.element.querySelector('.ag-modal-title');
    if (titleEl && !this.options.title) {
      titleEl.textContent = mode === 'edit' ? 'Edit' : 'Create';
    }
  }

  /**
   * Get current mode
   */
  getMode(): CrudFormMode {
    return this.mode;
  }

  /**
   * Whether a submit is currently pending
   */
  isPending(): boolean {
    return this.pending;
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
   * Whether the modal is visible
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * Get form values
   */
  getValues(): Record<string, any> {
    if (!this.formElement) return {};

    const values: Record<string, any> = {};
    this.fields.forEach((field) => {
      const input = this.formElement!.querySelector(`[name="${field.name}"]`);
      if (input instanceof HTMLInputElement) {
        values[field.name] = input.value;
      }
    });

    return values;
  }

  /**
   * Set form values
   */
  setValues(values: Record<string, any>): void {
    if (!this.formElement) return;

    Object.entries(values).forEach(([key, value]) => {
      const input = this.formElement!.querySelector(`[name="${key}"]`);
      if (input instanceof HTMLInputElement) {
        input.value = value === undefined || value === null ? '' : String(value);
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
