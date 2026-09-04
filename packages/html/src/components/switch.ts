/**
 * Switch component
 */

import { ComponentSize, ChangeHandler } from '../types/index';
import * as dom from '../utils/dom';
import { switchClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface SwitchOptions {
  size?: ComponentSize;
  disabled?: boolean;
  checked?: boolean;
  loading?: boolean;
  onChange?: ChangeHandler<boolean>;
  className?: string;
}

export class Switch {
  private element: HTMLDivElement;
  private switchButton: HTMLDivElement;
  private input: HTMLInputElement;
  private options: SwitchOptions;
  private eventManager = new EventManager();
  private checked: boolean;

  constructor(
    element: HTMLDivElement | string,
    options: SwitchOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      size: 'md',
      checked: false,
      ...options,
    };
    this.checked = this.options.checked ?? false;

    // Both created synchronously below; declared without `| null` since
    // every code path guarantees assignment before use.
    this.input = this.createInput();
    this.switchButton = this.createSwitchButton();
    this.updateClasses();
    this.bindEvents();
  }

  private createInput(): HTMLInputElement {
    const input = dom.createElement('input', {
      className: 'ag-switch-input',
      attributes: { type: 'hidden' },
    });
    input.value = String(this.checked);
    this.element.appendChild(input);
    return input;
  }

  private createSwitchButton(): HTMLDivElement {
    const switchButton = dom.createElement('div', {
      className: this.checked ? 'ag-switch-button ag-switch-button--checked' : 'ag-switch-button',
      attributes: {
        role: 'switch',
        'aria-checked': String(this.checked),
      },
    });

    const knob = dom.createElement('div', {
      className: 'ag-switch-knob',
    });
    switchButton.appendChild(knob);
    this.element.appendChild(switchButton);
    return switchButton;
  }

  private updateClasses(): void {
    const classes = switchClasses({
      size: this.options.size,
      disabled: this.options.disabled,
      checked: this.checked,
      loading: this.options.loading,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private bindEvents(): void {
    this.eventManager.on(this.switchButton, 'click', () => {
      if (this.options.disabled || this.options.loading) return;
      this.toggle();
    });
  }

  /**
   * Toggle switch state
   */
  toggle(): void {
    if (this.options.disabled || this.options.loading) return;
    this.setValue(!this.checked);
  }

  /**
   * Set switch value
   */
  setValue(value: boolean): void {
    if (this.options.disabled || this.options.loading) return;

    this.checked = value;
    this.options.checked = value;
    this.input.value = String(value);

    this.switchButton.setAttribute('aria-checked', String(value));
    this.switchButton.classList.toggle('ag-switch-button--checked', value);

    this.triggerChange();
  }

  /**
   * Get switch value
   */
  getValue(): boolean {
    return this.checked;
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.updateClasses();
  }

  /**
   * Check if switch is disabled
   */
  isDisabled(): boolean {
    return this.options.disabled ?? false;
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.options.loading = loading;
    this.updateClasses();
  }

  /**
   * Check if switch is loading
   */
  isLoading(): boolean {
    return this.options.loading ?? false;
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
   * Trigger change event manually
   */
  private triggerChange(): void {
    const event = new Event('change', { bubbles: true });
    this.input.dispatchEvent(event);
    this.options.onChange?.(this.checked, event);
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
    this.input.remove();
    this.switchButton.remove();
    this.element.remove();
  }
}

/**
 * Create switch from scratch
 */
export function createSwitch(options: SwitchOptions = {}): Switch {
  const container = dom.createElement('div', {
    className: 'ag-switch',
    attributes: {
      role: 'group',
    },
  });

  const instance = new Switch(container, options);
  return instance;
}
