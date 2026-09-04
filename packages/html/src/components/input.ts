/**
 * Input component
 */

import { ComponentSize, ChangeHandler, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { inputClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface InputOptions {
  type?: string;
  placeholder?: string;
  size?: ComponentSize;
  disabled?: boolean;
  error?: string;
  value?: string;
  readonly?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  onChange?: ChangeHandler<string>;
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
  className?: string;
}

export class Input {
  private element: HTMLInputElement;
  private options: InputOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLInputElement | string,
    options: InputOptions = {}
  ) {
    this.element = dom.getElement<HTMLInputElement>(element);
    this.options = {
      type: 'text',
      size: 'md',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.applyAttributes();
    this.bindEvents();
  }

  private updateClasses(): void {
    const classes = inputClasses({
      size: this.options.size,
      disabled: this.options.disabled,
      error: !!this.options.error,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private applyAttributes(): void {
    dom.setAttributes(this.element, {
      type: this.options.type || 'text',
      placeholder: this.options.placeholder || '',
      disabled: this.options.disabled ? 'disabled' : null,
      readonly: this.options.readonly ? 'readonly' : null,
      required: this.options.required ? 'required' : null,
      maxlength: this.options.maxLength ? String(this.options.maxLength) : null,
      minlength: this.options.minLength ? String(this.options.minLength) : null,
      pattern: this.options.pattern || null,
    });

    if (this.options.value) {
      this.element.value = this.options.value;
    }
  }

  private bindEvents(): void {
    if (this.options.onChange) {
      this.eventManager.on(this.element, 'input', (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        this.options.onChange?.(value, e);
      });
    }

    if (this.options.onFocus) {
      this.eventManager.on(this.element, 'focus', this.options.onFocus);
    }

    if (this.options.onBlur) {
      this.eventManager.on(this.element, 'blur', this.options.onBlur);
    }
  }

  /**
   * Get input value
   */
  getValue(): string {
    return this.element.value;
  }

  /**
   * Set input value
   */
  setValue(value: string): void {
    this.element.value = value;
    this.triggerChange();
  }

  /**
   * Clear input value
   */
  clear(): void {
    this.element.value = '';
    this.triggerChange();
  }

  /**
   * Set placeholder text
   */
  setPlaceholder(placeholder: string): void {
    this.options.placeholder = placeholder;
    this.element.placeholder = placeholder;
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    dom.setAttributes(this.element, {
      disabled: disabled ? 'disabled' : null,
    });
    this.updateClasses();
  }

  /**
   * Check if input is disabled
   */
  isDisabled(): boolean {
    return this.options.disabled || false;
  }

  /**
   * Set readonly state
   */
  setReadonly(readonly: boolean): void {
    this.options.readonly = readonly;
    dom.setAttributes(this.element, {
      readonly: readonly ? 'readonly' : null,
    });
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.options.error = error || undefined;
    this.updateClasses();
  }

  /**
   * Get error message
   */
  getError(): string | undefined {
    return this.options.error;
  }

  /**
   * Set input size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
  }

  /**
   * Get input size
   */
  getSize(): ComponentSize {
    return this.options.size || 'md';
  }

  /**
   * Focus input
   */
  focus(): void {
    this.element.focus();
  }

  /**
   * Blur input
   */
  blur(): void {
    this.element.blur();
  }

  /**
   * Select all text in input
   */
  select(): void {
    this.element.select();
  }

  /**
   * Validate input value
   */
  validate(): boolean {
    return this.element.checkValidity();
  }

  /**
   * Get validation error message
   */
  getValidationMessage(): string {
    return this.element.validationMessage;
  }

  /**
   * Trigger change event manually
   */
  private triggerChange(): void {
    const event = new Event('input', { bubbles: true });
    this.element.dispatchEvent(event);
  }

  /**
   * Get native element
   */
  getElement(): HTMLInputElement {
    return this.element;
  }

  /**
   * Destroy component and cleanup
   */
  destroy(): void {
    this.eventManager.removeAll();
  }
}

/**
 * Create input from scratch
 */
export function createInput(options: InputOptions = {}): Input {
  const classes = inputClasses(options);
  const input = dom.createElement('input', {
    className: classes,
    attributes: {
      type: options.type || 'text',
      placeholder: options.placeholder || '',
    },
  });

  const instance = new Input(input, options);
  return instance;
}
