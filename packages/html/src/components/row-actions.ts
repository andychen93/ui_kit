/**
 * RowActions component - Action buttons for table rows
 */

import { EventHandler } from '../types/index';
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

  constructor(
    element: HTMLDivElement | string,
    options: RowActionsOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createActions();
  }

  private createActions(): void {
    this.options.actions?.forEach(action => {
      const btn = dom.createElement('button', {
        className: `ag-btn ag-btn--default ag-btn--sm ${action.danger ? 'ag-btn--danger' : ''} ${action.disabled ? 'ag-btn--disabled' : ''}`,
        textContent: action.text || '',
        disabled: action.disabled,
      });

      if (action.icon) {
        btn.innerHTML = `<span class="ag-btn-icon">${action.icon}</span> ${action.text || ''}`;
      }

      btn.addEventListener('click', () => {
        if (!action.disabled && action.onClick && this.options.record !== undefined && this.options.index !== undefined) {
          action.onClick(this.options.record, this.options.index);
        }
      });

      this.element.appendChild(btn);
    });
  }

  /**
   * Add action
   */
  addAction(action: RowAction): void {
    const btn = dom.createElement('button', {
      className: `ag-btn ag-btn--default ag-btn--sm ${action.danger ? 'ag-btn--danger' : ''} ${action.disabled ? 'ag-btn--disabled' : ''}`,
      textContent: action.text || '',
      disabled: action.disabled,
    });

    if (action.icon) {
      btn.innerHTML = `<span class="ag-btn-icon">${action.icon}</span> ${action.text || ''}`;
    }

    btn.addEventListener('click', () => {
      if (!action.disabled && action.onClick && this.options.record !== undefined && this.options.index !== undefined) {
        action.onClick(this.options.record, this.options.index);
      }
    });

    this.element.appendChild(btn);
  }

  /**
   * Set record
   */
  setRecord(record: any): void {
    this.options.record = record;
  }

  /**
   * Set index
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
   * Destroy component
   */
  destroy(): void {
    this.eventManager.removeAll();
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
