/**
 * Password component with toggle visibility
 */

import { ComponentSize, ChangeHandler, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { passwordClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface PasswordOptions {
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
  toggleVisible?: boolean;
  onChange?: ChangeHandler<string>;
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
  className?: string;
}

export class Password {
  private element: HTMLDivElement;
  private input: HTMLInputElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;
  private options: PasswordOptions;
  private visible: boolean = false;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: PasswordOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      toggleVisible: true,
      size: 'md',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createInput();
    this.createToggleButton();
    this.updateClasses();
    this.applyAttributes();
    this.bindEvents();
  }

  private createInput(): void {
    const input = dom.createElement('input', {
      className: 'ag-input',
      attributes: {
        type: this.visible ? 'text' : 'password',
        placeholder: this.options.placeholder || '',
      },
    });
    this.element.appendChild(input);
    this.input = input;

    if (this.options.value) {
      this.input.value = this.options.value;
    }
  }

  private createToggleButton(): void {
    if (!this.options.toggleVisible) {
      return;
    }

    const toggleButton = dom.createElement('button', {
      className: 'ag-password-toggle',
      attributes: {
        type: 'button',
        ariaLabel: 'Toggle password visibility',
      },
    });
    toggleButton.innerHTML = this.visible
      ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';
    this.element.appendChild(toggleButton);
    this.toggleButton = toggleButton;
  }

  private updateClasses(): void {
    const classes = passwordClasses({
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
      type: this.visible ? 'text' : 'password',
      placeholder: this.options.placeholder || '',
      disabled: this.options.disabled ? 'disabled' : null,
      readonly: this.options.readonly ? 'readonly' : null,
      required: this.options.required ? 'required' : null,
      maxlength: this.options.maxLength ? String(this.options.maxLength) : null,
      minlength: this.options.minLength ? String(this.options.minLength) : null,
      pattern: this.options.pattern || null,
    });
  }

  private bindEvents(): void {
    if (!this.input) return;
    if (this.options.onChange) {
      this.eventManager.on(this.input, 'input', (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        this.options.onChange?.(value, e);
      });
    }

    if (this.options.onFocus) {
      this.eventManager.on(this.input, 'focus', this.options.onFocus);
    }

    if (this.options.onBlur) {
      this.eventManager.on(this.input, 'blur', this.options.onBlur);
    }

    if (this.toggleButton) {
      this.eventManager.on(this.toggleButton, 'click', () => {
        this.toggleVisibility();
      });
    }
  }

  /**
   * Toggle password visibility
   */
  toggleVisibility(): void {
    this.visible = !this.visible;
    if (this.input) this.input.type = this.visible ? 'text' : 'password';
    if (this.toggleButton) {
      this.toggleButton.innerHTML = this.visible
        ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>'
        : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';
    }
  }

  /**
   * Set password visibility
   */
  setVisible(visible: boolean): void {
    if (this.visible === visible) return;
    this.visible = visible;
    if (this.input) this.input.type = visible ? 'text' : 'password';
    if (this.toggleButton) {
      this.toggleButton.innerHTML = visible
        ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>'
        : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';
    }
  }

  /**
   * Check if password is visible
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * Get password value
   */
  getValue(): string {
    return this.input?.value ?? '';
  }

  /**
   * Set password value
   */
  setValue(value: string): void {
    if (this.input) {
      this.input.value = value;
      this.triggerChange();
    }
  }

  /**
   * Clear password value
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
    if (this.input) this.input.placeholder = placeholder;
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
    this.updateClasses();
  }

  /**
   * Check if password is disabled
   */
  isDisabled(): boolean {
    return this.options.disabled || false;
  }

  /**
   * Set readonly state
   */
  setReadonly(readonly: boolean): void {
    this.options.readonly = readonly;
    if (this.input) {
      dom.setAttributes(this.input, {
        readonly: readonly ? 'readonly' : null,
      });
    }
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
   * Focus password input
   */
  focus(): void {
    this.input?.focus();
  }

  /**
   * Blur password input
   */
  blur(): void {
    this.input?.blur();
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
    if (this.toggleButton) {
      this.toggleButton.remove();
      this.toggleButton = null;
    }
    this.element.remove();
  }
}

/**
 * Create password from scratch
 */
export function createPassword(options: PasswordOptions = {}): Password {
  const container = dom.createElement('div', {
    className: 'ag-password',
    attributes: {
      role: 'group',
    },
  });

  const instance = new Password(container, options);
  return instance;
}
