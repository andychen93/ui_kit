/**
 * Button component
 */

import { ComponentSize, ComponentVariant, EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { buttonClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface ButtonOptions {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  onClick?: EventHandler<MouseEvent>;
  className?: string;
}

export class Button {
  private element: HTMLButtonElement;
  private options: ButtonOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLButtonElement | string,
    options: ButtonOptions = {}
  ) {
    this.element = dom.getElement<HTMLButtonElement>(element);
    this.options = {
      variant: 'primary',
      size: 'md',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.bindEvents();
  }

  private updateClasses(): void {
    const classes = buttonClasses({
      variant: this.options.variant,
      size: this.options.size,
      disabled: this.options.disabled,
      loading: this.options.loading,
      className: this.options.className,
    });
    this.element.className = classes;
    // Update disabled attribute
    if (this.options.disabled) {
      this.element.disabled = true;
    } else if (!this.options.loading) {
      this.element.disabled = false;
    }
  }

  private bindEvents(): void {
    if (this.options.onClick) {
      this.eventManager.on(this.element, 'click', this.options.onClick);
    }
  }

  /**
   * Set button text content
   */
  setText(text: string): void {
    this.element.textContent = text;
  }

  /**
   * Get button text content
   */
  getText(): string {
    return this.element.textContent || '';
  }

  /**
   * Set button disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.element.disabled = disabled;
    this.updateClasses();
  }

  /**
   * Check if button is disabled
   */
  isDisabled(): boolean {
    return this.options.disabled || false;
  }

  /**
   * Set button loading state
   */
  setLoading(loading: boolean): void {
    this.options.loading = loading;
    this.updateClasses();
    if (loading) {
      dom.disable(this.element);
    } else {
      if (!this.options.disabled) {
        dom.enable(this.element);
      }
    }
  }

  /**
   * Check if button is loading
   */
  isLoading(): boolean {
    return this.options.loading || false;
  }

  /**
   * Set button variant
   */
  setVariant(variant: ComponentVariant): void {
    this.options.variant = variant;
    this.updateClasses();
  }

  /**
   * Get button variant
   */
  getVariant(): ComponentVariant {
    return this.options.variant || 'primary';
  }

  /**
   * Set button size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
  }

  /**
   * Get button size
   */
  getSize(): ComponentSize {
    return this.options.size || 'md';
  }

  /**
   * Click button programmatically
   */
  click(): void {
    this.element.click();
  }

  /**
   * Focus button
   */
  focus(): void {
    this.element.focus();
  }

  /**
   * Blur button
   */
  blur(): void {
    this.element.blur();
  }

  /**
   * Get native element
   */
  getElement(): HTMLButtonElement {
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
 * Create button from scratch
 */
export function createButton(options: ButtonOptions & { text?: string }): Button {
  const classes = buttonClasses(options);
  const button = dom.createElement('button', {
    className: classes,
    textContent: options.text || 'Button',
  });

  const instance = new Button(button, options);
  return instance;
}
