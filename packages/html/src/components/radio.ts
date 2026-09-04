/**
 * Radio component
 */

import { ChangeHandler, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { radioClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface RadioOptions {
  disabled?: boolean;
  error?: string;
  checked?: boolean;
  label?: string;
  value?: string;
  required?: boolean;
  name?: string;
  onChange?: ChangeHandler<string>;
  className?: string;
}

export class Radio {
  private element: HTMLInputElement;
  private wrapper: HTMLLabelElement | null = null;
  private options: RadioOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLInputElement | string,
    options: RadioOptions = {}
  ) {
    this.element = dom.getElement<HTMLInputElement>(element);
    this.options = options;
    this.init();
  }

  private init(): void {
    // Ensure it's a radio input
    if (this.element.type !== 'radio') {
      this.element.type = 'radio';
    }

    this.updateClasses();
    this.applyAttributes();
    this.bindEvents();
  }

  private updateClasses(): void {
    const classes = radioClasses({
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
      value: this.options.value || '',
      name: this.options.name || '',
    });

    if (this.options.checked !== undefined) {
      this.element.checked = this.options.checked;
    }
  }

  private bindEvents(): void {
    if (this.options.onChange) {
      this.eventManager.on(this.element, 'change', (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        this.options.onChange?.(value, e);
      });
    }
  }

  /**
   * Get radio checked state
   */
  isChecked(): boolean {
    return this.element.checked;
  }

  /**
   * Set radio checked state
   */
  setChecked(checked: boolean): void {
    this.element.checked = checked;
    if (checked) {
      this.triggerChange();
    }
  }

  /**
   * Get radio value
   */
  getValue(): string {
    return this.element.value;
  }

  /**
   * Set radio value
   */
  setValue(value: string): void {
    this.options.value = value;
    this.element.value = value;
  }

  /**
   * Get radio name
   */
  getName(): string {
    return this.element.name;
  }

  /**
   * Set radio name
   */
  setName(name: string): void {
    this.options.name = name;
    this.element.name = name;
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
   * Check if radio is disabled
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
      className: 'ag-radio-wrapper',
    });

    this.wrapper.appendChild(this.element);

    if (this.options.label) {
      const labelText = document.createTextNode(this.options.label);
      this.wrapper.appendChild(labelText);
    }

    return this.wrapper;
  }

  /**
   * Focus radio
   */
  focus(): void {
    this.element.focus();
  }

  /**
   * Blur radio
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
 * Radio group component
 */
export interface RadioGroupOptions {
  name: string;
  options: Array<{ label: string; value: string }>;
  disabled?: boolean;
  error?: string;
  value?: string;
  vertical?: boolean;
  onChange?: ChangeHandler<string>;
  className?: string;
}

export class RadioGroup {
  private element: HTMLDivElement;
  private options: RadioGroupOptions;
  private radios: Map<string, Radio> = new Map();
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: RadioGroupOptions
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = options;
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.renderRadios();
  }

  private updateClasses(): void {
    const classes = ['ag-radio-group'];
    if (this.options.vertical) {
      classes.push('ag-radio-group--vertical');
    }
    if (this.options.className) {
      classes.push(this.options.className);
    }
    this.element.className = classes.join(' ');
  }

  private renderRadios(): void {
    this.radios.forEach(radio => radio.destroy());
    this.radios.clear();
    this.element.innerHTML = '';

    this.options.options.forEach(option => {
      const radio = createRadio({
        name: this.options.name,
        value: option.value,
        label: option.label,
        disabled: this.options.disabled,
        checked: option.value === this.options.value,
        onChange: (value) => {
          this.options.onChange?.(value, new Event('change'));
        },
      });

      const wrapper = radio.createWithLabel();
      this.element.appendChild(wrapper);
      this.radios.set(option.value, radio);
    });
  }

  /**
   * Get selected value
   */
  getValue(): string | undefined {
    for (const [value, radio] of this.radios) {
      if (radio.isChecked()) {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Set selected value
   */
  setValue(value: string): void {
    this.radios.forEach((radio, radioValue) => {
      radio.setChecked(radioValue === value);
    });
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.radios.forEach(radio => radio.setDisabled(disabled));
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.options.error = error || undefined;
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
    this.radios.forEach(radio => radio.destroy());
    this.radios.clear();
    this.eventManager.removeAll();
  }
}

/**
 * Create radio from scratch
 */
export function createRadio(options: RadioOptions = {}): Radio {
  const input = dom.createElement('input', {
    className: radioClasses(options),
    attributes: {
      type: 'radio',
    },
  });

  const instance = new Radio(input, options);
  return instance;
}

/**
 * Create radio group from scratch
 */
export function createRadioGroup(options: RadioGroupOptions): RadioGroup {
  const div = dom.createElement('div', {
    className: 'ag-radio-group',
  });

  const instance = new RadioGroup(div, options);
  return instance;
}
