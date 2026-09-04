/**
 * FormItem component - a label/control/error wrapper that cooperates with
 * `Form` for field registration and validation display.
 *
 * Behavior parity with React/Vue/Svelte FormItem:
 * - `label` renders a `<label>` above/beside the control.
 * - `required` adds a visual required marker (`ag-form-item--required`)
 *   and, when the item wraps a `Form`, registers a `required` validation
 *   rule for `name`.
 * - `error` (static) or an error propagated from the bound `Form` for
 *   `name` renders below the control and toggles `ag-form-item.is-error` /
 *   `ag-form-item--error`.
 * - `help`/`description` renders a hint below the control when there is
 *   no active error.
 * - When constructed with a `form` (a `Form` instance) and `name`, the
 *   item subscribes to `form.onFieldError(name, ...)` so calling
 *   `form.validate()` automatically updates this item's error display —
 *   no manual wiring required.
 * - `destroy()` unsubscribes from the form and unregisters the field, so
 *   the form no longer knows about it.
 */

import * as dom from '../utils/dom';
import { formItemClasses } from '../utils/css-classes';
import type { Form, FormFieldConfig } from './form';

export interface FormItemOptions {
  label?: string;
  /** Field name. Required to integrate with a bound `form`. */
  name?: string;
  required?: boolean;
  /** Static error message. Overridden by form-driven errors when a form is bound. */
  error?: string | null;
  /** Hint text shown when there is no active error. */
  help?: string;
  /** Alias for `help`, matching some frameworks' prop naming. */
  description?: string;
  /** Bind to a Form instance for field registration + live validation. */
  form?: Form;
  /** Extra field validation config forwarded to `form.registerField`. */
  fieldConfig?: Omit<FormFieldConfig, 'name' | 'required'>;
  className?: string;
}

export class FormItem {
  private element: HTMLDivElement;
  private options: FormItemOptions;
  private labelElement: HTMLLabelElement | null = null;
  private controlElement: HTMLDivElement;
  private messageElement: HTMLDivElement;
  private unsubscribe: (() => void) | null = null;
  private currentError: string | null = null;

  constructor(
    element: HTMLDivElement | string,
    options: FormItemOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = { ...options };
    this.currentError = options.error ?? null;

    if (this.options.label) {
      this.labelElement = dom.createElement('label', {
        className: 'ag-form-item__label',
        textContent: this.options.label,
      });
      this.element.appendChild(this.labelElement);
    }

    this.controlElement = dom.createElement('div', {
      className: 'ag-form-item__control',
    });
    this.element.appendChild(this.controlElement);

    this.messageElement = dom.createElement('div', {
      className: 'ag-form-item__hint',
    });
    this.controlElement.appendChild(this.messageElement);

    this.updateClasses();
    this.renderMessage();

    if (this.options.form && this.options.name) {
      this.bindForm(this.options.form, this.options.name);
    }
  }

  private bindForm(form: Form, name: string): void {
    form.registerField({
      name,
      required: this.options.required,
      ...this.options.fieldConfig,
    });

    this.unsubscribe = form.onFieldError(name, (error) => {
      this.currentError = error;
      this.updateClasses();
      this.renderMessage();
    });

    const existing = form.getError(name);
    if (existing) {
      this.currentError = existing;
      this.updateClasses();
      this.renderMessage();
    }
  }

  private updateClasses(): void {
    this.element.className = formItemClasses({
      required: this.options.required,
      error: !!this.currentError,
      className: this.options.className,
    });
  }

  private renderMessage(): void {
    const help = this.options.help ?? this.options.description;

    if (this.currentError) {
      this.messageElement.textContent = this.currentError;
      this.messageElement.className = 'ag-form-item__error';
      this.messageElement.style.display = 'block';
    } else if (help) {
      this.messageElement.textContent = help;
      this.messageElement.className = 'ag-form-item__hint';
      this.messageElement.style.display = 'block';
    } else {
      this.messageElement.textContent = '';
      this.messageElement.style.display = 'none';
    }
  }

  /**
   * Append a control (input/select/etc.) into this item's control slot.
   */
  appendControl(control: HTMLElement): void {
    this.controlElement.insertBefore(control, this.messageElement);
  }

  /**
   * Set the label text
   */
  setLabel(label: string): void {
    this.options.label = label;
    if (!this.labelElement) {
      this.labelElement = dom.createElement('label', {
        className: 'ag-form-item__label',
      });
      this.element.insertBefore(this.labelElement, this.controlElement);
    }
    this.labelElement.textContent = label;
  }

  /**
   * Set required state. Also updates the bound form's field config, if any.
   */
  setRequired(required: boolean): void {
    this.options.required = required;
    this.updateClasses();
    if (this.options.form && this.options.name) {
      this.options.form.registerField({
        name: this.options.name,
        required,
        ...this.options.fieldConfig,
      });
    }
  }

  /**
   * Set a static error message (bypasses the bound form, if any, until
   * the next form-driven update).
   */
  setError(error: string | null): void {
    this.currentError = error;
    this.updateClasses();
    this.renderMessage();
  }

  /**
   * Get the current error message, if any.
   */
  getError(): string | null {
    return this.currentError;
  }

  /**
   * Set the help/description text.
   */
  setHelp(help: string | null): void {
    this.options.help = help ?? undefined;
    this.renderMessage();
  }

  /**
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Get the control slot element (append your input/select/etc. here).
   */
  getControlElement(): HTMLDivElement {
    return this.controlElement;
  }

  /**
   * Destroy component: unsubscribes from the bound form and unregisters
   * the field so the form no longer validates or tracks it.
   */
  destroy(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    if (this.options.form && this.options.name) {
      this.options.form.unregisterField(this.options.name);
    }
  }
}

/**
 * Create a FormItem from scratch
 */
export function createFormItem(options: FormItemOptions = {}): FormItem {
  const container = dom.createElement('div', {
    className: 'ag-form-item',
  });

  const instance = new FormItem(container, options);
  return instance;
}
