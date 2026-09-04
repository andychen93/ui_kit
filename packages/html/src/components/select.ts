/**
 * Select component
 */

import { ComponentSize, ChangeHandler } from '../types/index';
import * as dom from '../utils/dom';
import { selectClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectOptions {
  size?: ComponentSize;
  disabled?: boolean;
  error?: string;
  options?: SelectOption[];
  value?: string;
  placeholder?: string;
  multiple?: boolean;
  required?: boolean;
  onChange?: ChangeHandler<string | string[]>;
  className?: string;
}

export class Select {
  private element: HTMLSelectElement;
  private options: SelectOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLSelectElement | string,
    options: SelectOptions = {}
  ) {
    this.element = dom.getElement<HTMLSelectElement>(element);
    this.options = {
      size: 'md',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.applyAttributes();
    if (this.options.options) {
      this.renderOptions(this.options.options);
    }
    this.bindEvents();
  }

  private updateClasses(): void {
    const classes = selectClasses({
      size: this.options.size,
      disabled: this.options.disabled,
      error: !!this.options.error,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private applyAttributes(): void {
    dom.setAttributes(this.element, {
      disabled: this.options.disabled ? 'disabled' : null,
      required: this.options.required ? 'required' : null,
      multiple: this.options.multiple ? 'multiple' : null,
    });
  }

  private renderOptions(options: SelectOption[]): void {
    this.element.innerHTML = '';

    // Add placeholder option if specified
    if (this.options.placeholder && !this.options.multiple) {
      const placeholder = dom.createElement('option', {
        attributes: {
          value: '',
          disabled: 'disabled',
          selected: this.options.value === '' ? 'selected' : undefined,
        },
        textContent: this.options.placeholder,
      });
      this.element.appendChild(placeholder);
    }

    // Add options
    options.forEach(option => {
      const optElement = dom.createElement('option', {
        attributes: {
          value: option.value,
          disabled: option.disabled ? 'disabled' : undefined,
          selected: this.isSelected(option.value) ? 'selected' : undefined,
        },
        textContent: option.label,
      });
      this.element.appendChild(optElement);
    });
  }

  private isSelected(value: string): boolean {
    if (Array.isArray(this.options.value)) {
      return this.options.value.includes(value);
    }
    return this.options.value === value;
  }

  private bindEvents(): void {
    if (this.options.onChange) {
      this.eventManager.on(this.element, 'change', (e: Event) => {
        const value = this.getValue();
        this.options.onChange?.(value, e);
      });
    }
  }

  /**
   * Get selected value(s)
   */
  getValue(): string | string[] {
    if (this.element.multiple) {
      return Array.from(this.element.selectedOptions).map(o => o.value);
    }
    return this.element.value;
  }

  /**
   * Set selected value(s)
   */
  setValue(value: string | string[]): void {
    if (Array.isArray(value)) {
      Array.from(this.element.options).forEach(option => {
        option.selected = value.includes(option.value);
      });
    } else {
      this.element.value = value;
    }
    this.triggerChange();
  }

  /**
   * Add option to select
   */
  addOption(option: SelectOption): void {
    const optElement = dom.createElement('option', {
      attributes: {
        value: option.value,
        disabled: option.disabled ? 'disabled' : undefined,
      },
      textContent: option.label,
    });
    this.element.appendChild(optElement);
  }

  /**
   * Remove option by value
   */
  removeOption(value: string): void {
    const option = Array.from(this.element.options).find(o => o.value === value);
    if (option) {
      option.remove();
    }
  }

  /**
   * Clear all options
   */
  clearOptions(): void {
    this.element.innerHTML = '';
  }

  /**
   * Set options
   */
  setOptions(options: SelectOption[]): void {
    this.options.options = options;
    this.renderOptions(options);
  }

  /**
   * Get all options
   */
  getOptions(): SelectOption[] {
    return Array.from(this.element.options).map(option => ({
      label: option.text,
      value: option.value,
      disabled: option.disabled,
    }));
  }

  /**
   * Set placeholder
   */
  setPlaceholder(placeholder: string): void {
    this.options.placeholder = placeholder;
    if (this.options.options) {
      this.renderOptions(this.options.options);
    }
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
   * Check if select is disabled
   */
  isDisabled(): boolean {
    return this.options.disabled || false;
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
   * Set size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
  }

  /**
   * Get size
   */
  getSize(): ComponentSize {
    return this.options.size || 'md';
  }

  /**
   * Focus select
   */
  focus(): void {
    this.element.focus();
  }

  /**
   * Blur select
   */
  blur(): void {
    this.element.blur();
  }

  /**
   * Validate select
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
    const event = new Event('change', { bubbles: true });
    this.element.dispatchEvent(event);
  }

  /**
   * Get native element
   */
  getElement(): HTMLSelectElement {
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
 * Create select from scratch
 */
export function createSelect(options: SelectOptions = {}): Select {
  const select = dom.createElement('select', {
    className: selectClasses(options),
    attributes: {
      multiple: options.multiple ? 'multiple' : undefined,
    },
  });

  const instance = new Select(select, options);
  return instance;
}
