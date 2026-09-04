/**
 * QueryForm component - A form for search/filter queries with
 * expand/collapse and reset support.
 *
 * Behavior parity with common QueryForm patterns:
 * - Renders one field per `items` entry (input/select/date/number).
 * - `onSearch(values)` fires on submit (button click or Enter).
 * - `onReset()` fires after values are restored to `initialValues`
 *   (not just the browser's native form reset, so values set
 *   programmatically are respected too).
 * - `initialValues` pre-fills fields and is what `reset()` restores.
 * - `setDisabled(true)` disables every field and the search/reset buttons,
 *   useful while a paired ProTable request is in flight.
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

let formIdCounter = 0;

export interface QueryFormItem {
  name: string;
  label?: string;
  type?: 'input' | 'select' | 'date' | 'number';
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface QueryFormOptions {
  items?: QueryFormItem[];
  collapsed?: boolean;
  initialValues?: Record<string, any>;
  disabled?: boolean;
  onSearch?: (values: Record<string, any>) => void;
  onReset?: (values: Record<string, any>) => void;
  className?: string;
}

export class QueryForm {
  private element: HTMLDivElement;
  private options: QueryFormOptions;
  private formElement: HTMLFormElement | null = null;
  private expandButton: HTMLButtonElement | null = null;
  private searchButton: HTMLButtonElement | null = null;
  private resetButton: HTMLButtonElement | null = null;
  private eventManager = new EventManager();
  private collapsed: boolean;
  private disabled: boolean;
  private initialValues: Record<string, any>;

  constructor(
    element: HTMLDivElement | string,
    options: QueryFormOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = { ...options };
    this.collapsed = options.collapsed ?? false;
    this.disabled = options.disabled ?? false;
    this.initialValues = { ...(options.initialValues || {}) };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createForm();
    this.createActions();
    this.bindEvents();

    if (Object.keys(this.initialValues).length > 0) {
      this.setValues(this.initialValues);
    }

    if (this.disabled) {
      this.setDisabled(true);
    }
  }

  private updateClasses(): void {
    this.element.className = ['ag-query-form', this.options.className]
      .filter(Boolean)
      .join(' ');
  }

  private createForm(): void {
    const form = dom.createElement('form', {
      className: 'ag-query-form-body',
      attributes: { novalidate: 'novalidate', id: `ag-query-form-${++formIdCounter}` },
    });

    if (this.collapsed) {
      form.style.display = 'none';
    }

    this.options.items?.forEach((item) => {
      form.appendChild(this.createFormItem(item));
    });

    this.element.appendChild(form);
    this.formElement = form;
  }

  private createFormItem(item: QueryFormItem): HTMLDivElement {
    const itemDiv = dom.createElement('div', {
      className: 'ag-query-form-item',
    });

    if (item.label) {
      const label = dom.createElement('label', {
        className: 'ag-query-form-label',
        textContent: item.label,
      });
      itemDiv.appendChild(label);
    }

    if (item.type === 'select' && item.options) {
      const select = dom.createElement('select', {
        className: 'ag-select',
        name: item.name,
      });

      item.options.forEach((opt) => {
        const option = dom.createElement('option', {
          value: opt.value,
          textContent: opt.label,
        });
        select.appendChild(option);
      });

      itemDiv.appendChild(select);
    } else {
      const input = dom.createElement('input', {
        className: 'ag-input',
        attributes: {
          type: item.type === 'number' ? 'number' : item.type === 'date' ? 'date' : 'text',
          name: item.name,
          placeholder: item.placeholder || '',
        },
      });
      itemDiv.appendChild(input);
    }

    return itemDiv;
  }

  private createActions(): void {
    const actions = dom.createElement('div', {
      className: 'ag-query-form-actions',
    });

    const searchBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--primary ag-btn--sm',
      textContent: 'Search',
      attributes: { type: 'submit', form: this.formElement?.id },
    });
    actions.appendChild(searchBtn);
    this.searchButton = searchBtn;

    const resetBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default ag-btn--sm',
      textContent: 'Reset',
      attributes: { type: 'button' },
    });
    actions.appendChild(resetBtn);
    this.resetButton = resetBtn;

    if (this.options.items && this.options.items.length > 0) {
      const expandBtn = dom.createElement('button', {
        className: 'ag-btn ag-btn--link ag-btn--sm',
        textContent: this.collapsed ? 'Expand' : 'Collapse',
        attributes: { type: 'button' },
      });
      actions.appendChild(expandBtn);
      this.expandButton = expandBtn;
    }

    this.element.appendChild(actions);
  }

  private bindEvents(): void {
    if (this.formElement) {
      this.eventManager.on(this.formElement, 'submit', (e: Event) => {
        e.preventDefault();
        this.handleSearch();
      });
    }

    if (this.resetButton) {
      this.eventManager.on(this.resetButton, 'click', () => this.handleReset());
    }

    if (this.expandButton) {
      this.eventManager.on(this.expandButton, 'click', () => this.toggleExpand());
    }
  }

  private toggleExpand(): void {
    if (!this.formElement || !this.expandButton) return;

    this.collapsed = !this.collapsed;
    this.formElement.style.display = this.collapsed ? 'none' : '';
    this.expandButton.textContent = this.collapsed ? 'Expand' : 'Collapse';
  }

  private handleSearch(): void {
    this.options.onSearch?.(this.getValues());
  }

  private handleReset(): void {
    this.setValues(this.initialValues);
    this.options.onReset?.(this.getValues());
  }

  /**
   * Get current form values
   */
  getValues(): Record<string, any> {
    if (!this.formElement) return {};

    const values: Record<string, any> = {};
    this.options.items?.forEach((item) => {
      const field = this.formElement!.querySelector(`[name="${item.name}"]`);
      if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
        values[item.name] = field.value;
      }
    });

    return values;
  }

  /**
   * Set form values
   */
  setValues(values: Record<string, any>): void {
    if (!this.formElement) return;

    Object.entries(values).forEach(([key, value]) => {
      const field = this.formElement!.querySelector(`[name="${key}"]`);
      if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
        field.value = value === undefined || value === null ? '' : String(value);
      }
    });
  }

  /**
   * Set initial values used by reset()
   */
  setInitialValues(values: Record<string, any>): void {
    this.initialValues = { ...values };
  }

  /**
   * Reset to initial values (alias for the Reset button's behavior)
   */
  reset(): void {
    this.handleReset();
  }

  /**
   * Enable/disable every field and action button
   */
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    this.options.items?.forEach((item) => {
      const field = this.formElement?.querySelector(`[name="${item.name}"]`);
      if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
        field.disabled = disabled;
      }
    });
    if (this.searchButton) this.searchButton.disabled = disabled;
    if (this.resetButton) this.resetButton.disabled = disabled;
    this.element.classList.toggle('ag-query-form--disabled', disabled);
  }

  /**
   * Whether the form is currently disabled
   */
  isDisabled(): boolean {
    return this.disabled;
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
  }
}

/**
 * Create query form from scratch
 */
export function createQueryForm(options: QueryFormOptions = {}): QueryForm {
  const container = dom.createElement('div', {
    className: 'ag-query-form',
  });

  const instance = new QueryForm(container, options);
  return instance;
}
