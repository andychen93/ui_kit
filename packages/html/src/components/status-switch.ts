/**
 * StatusSwitch component - A switch that requires (optional) confirmation
 * and drives its state from the result of an async request.
 *
 * Behavior parity with the common "confirm switch" pattern:
 * - `confirm` (optional) is called before toggling; if it returns `false`
 *   or a Promise that resolves to `false`, the toggle is aborted and the
 *   switch stays at its current value.
 * - `onChange` may return a Promise. While pending, the switch shows a
 *   `pending` state (via `ag-status-switch--pending` class) and is not
 *   interactive.
 * - On success the new value is kept. On failure (rejected promise or
 *   thrown error) the switch rolls back to its previous value and the
 *   error is exposed via `getError()`.
 * - `disabled` blocks all interaction.
 */

import { ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { statusSwitchClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export type StatusSwitchStatus = 'success' | 'error' | 'warning' | 'processing';

export interface StatusSwitchOptions {
  size?: ComponentSize;
  disabled?: boolean;
  checked?: boolean;
  status?: StatusSwitchStatus;
  /** Called before toggling; return/resolve `false` to abort. */
  confirm?: (nextValue: boolean) => boolean | Promise<boolean>;
  /** Called with the candidate value; may return a Promise to go async. */
  onChange?: (value: boolean) => void | Promise<void>;
  className?: string;
}

export class StatusSwitch {
  private element: HTMLDivElement;
  private switchButton: HTMLDivElement;
  private input: HTMLInputElement;
  private options: StatusSwitchOptions;
  private eventManager = new EventManager();
  private checked: boolean;
  private pending = false;
  private error: string | null = null;

  constructor(
    element: HTMLDivElement | string,
    options: StatusSwitchOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      size: 'md',
      checked: false,
      ...options,
    };
    this.checked = this.options.checked ?? false;

    this.input = this.createInput();
    this.switchButton = this.createSwitchButton();
    this.updateClasses();
    this.bindEvents();
  }

  private createInput(): HTMLInputElement {
    const input = dom.createElement('input', {
      className: 'ag-status-switch-input',
      attributes: { type: 'hidden' },
    });
    input.value = String(this.checked);
    this.element.appendChild(input);
    return input;
  }

  private createSwitchButton(): HTMLDivElement {
    const switchButton = dom.createElement('div', {
      className: 'ag-status-switch-button',
      attributes: {
        role: 'switch',
        'aria-checked': String(this.checked),
      },
    });

    const knob = dom.createElement('div', {
      className: this.options.status
        ? `ag-status-switch-knob ag-status-switch-knob--${this.options.status}`
        : 'ag-status-switch-knob',
    });
    switchButton.appendChild(knob);
    this.element.appendChild(switchButton);
    return switchButton;
  }

  private updateClasses(): void {
    const classes = statusSwitchClasses({
      size: this.options.size,
      disabled: this.options.disabled,
      checked: this.checked,
      loading: this.pending,
      className: this.options.className,
    });
    this.element.className = classes;
    this.element.classList.toggle('ag-status-switch--pending', this.pending);
  }

  private bindEvents(): void {
    this.eventManager.on(this.switchButton, 'click', () => {
      if (this.options.disabled || this.pending) return;
      void this.requestToggle();
    });
  }

  /**
   * Toggle switch state, running through confirm -> onChange -> rollback.
   */
  async requestToggle(): Promise<void> {
    if (this.options.disabled || this.pending) return;

    const nextValue = !this.checked;
    const previousValue = this.checked;

    if (this.options.confirm) {
      const confirmed = await this.options.confirm(nextValue);
      if (!confirmed) {
        return;
      }
    }

    this.applyValue(nextValue);
    this.error = null;

    if (!this.options.onChange) {
      return;
    }

    let result: void | Promise<void>;
    try {
      result = this.options.onChange(nextValue);
    } catch (err) {
      this.rollback(previousValue, err);
      return;
    }

    if (result && typeof (result as Promise<void>).then === 'function') {
      this.setPending(true);
      try {
        await result;
        this.setPending(false);
      } catch (err) {
        this.setPending(false);
        this.rollback(previousValue, err);
      }
    }
  }

  private rollback(previousValue: boolean, err: unknown): void {
    this.error = err instanceof Error ? err.message : String(err);
    this.applyValue(previousValue);
    this.setStatus('error');
  }

  private applyValue(value: boolean): void {
    this.checked = value;
    this.options.checked = value;
    this.input.value = String(value);
    this.switchButton.setAttribute('aria-checked', String(value));
    this.switchButton.classList.toggle('ag-status-switch-button--checked', value);

    const event = new Event('change', { bubbles: true });
    this.input.dispatchEvent(event);
  }

  private setPending(pending: boolean): void {
    this.pending = pending;
    this.updateClasses();
  }

  /**
   * Programmatically set the value without going through confirm/onChange.
   */
  setValue(value: boolean): void {
    this.applyValue(value);
  }

  /**
   * Get switch value
   */
  getValue(): boolean {
    return this.checked;
  }

  /**
   * Whether an async onChange is currently pending
   */
  isPending(): boolean {
    return this.pending;
  }

  /**
   * Last rollback error message, if any
   */
  getError(): string | null {
    return this.error;
  }

  /**
   * Set status indicator (success/error/warning/processing)
   */
  setStatus(status: StatusSwitchStatus): void {
    this.options.status = status;
    const knob = this.switchButton.querySelector('.ag-status-switch-knob');
    if (knob) {
      knob.className = `ag-status-switch-knob ag-status-switch-knob--${status}`;
    }
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.updateClasses();
  }

  /**
   * Check if disabled
   */
  isDisabled(): boolean {
    return this.options.disabled ?? false;
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
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy component
   */
  destroy(): void {
    this.eventManager.removeAll();
    this.input.remove();
    this.switchButton.remove();
    this.element.remove();
  }
}

/**
 * Create status switch from scratch
 */
export function createStatusSwitch(options: StatusSwitchOptions = {}): StatusSwitch {
  const container = dom.createElement('div', {
    className: 'ag-status-switch',
  });

  const instance = new StatusSwitch(container, options);
  return instance;
}
