/**
 * DatePicker component
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';
import { ChangeHandler } from '../types/index';

export interface DatePickerOptions {
  value?: string; // YYYY-MM-DD
  min?: string;
  max?: string;
  onChange?: ChangeHandler<string>;
}

export class DatePicker {
  private element: HTMLInputElement;
  private options: DatePickerOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLInputElement | string,
    options: DatePickerOptions = {}
  ) {
    this.element = dom.getElement<HTMLInputElement>(element);
    this.options = options;
    this.init();
  }

  private init(): void {
    dom.addClass(this.element, 'ag-datepicker');
    dom.setAttributes(this.element, {
      type: 'date',
      value: this.options.value || '',
      min: this.options.min || undefined,
      max: this.options.max || undefined
    });

    if (this.options.onChange) {
      this.eventManager.on(this.element, 'change', (e) => {
        this.options.onChange?.((e.target as HTMLInputElement).value, e);
      });
    }
  }

  /**
   * Get value
   */
  getValue(): string {
    return this.element.value;
  }

  /**
   * Set value
   */
  setValue(value: string): void {
    this.element.value = value;
  }

  /**
   * Get element
   */
  getElement(): HTMLInputElement {
    return this.element;
  }

  /**
   * Destroy
   */
  destroy(): void {
    this.eventManager.removeAll();
  }
}

export interface RangePickerOptions {
  startValue?: string;
  endValue?: string;
  min?: string;
  max?: string;
  onChange?: (values: [string, string], event: Event) => void;
}

/**
 * RangePicker - date range selection using two native date inputs.
 *
 * `DateRangePicker` (below) is kept as a compatibility alias with the same
 * class and factory function; new code should prefer `RangePicker` /
 * `createRangePicker` to match the naming used across
 * React/Vue/Svelte.
 */
export class RangePicker {
  private startInput: HTMLInputElement;
  private endInput: HTMLInputElement;
  private options: RangePickerOptions;
  private eventManager = new EventManager();

  constructor(
    startElement: HTMLInputElement | string,
    endElement: HTMLInputElement | string,
    options: RangePickerOptions = {}
  ) {
    this.startInput = dom.getElement<HTMLInputElement>(startElement);
    this.endInput = dom.getElement<HTMLInputElement>(endElement);
    this.options = options;
    this.init();
  }

  private init(): void {
    dom.addClass(this.startInput, 'ag-datepicker');
    dom.addClass(this.endInput, 'ag-datepicker');

    dom.setAttributes(this.startInput, {
      type: 'date',
      value: this.options.startValue || '',
      min: this.options.min || undefined,
      max: this.options.max || undefined
    });

    dom.setAttributes(this.endInput, {
      type: 'date',
      value: this.options.endValue || '',
      min: this.options.min || undefined,
      max: this.options.max || undefined
    });

    if (this.options.onChange) {
      this.eventManager.on(this.startInput, 'change', (e) => {
        this.options.onChange?.(
          [this.startInput.value, this.endInput.value],
          e
        );
      });

      this.eventManager.on(this.endInput, 'change', (e) => {
        this.options.onChange?.(
          [this.startInput.value, this.endInput.value],
          e
        );
      });
    }
  }

  /**
   * Get values
   */
  getValues(): [string, string] {
    return [this.startInput.value, this.endInput.value];
  }

  /**
   * Set values
   */
  setValues(start: string, end: string): void {
    this.startInput.value = start;
    this.endInput.value = end;
  }

  /**
   * Get elements
   */
  getElements(): [HTMLInputElement, HTMLInputElement] {
    return [this.startInput, this.endInput];
  }

  /**
   * Destroy
   */
  destroy(): void {
    this.eventManager.removeAll();
  }
}

/**
 * Create datepicker
 */
export function createDatePicker(options: DatePickerOptions = {}): DatePicker {
  const input = dom.createElement('input', {
    className: 'ag-datepicker',
    attributes: { type: 'date' }
  });

  const instance = new DatePicker(input, options);
  return instance;
}

/**
 * Create a RangePicker (two native date inputs + shared change handler)
 */
export function createRangePicker(
  options: RangePickerOptions = {}
): RangePicker {
  const startInput = dom.createElement('input', {
    className: 'ag-datepicker',
    attributes: { type: 'date', placeholder: 'Start date' }
  });

  const endInput = dom.createElement('input', {
    className: 'ag-datepicker',
    attributes: { type: 'date', placeholder: 'End date' }
  });

  const instance = new RangePicker(startInput, endInput, options);
  return instance;
}

/**
 * @deprecated Use `RangePicker` instead. Kept as a compatibility alias —
 * same class, same behavior.
 */
export const DateRangePicker = RangePicker;

/**
 * @deprecated Use `createRangePicker` instead. Kept as a compatibility
 * alias — same behavior.
 */
export const createDateRangePicker = createRangePicker;

/**
 * @deprecated Use `RangePickerOptions` instead.
 */
export type DateRangePickerOptions = RangePickerOptions;
