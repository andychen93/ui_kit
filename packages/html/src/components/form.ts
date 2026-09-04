/**
 * Form component with validation
 */

import { ChangeHandler } from '../types/index';
import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface FormFieldConfig {
  name: string;
  required?: boolean;
  type?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  validate?: (value: any) => string | null;
}

export interface FormOptions {
  fields?: FormFieldConfig[];
  onSubmit?: (data: Record<string, any>) => void;
  onChange?: ChangeHandler<Record<string, any>>;
}

export class Form {
  private element: HTMLFormElement;
  private options: FormOptions;
  private fields: Map<string, FormFieldConfig> = new Map();
  private errors: Map<string, string> = new Map();
  private eventManager = new EventManager();
  private errorListeners: Map<string, Set<(error: string | null) => void>> = new Map();

  constructor(
    element: HTMLFormElement | string,
    options: FormOptions = {}
  ) {
    this.element = dom.getElement<HTMLFormElement>(element);
    this.options = options;
    this.init();
  }

  private init(): void {
    if (this.options.fields) {
      this.options.fields.forEach(field => {
        this.fields.set(field.name, field);
      });
    }
    this.bindEvents();
  }

  private bindEvents(): void {
    this.eventManager.on(this.element, 'submit', (e) => {
      e.preventDefault();
      const valid = this.validate();
      if (valid && this.options.onSubmit) {
        this.options.onSubmit(this.getValue());
      }
    });

    this.eventManager.on(this.element, 'change', () => {
      if (this.options.onChange) {
        this.options.onChange(this.getValue(), new Event('change'));
      }
    });
  }

  /**
   * Add field config
   */
  addField(config: FormFieldConfig): void {
    this.fields.set(config.name, config);
  }

  /**
   * Get all form values with proper radio/checkbox group handling
   */
  getValue(): Record<string, any> {
    return dom.getFormValues(this.element);
  }

  /**
   * Set form values with proper radio/checkbox group handling
   */
  setValue(data: Record<string, any>): void {
    dom.setFormValues(this.element, data);
  }

  /**
   * Get field error
   */
  getError(fieldName: string): string | undefined {
    return this.errors.get(fieldName);
  }

  /**
   * Set field error and notify any FormItem subscribed to this field.
   */
  setError(fieldName: string, error: string | null): void {
    if (error) {
      this.errors.set(fieldName, error);
    } else {
      this.errors.delete(fieldName);
    }
    this.errorListeners.get(fieldName)?.forEach((listener) => listener(error));
  }

  /**
   * Register a field with the form (used by FormItem to declare validation
   * rules for a control it wraps).
   */
  registerField(config: FormFieldConfig): void {
    this.fields.set(config.name, config);
  }

  /**
   * Unregister a field (used by FormItem.destroy()).
   */
  unregisterField(name: string): void {
    this.fields.delete(name);
    this.errors.delete(name);
    this.errorListeners.delete(name);
  }

  /**
   * Subscribe to error changes for a specific field. Returns an
   * unsubscribe function. Used by FormItem to reflect Form-level
   * validation errors without polling.
   */
  onFieldError(fieldName: string, listener: (error: string | null) => void): () => void {
    let set = this.errorListeners.get(fieldName);
    if (!set) {
      set = new Set();
      this.errorListeners.set(fieldName, set);
    }
    set.add(listener);
    return () => {
      set!.delete(listener);
    };
  }

  /**
   * Validate entire form. Notifies any FormItem listeners for every
   * registered field (clearing errors for fields that now pass).
   */
  validate(): boolean {
    let isValid = true;

    this.fields.forEach((field, name) => {
      const input = Array.from(this.element.elements).find(
        el => (el as any).name === name
      ) as HTMLFormElement | undefined;

      const value = input ? dom.getValue(input) : undefined;
      const error = input ? this.validateField(field, value) : null;

      if (error) {
        isValid = false;
      }
      this.setError(name, error);
    });

    return isValid;
  }

  /**
   * Validate single field
   */
  private validateField(field: FormFieldConfig, value: any): string | null {
    const stringValue = String(value || '');

    if (field.required && !stringValue) {
      return `${field.name} is required`;
    }

    if (field.minLength && stringValue.length < field.minLength) {
      return `${field.name} must be at least ${field.minLength} characters`;
    }

    if (field.maxLength && stringValue.length > field.maxLength) {
      return `${field.name} must be at most ${field.maxLength} characters`;
    }

    if (field.pattern && !new RegExp(field.pattern).test(stringValue)) {
      return `${field.name} is invalid`;
    }

    if (field.validate) {
      return field.validate(value);
    }

    return null;
  }

  /**
   * Get all errors
   */
  getErrors(): Record<string, string> {
    const result: Record<string, string> = {};
    this.errors.forEach((error, name) => {
      result[name] = error;
    });
    return result;
  }

  /**
   * Clear all errors and notify any FormItem listeners.
   */
  clearErrors(): void {
    const names = Array.from(this.errors.keys());
    this.errors.clear();
    names.forEach((name) => {
      this.errorListeners.get(name)?.forEach((listener) => listener(null));
    });
  }

  /**
   * Reset form
   */
  reset(): void {
    this.element.reset();
    this.clearErrors();
  }

  /**
   * Submit form programmatically
   */
  submit(): void {
    if (this.validate() && this.options.onSubmit) {
      this.options.onSubmit(this.getValue());
    }
  }

  /**
   * Get native element
   */
  getElement(): HTMLFormElement {
    return this.element;
  }

  /**
   * Destroy component
   */
  destroy(): void {
    this.eventManager.removeAll();
    this.fields.clear();
    this.errors.clear();
    this.errorListeners.clear();
  }
}

/**
 * Create form from scratch
 */
export function createForm(options: FormOptions = {}): Form {
  const form = dom.createElement('form', {
    className: 'ag-form',
  });

  const instance = new Form(form, options);
  return instance;
}
