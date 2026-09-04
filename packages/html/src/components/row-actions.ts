/**
 * RowActions component - Action buttons for table rows
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface RowAction {
  key: string;
  text?: string;
  icon?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick?: (record: any, index: number) => void;
}

export interface RowActionsOptions {
  actions?: RowAction[];
  record?: any;
  index?: number;
  className?: string;
}

export class RowActions {
  private element: HTMLDivElement;
  private options: RowActionsOptions;
  private eventManager = new EventManager();
  private buttons: Map<string, HTMLButtonElement> = new Map();

  constructor(
    element: HTMLDivElement | string,
    options: RowActionsOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = { ...options };
    this.updateClasses();
    this.options.actions?.forEach((action) => this.addAction(action));
  }

  private updateClasses(): void {
    this.element.className = ['ag-row-actions', this.options.className].filter(Boolean).join(' ');
  }

  /**
   * Add an action button. Disabled actions render with the disabled
   * attribute/class and never invoke `onClick`.
   */
  addAction(action: RowAction): HTMLButtonElement {
    const btn = dom.createElement('button', {
      className: [
        'ag-btn ag-btn--default ag-btn--sm',
        action.danger ? 'ag-btn--danger' : '',
        action.disabled ? 'ag-btn--disabled' : '',
      ]
        .filter(Boolean)
        .join(' '),
      attributes: {
        type: 'button',
        disabled: action.disabled ? 'disabled' : undefined,
      },
    });

    if (action.icon) {
      btn.innerHTML = `<span class="ag-btn-icon">${action.icon}</span> ${action.text || ''}`;
    } else {
      btn.textContent = action.text || '';
    }

    this.eventManager.on(btn, 'click', () => {
      if (action.disabled) return;
      if (this.options.record === undefined || this.options.index === undefined) return;
      action.onClick?.(this.options.record, this.options.index);
    });

    this.element.appendChild(btn);
    this.buttons.set(action.key, btn);
    if (!this.options.actions) {
      this.options.actions = [];
    }
    if (!this.options.actions.includes(action)) {
      this.options.actions.push(action);
    }
    return btn;
  }

  /**
   * Enable/disable a specific action by key.
   */
  setActionDisabled(key: string, disabled: boolean): void {
    const btn = this.buttons.get(key);
    const action = this.options.actions?.find((a) => a.key === key);
    if (action) action.disabled = disabled;
    if (btn) {
      btn.disabled = disabled;
      btn.classList.toggle('ag-btn--disabled', disabled);
    }
  }

  /**
   * Set the record these actions operate on.
   */
  setRecord(record: any): void {
    this.options.record = record;
  }

  /**
   * Set the row index these actions operate on.
   */
  setIndex(index: number): void {
    this.options.index = index;
  }

  /**
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy component: removes listeners and action buttons.
   */
  destroy(): void {
    this.eventManager.removeAll();
    this.buttons.forEach((btn) => btn.remove());
    this.buttons.clear();
  }
}

/**
 * Create row actions from scratch
 */
export function createRowActions(options: RowActionsOptions = {}): RowActions {
  const container = dom.createElement('div', {
    className: 'ag-row-actions',
  });

  const instance = new RowActions(container, options);
  return instance;
}
