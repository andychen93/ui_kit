/**
 * Textarea component
 */

import { ComponentSize, ChangeHandler, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { textareaClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface TextareaOptions {
  placeholder?: string;
  size?: ComponentSize;
  disabled?: boolean;
  error?: string;
  value?: string;
  readonly?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  onChange?: ChangeHandler<string>;
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
  className?: string;
}

export class Textarea {
  private element: HTMLTextAreaElement;
  private options: TextareaOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLTextAreaElement | string,
    options: TextareaOptions = {}
  ) {
    this.element = dom.getElement<HTMLTextAreaElement>(element);
    this.options = {
      size: 'md',
      rows: 3,
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
    const classes = textareaClasses({
      size: this.options.size,
      disabled: this.options.disabled,
      error: !!this.options.error,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  private applyAttributes(): void {
    dom.setAttributes(this.element, {
      placeholder: this.options.placeholder || '',
      disabled: this.options.disabled ? 'disabled' : null,
      readonly: this.options.readonly ? 'readonly' : null,
      required: this.options.required ? 'required' : null,
      maxlength: this.options.maxLength ? String(this.options.maxLength) : null,
      minlength: this.options.minLength ? String(this.options.minLength) : null,
      rows: this.options.rows ? String(this.options.rows) : null,
    });

    if (this.options.value) {
      this.element.value = this.options.value;
    }

    if (this.options.autoSize && typeof this.options.autoSize === 'object') {
      this.element.dataset.minRows = String(this.options.autoSize.minRows || 1);
      this.element.dataset.maxRows = String(this.options.autoSize.maxRows || 10);
    } else if (this.options.autoSize === true) {
      this.element.dataset.autoSize = 'true';
    }
  }

  private bindEvents(): void {
    if (this.options.onChange) {
      this.eventManager.on(this.element, 'input', (e: Event) => {
        const value = (e.target as HTMLTextAreaElement).value;
        this.options.onChange?.(value, e);
      });
    }

    if (this.options.onFocus) {
      this.eventManager.on(this.element, 'focus', this.options.onFocus);
    }

    if (this.options.onBlur) {
      this.eventManager.on(this.element, 'blur', this.options.onBlur);
    }

    if (this.options.autoSize) {
      this.eventManager.on(this.element, 'input', () => this.autoSize());
      setTimeout(() => this.autoSize(), 0);
    }
  }

  /**
   * Auto-size textarea based on content
   */
  private autoSize(): void {
    if (!this.options.autoSize) return;

    this.element.style.height = 'auto';
    const minRows = this.options.autoSize === true
      ? 1
      : this.options.autoSize.minRows || 1;
    const maxRows = this.options.autoSize === true
      ? Infinity
      : this.options.autoSize.maxRows || Infinity;

    const rows = Math.min(
      maxRows,
      Math.max(minRows, Math.floor(this.element.scrollHeight / 20))
    );

    this.element.style.height = `${Math.max(minRows, rows) * 20}px`;
  }

  /**
   * Get textarea value
   */
  getValue(): string {
    return this.element.value;
  }

  /**
   * Set textarea value
   */
  setValue(value: string): void {
    this.element.value = value;
    this.triggerChange();
    if (this.options.autoSize) {
      this.autoSize();
    }
  }

  /**
   * Clear textarea value
   */
  clear(): void {
    this.element.value = '';
    this.triggerChange();
    if (this.options.autoSize) {
      this.autoSize();
    }
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
   * Check if textarea is disabled
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
   * Set textarea size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
  }

  /**
   * Get textarea size
   */
  getSize(): ComponentSize {
    return this.options.size || 'md';
  }

  /**
   * Focus textarea
   */
  focus(): void {
    this.element.focus();
  }

  /**
   * Blur textarea
   */
  blur(): void {
    this.element.blur();
  }

  /**
   * Validate textarea value
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
  getElement(): HTMLTextAreaElement {
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
 * Create textarea from scratch
 */
export function createTextarea(options: TextareaOptions = {}): Textarea {
  const classes = textareaClasses(options);
  const textarea = dom.createElement('textarea', {
    className: classes,
    attributes: {
      placeholder: options.placeholder || '',
    },
  });

  const instance = new Textarea(textarea, options);
  return instance;
}
