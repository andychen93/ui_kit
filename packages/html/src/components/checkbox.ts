/**
 * Checkbox component
 */

import { ChangeHandler, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { checkboxClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface CheckboxOptions {
  disabled?: boolean;
  error?: string;
  checked?: boolean;
  label?: string;
  value?: string;
  required?: boolean;
  onChange?: ChangeHandler<boolean>;
  className?: string;
}

export class Checkbox {
  private element: HTMLInputElement;
  private wrapper: HTMLLabelElement | null = null;
  private options: CheckboxOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLInputElement | string,
    options: CheckboxOptions = {}
  ) {
    this.element = dom.getElement<HTMLInputElement>(element);
    this.options = options;
    this.init();
  }

  private init(): void {
    // Ensure it's a checkbox input
    if (this.element.type !== 'checkbox') {
      this.element.type = 'checkbox';
    }

    this.updateClasses();
    this.applyAttributes();
    this.bindEvents();
  }

  private updateClasses(): void {
    const classes = checkboxClasses({
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
      value: this.options.value || null,
    });

    if (this.options.checked !== undefined) {
      this.element.checked = this.options.checked;
    }
  }

  private bindEvents(): void {
    if (this.options.onChange) {
      this.eventManager.on(this.element, 'change', (e: Event) => {
        const checked = (e.target as HTMLInputElement).checked;
        this.options.onChange?.(checked, e);
      });
    }
  }

  /**
   * Get checkbox checked state
   */
  isChecked(): boolean {
    return this.element.checked;
  }

  /**
   * Set checkbox checked state
   */
  setChecked(checked: boolean): void {
    this.element.checked = checked;
    this.triggerChange();
  }

  /**
   * Toggle checkbox state
   */
  toggle(): void {
    this.element.checked = !this.element.checked;
    this.triggerChange();
  }

  /**
   * Get checkbox value
   */
  getValue(): string {
    return this.element.value || 'on';
  }

  /**
   * Set checkbox value
   */
  setValue(value: string): void {
    this.options.value = value;
    this.element.value = value;
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
   * Check if checkbox is disabled
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
   * Set label text
   */
  setLabel(label: string): void {
    this.options.label = label;
    if (this.wrapper) {
      this.wrapper.textContent = label;
    }
  }

  /**
   * Get label text
   */
  getLabel(): string | undefined {
    return this.options.label;
  }

  /**
   * Create wrapper with label
   */
  createWithLabel(): HTMLLabelElement {
    if (this.wrapper) {
      return this.wrapper;
    }

    this.wrapper = dom.createElement('label', {
      className: 'ag-checkbox-wrapper',
    });

    this.wrapper.appendChild(this.element);

    if (this.options.label) {
      const labelText = document.createTextNode(this.options.label);
      this.wrapper.appendChild(labelText);
    }

    return this.wrapper;
  }

  /**
   * Focus checkbox
   */
  focus(): void {
    this.element.focus();
  }

  /**
   * Blur checkbox
   */
  blur(): void {
    this.element.blur();
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
  getElement(): HTMLInputElement {
    return this.element;
  }

  /**
   * Get wrapper element
   */
  getWrapper(): HTMLLabelElement | null {
    return this.wrapper;
  }

  /**
   * Destroy component and cleanup
   */
  destroy(): void {
    this.eventManager.removeAll();
  }
}

/**
 * Create checkbox from scratch
 */
export function createCheckbox(options: CheckboxOptions = {}): Checkbox {
  const input = dom.createElement('input', {
    className: checkboxClasses(options),
    attributes: {
      type: 'checkbox',
    },
  });

  const instance = new Checkbox(input, options);
  return instance;
}
