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
   * Get all form values
   */
  getValue(): Record<string, any> {
    const data: Record<string, any> = {};

    Array.from(this.element.elements).forEach((element) => {
      if (element instanceof HTMLInputElement || 
          element instanceof HTMLSelectElement || 
          element instanceof HTMLTextAreaElement) {
        const name = element.name;
        if (name) {
          data[name] = dom.getValue(element);
        }
      }
    });

    return data;
  }

  /**
   * Set form values
   */
  setValue(data: Record<string, any>): void {
    Object.entries(data).forEach(([name, value]) => {
      const input = Array.from(this.element.elements).find(
        el => (el as any).name === name
      ) as HTMLFormElement | undefined;
      if (input) {
        dom.setValue(input, value);
      }
    });
  }

  /**
   * Get field error
   */
  getError(fieldName: string): string | undefined {
    return this.errors.get(fieldName);
  }

  /**
   * Set field error
   */
  setError(fieldName: string, error: string | null): void {
    if (error) {
      this.errors.set(fieldName, error);
    } else {
      this.errors.delete(fieldName);
    }
  }

  /**
   * Validate entire form
   */
  validate(): boolean {
    this.errors.clear();
    let isValid = true;

    this.fields.forEach((field, name) => {
      const input = Array.from(this.element.elements).find(
        el => (el as any).name === name
      ) as HTMLFormElement | undefined;
      if (!input) return;

      const value = dom.getValue(input);
      const error = this.validateField(field, value);

      if (error) {
        this.errors.set(name, error);
        isValid = false;
      }
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
   * Clear all errors
   */
  clearErrors(): void {
    this.errors.clear();
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
