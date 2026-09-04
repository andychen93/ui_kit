/**
 * InputNumber component with increment/decrement controls
 */

import { ComponentSize, ChangeHandler, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { inputNumberClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface InputNumberOptions {
  placeholder?: string;
  size?: ComponentSize;
  disabled?: boolean;
  error?: string;
  value?: number;
  readonly?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  onChange?: ChangeHandler<number>;
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
  className?: string;
}

export class InputNumber {
  private element: HTMLDivElement;
  private input: HTMLInputElement | null = null;
  private incrementButton: HTMLButtonElement | null = null;
  private decrementButton: HTMLButtonElement | null = null;
  private options: InputNumberOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: InputNumberOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      step: 1,
      precision: 2,
      size: 'md',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createDecrementButton();
    this.createInput();
    this.createIncrementButton();
    this.updateClasses();
    this.applyAttributes();
    this.bindEvents();
  }

  private createInput(): void {
    const input = dom.createElement('input', {
      className: 'ag-input',
      attributes: {
        type: 'number',
        placeholder: this.options.placeholder || '',
      },
    });
    this.element.appendChild(input);
    this.input = input;

    if (this.options.value !== undefined) {
      this.input.value = String(this.formatValue(this.options.value));
    }
  }

  private createIncrementButton(): void {
    const button = dom.createElement('button', {
      className: 'ag-input-number-btn ag-input-number-btn-up',
      attributes: {
        type: 'button',
        ariaLabel: 'Increment value',
      },
      innerHTML: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 4v16m-8-8h16"/></svg>',
    });
    this.element.appendChild(button);
    this.incrementButton = button;
  }

  private createDecrementButton(): void {
    const button = dom.createElement('button', {
      className: 'ag-input-number-btn ag-input-number-btn-down',
      attributes: {
        type: 'button',
        ariaLabel: 'Decrement value',
      },
      innerHTML: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M4 12h16m-8 8V4"/></svg>',
    });
    this.element.appendChild(button);
    this.decrementButton = button;
  }

  private updateClasses(): void {
    const classes = inputNumberClasses({
      size: this.options.size,
      disabled: this.options.disabled,
      error: !!this.options.error,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private applyAttributes(): void {
    if (!this.input) return;
    dom.setAttributes(this.input, {
      type: 'number',
      placeholder: this.options.placeholder || '',
      disabled: this.options.disabled ? 'disabled' : null,
      readonly: this.options.readonly ? 'readonly' : null,
      required: this.options.required ? 'required' : null,
      min: this.options.min !== undefined ? String(this.options.min) : null,
      max: this.options.max !== undefined ? String(this.options.max) : null,
      step: this.options.step !== undefined ? String(this.options.step) : null,
    });
  }

  private bindEvents(): void {
    if (!this.input) return;
    if (this.options.onChange) {
      this.eventManager.on(this.input, 'input', (e: Event) => {
        const value = this.parseValue((e.target as HTMLInputElement).value);
        this.options.onChange?.(value, e);
      });
    }

    if (this.options.onFocus) {
      this.eventManager.on(this.input, 'focus', this.options.onFocus);
    }

    if (this.options.onBlur) {
      this.eventManager.on(this.input, 'blur', (e) => {
        this.syncValue();
        this.options.onBlur?.(e as FocusEvent);
      });
    }

    if (this.incrementButton) {
      this.eventManager.on(this.incrementButton, 'click', () => this.increment());
    }

    if (this.decrementButton) {
      this.eventManager.on(this.decrementButton, 'click', () => this.decrement());
    }
  }

  /**
   * Increment value by step
   */
  increment(): void {
    if (this.options.disabled || !this.input) return;
    
    const currentValue = this.parseValue(this.input.value);
    const newValue = this.limitValue(currentValue + this.options.step!);
    this.setValue(newValue);
  }

  /**
   * Decrement value by step
   */
  decrement(): void {
    if (this.options.disabled || !this.input) return;
    
    const currentValue = this.parseValue(this.input.value);
    const newValue = this.limitValue(currentValue - this.options.step!);
    this.setValue(newValue);
  }

  /**
   * Limit value to min/max range
   */
  private limitValue(value: number): number {
    let result = value;
    if (this.options.min !== undefined && result < this.options.min) {
      result = this.options.min;
    }
    if (this.options.max !== undefined && result > this.options.max) {
      result = this.options.max;
    }
    return result;
  }

  /**
   * Format value for display
   */
  private formatValue(value: number): number {
    if (this.options.precision !== undefined) {
      return parseFloat(value.toFixed(this.options.precision));
    }
    return value;
  }

  /**
   * Parse string value to number
   */
  private parseValue(value: string): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Sync input value with current options
   */
  private syncValue(): void {
    if (!this.input) return;
    const currentValue = this.parseValue(this.input.value);
    const limitedValue = this.limitValue(currentValue);
    
    if (this.formatValue(limitedValue) !== this.parseValue(this.input.value)) {
      this.input.value = String(this.formatValue(limitedValue));
      this.triggerChange();
    }
  }

  /**
   * Set value
   */
  setValue(value: number | string): void {
    if (!this.input) return;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return;

    const limitedValue = this.limitValue(numValue);
    this.input.value = String(this.formatValue(limitedValue));
    this.triggerChange();
  }

  /**
   * Get value as number
   */
  getValue(): number {
    return this.input ? this.parseValue(this.input.value) : 0;
  }

  /**
   * Clear value
   */
  clear(): void {
    if (this.input) {
      this.input.value = '';
      this.triggerChange();
    }
  }

  /**
   * Set placeholder text
   */
  setPlaceholder(placeholder: string): void {
    this.options.placeholder = placeholder;
    if (this.input) {
      this.input.placeholder = placeholder;
    }
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    if (this.input) {
      dom.setAttributes(this.input, {
        disabled: disabled ? 'disabled' : null,
      });
    }
    if (this.incrementButton) {
      this.incrementButton.disabled = disabled;
    }
    if (this.decrementButton) {
      this.decrementButton.disabled = disabled;
    }
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
    dom.setAttributes(this.input, {
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
    this.input?.focus();
  }

  /**
   * Blur input
   */
  blur(): void {
    this.input?.blur();
  }

  /**
   * Validate value
   */
  validate(): boolean {
    return this.input?.checkValidity() ?? false;
  }

  /**
   * Get validation error message
   */
  getValidationMessage(): string {
    return this.input?.validationMessage ?? '';
  }

  /**
   * Trigger change event manually
   */
  private triggerChange(): void {
    if (!this.input) return;
    const event = new Event('input', { bubbles: true });
    this.input.dispatchEvent(event);
  }

  /**
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy component and cleanup
   */
  destroy(): void {
    this.eventManager.removeAll();
    if (this.input) {
      this.input.remove();
    }
    if (this.incrementButton) {
      this.incrementButton.remove();
    }
    if (this.decrementButton) {
      this.decrementButton.remove();
    }
    this.element.remove();
  }
}

/**
 * Create input number from scratch
 */
export function createInputNumber(options: InputNumberOptions = {}): InputNumber {
  const container = dom.createElement('div', {
    className: 'ag-input-number',
    attributes: {
      role: 'group',
    },
  });

  const instance = new InputNumber(container, options);
  return instance;
}
