/**
 * QueryForm component - A form for queries with collapse functionality
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface QueryFormItem {
  name: string;
  label?: string;
  type?: 'input' | 'select' | 'date' | 'number';
  options?: any[];
  placeholder?: string;
}

export interface QueryFormOptions {
  items?: QueryFormItem[];
  collapsed?: boolean;
  onSearch?: (values: Record<string, any>) => void;
  onReset?: () => void;
  className?: string;
}

export class QueryForm {
  private element: HTMLDivElement;
  private options: QueryFormOptions;
  private formElement: HTMLFormElement | null = null;
  private expandElement: HTMLDivElement | null = null;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: QueryFormOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      collapsed: false,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createLayout();
    this.createForm();
    this.createActions();
  }

  private createLayout(): void {
    const header = dom.createElement('div', {
      className: 'ag-query-form-header',
    });

    if (this.options.collapsed) {
      this.expandElement = dom.createElement('div', {
        className: 'ag-query-form-expand',
        textContent: 'Expand',
      });
      header.appendChild(this.expandElement);
      
      this.element.appendChild(header);
      this.element.style.height = 'auto';
    } else {
      this.element.appendChild(header);
    }
  }

  private createForm(): void {
    const form = dom.createElement('form', {
      className: 'ag-query-form-body',
    });

    if (this.options.collapsed) {
      form.style.display = 'none';
    }

    this.options.items?.forEach(item => {
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

      const input = dom.createElement('input', {
        type: item.type === 'number' ? 'number' : 'text',
        className: 'ag-input',
        name: item.name,
        placeholder: item.placeholder || '',
      });

      if (item.type === 'select' && item.options) {
        const select = dom.createElement('select', {
          className: 'ag-select',
          name: item.name,
        });

        item.options.forEach(opt => {
          const option = dom.createElement('option', {
            value: opt.value,
            textContent: opt.label,
          });
          select.appendChild(option);
        });

        itemDiv.appendChild(select);
      } else {
        itemDiv.appendChild(input);
      }

      form.appendChild(itemDiv);
    });

    this.element.appendChild(form);
    this.formElement = form;
  }

  private createActions(): void {
    const actions = dom.createElement('div', {
      className: 'ag-query-form-actions',
    });

    // Expand/collapse button
    const expandBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--default ag-btn--sm',
      textContent: this.options.collapsed ? 'Expand' : 'Collapse',
    });

    if (this.expandElement) {
      this.eventManager.on(expandBtn, 'click', () => {
        this.toggleExpand();
      });
    }

    actions.appendChild(expandBtn);

    // Search button
    const searchBtn = dom.createElement('button', {
      type: 'submit',
      className: 'ag-btn ag-btn--primary ag-btn--sm',
      textContent: 'Search',
    });
    actions.appendChild(searchBtn);

    // Reset button
    const resetBtn = dom.createElement('button', {
      type: 'button',
      className: 'ag-btn ag-btn--default ag-btn--sm',
      textContent: 'Reset',
    });
    actions.appendChild(resetBtn);

    this.element.appendChild(actions);

    // Bind events
    this.eventManager.on(actions, 'submit', (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    this.eventManager.on(resetBtn, 'click', () => {
      this.handleReset();
    });
  }

  private toggleExpand(): void {
    if (this.expandElement && this.formElement) {
      const isExpanded = this.formElement.style.display !== 'none';
      
      if (isExpanded) {
        this.formElement.style.display = 'none';
        this.expandElement.textContent = 'Expand';
        this.element.style.height = 'auto';
      } else {
        this.formElement.style.display = 'block';
        this.expandElement.textContent = 'Collapse';
        this.element.style.height = 'auto';
      }
      
      this.options.collapsed = !isExpanded;
    }
  }

  private handleSearch(): void {
    if (!this.formElement) return;

    const formData = new FormData(this.formElement);
    const values: Record<string, any> = {};

    formData.forEach((value, key) => {
      values[key] = value;
    });

    if (this.options.onSearch) {
      this.options.onSearch(values);
    }
  }

  private handleReset(): void {
    if (this.formElement) {
      this.formElement.reset();
    }

    if (this.options.onReset) {
      this.options.onReset();
    }
  }

  /**
   * Get form values
   */
  getValues(): Record<string, any> {
    if (!this.formElement) return {};

    const formData = new FormData(this.formElement);
    const values: Record<string, any> = {};

    formData.forEach((value, key) => {
      values[key] = value;
    });

    return values;
  }

  /**
   * Set form values
   */
  setValues(values: Record<string, any>): void {
    if (!this.formElement) return;

    Object.entries(values).forEach(([key, value]) => {
      const input = this.formElement.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = String(value);
      }
    });
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
