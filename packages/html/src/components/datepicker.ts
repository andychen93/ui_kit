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

export interface DateRangePickerOptions {
  startValue?: string;
  endValue?: string;
  min?: string;
  max?: string;
  onChange?: (values: [string, string], event: Event) => void;
}

export class DateRangePicker {
  private startInput: HTMLInputElement;
  private endInput: HTMLInputElement;
  private options: DateRangePickerOptions;
  private eventManager = new EventManager();

  constructor(
    startElement: HTMLInputElement | string,
    endElement: HTMLInputElement | string,
    options: DateRangePickerOptions = {}
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
 * Create date range picker
 */
export function createDateRangePicker(
  options: DateRangePickerOptions = {}
): DateRangePicker {
  const startInput = dom.createElement('input', {
    className: 'ag-datepicker',
    attributes: { type: 'date', placeholder: 'Start date' }
  });

  const endInput = dom.createElement('input', {
    className: 'ag-datepicker',
    attributes: { type: 'date', placeholder: 'End date' }
  });

  const instance = new DateRangePicker(startInput, endInput, options);
  return instance;
}
