/**
 * Transfer component - move items between two lists (source/target).
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface TransferItem {
  key: string;
  title?: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface TransferOptions {
  dataSource?: TransferItem[];
  /** Keys that start on the target (right) side */
  targetKeys?: string[];
  onChange?: (targetKeys: string[]) => void;
  className?: string;
}

interface InternalItem extends TransferItem {
  element: HTMLDivElement;
}

export class Transfer {
  private element: HTMLDivElement;
  private options: TransferOptions;
  private sourceList: HTMLDivElement;
  private targetList: HTMLDivElement;
  private moveRightButton: HTMLButtonElement;
  private moveLeftButton: HTMLButtonElement;
  private eventManager = new EventManager();

  private sourceItems: Map<string, InternalItem> = new Map();
  private targetItems: Map<string, InternalItem> = new Map();

  constructor(
    element: HTMLDivElement | string,
    options: TransferOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = { ...options };

    this.updateClasses();

    const header = dom.createElement('div', {
      className: 'ag-transfer-header',
    });
    header.appendChild(
      dom.createElement('div', { className: 'ag-transfer-title', textContent: 'Available' })
    );
    header.appendChild(
      dom.createElement('div', { className: 'ag-transfer-title', textContent: 'Selected' })
    );
    this.element.appendChild(header);

    const body = dom.createElement('div', {
      className: 'ag-transfer-body',
    });

    this.sourceList = dom.createElement('div', {
      className: 'ag-transfer-list ag-transfer-list--source',
    });
    body.appendChild(this.sourceList);

    const buttons = dom.createElement('div', {
      className: 'ag-transfer-buttons',
    });
    this.moveRightButton = dom.createElement('button', {
      className: 'ag-btn ag-btn--sm',
      textContent: '\u2192',
      attributes: { type: 'button' },
    });
    buttons.appendChild(this.moveRightButton);

    this.moveLeftButton = dom.createElement('button', {
      className: 'ag-btn ag-btn--sm',
      textContent: '\u2190',
      attributes: { type: 'button' },
    });
    buttons.appendChild(this.moveLeftButton);
    body.appendChild(buttons);

    this.targetList = dom.createElement('div', {
      className: 'ag-transfer-list ag-transfer-list--target',
    });
    body.appendChild(this.targetList);

    this.element.appendChild(body);

    this.bindEvents();
    this.setDataSource(this.options.dataSource || [], this.options.targetKeys);
  }

  private updateClasses(): void {
    this.element.className = ['ag-transfer', this.options.className].filter(Boolean).join(' ');
  }

  private bindEvents(): void {
    this.eventManager.on<MouseEvent>(this.sourceList, 'click', (e: MouseEvent) => {
      this.handleItemToggle(e, this.sourceItems);
    });

    this.eventManager.on<MouseEvent>(this.targetList, 'click', (e: MouseEvent) => {
      this.handleItemToggle(e, this.targetItems);
    });

    this.eventManager.on<MouseEvent>(this.moveRightButton, 'click', () =>
      this.moveChecked(this.sourceItems, this.targetItems, this.sourceList, this.targetList)
    );

    this.eventManager.on<MouseEvent>(this.moveLeftButton, 'click', () =>
      this.moveChecked(this.targetItems, this.sourceItems, this.targetList, this.sourceList)
    );
  }

  private handleItemToggle(e: MouseEvent, itemsMap: Map<string, InternalItem>): void {
    const target = e.target as HTMLElement;
    const row = target.closest('.ag-transfer-item');
    if (!(row instanceof HTMLElement)) return;

    const key = row.dataset.key || '';
    const item = itemsMap.get(key);
    if (!item || item.disabled) return;

    const checkbox = row.querySelector('.ag-transfer-checkbox');
    if (!(checkbox instanceof HTMLInputElement)) return;

    // If the click originated on the checkbox itself, its `checked` state
    // was already toggled by the browser; otherwise toggle manually.
    if (target !== checkbox) {
      checkbox.checked = !checkbox.checked;
    }

    item.checked = checkbox.checked;
    row.classList.toggle('ag-transfer-item--checked', checkbox.checked);
  }

  private moveChecked(
    fromMap: Map<string, InternalItem>,
    toMap: Map<string, InternalItem>,
    fromList: HTMLDivElement,
    toList: HTMLDivElement
  ): void {
    const toMove = Array.from(fromMap.values()).filter((item) => item.checked && !item.disabled);

    toMove.forEach((item) => {
      fromMap.delete(item.key);
      item.checked = false;
      item.element.classList.remove('ag-transfer-item--checked');
      const checkbox = item.element.querySelector('.ag-transfer-checkbox');
      if (checkbox instanceof HTMLInputElement) {
        checkbox.checked = false;
      }
      fromList.removeChild(item.element);
      toMap.set(item.key, item);
      toList.appendChild(item.element);
    });

    if (toMove.length > 0) {
      this.emitChange();
    }
  }

  private createRow(item: TransferItem): InternalItem {
    const row = dom.createElement('div', {
      className: 'ag-transfer-item',
    });
    row.dataset.key = item.key;

    if (item.disabled) {
      row.classList.add('ag-transfer-item--disabled');
    }

    const checkbox = dom.createElement('input', {
      className: 'ag-transfer-checkbox',
      attributes: {
        type: 'checkbox',
        disabled: item.disabled ? 'disabled' : undefined,
      },
    });
    checkbox.checked = !!item.checked;
    row.appendChild(checkbox);

    const label = dom.createElement('label', {
      className: 'ag-transfer-label',
      textContent: item.title || item.key,
    });
    row.appendChild(label);

    if (item.description) {
      row.appendChild(
        dom.createElement('div', {
          className: 'ag-transfer-description',
          textContent: item.description,
        })
      );
    }

    if (item.checked) {
      row.classList.add('ag-transfer-item--checked');
    }

    return { ...item, element: row };
  }

  private emitChange(): void {
    this.options.onChange?.(this.getTargetKeys());
  }

  /**
   * Replace the full data source. `targetKeys` (defaults to each item's
   * own `checked`/pre-existing target membership) decides which items
   * start on the right side.
   */
  setDataSource(dataSource: TransferItem[], targetKeys?: string[]): void {
    this.sourceItems.forEach((item) => item.element.remove());
    this.targetItems.forEach((item) => item.element.remove());
    this.sourceItems.clear();
    this.targetItems.clear();

    const targetKeySet = new Set(targetKeys || []);

    dataSource.forEach((item) => {
      const isTarget = targetKeySet.has(item.key);
      const row = this.createRow({ ...item, checked: false });

      if (isTarget) {
        this.targetItems.set(item.key, row);
        this.targetList.appendChild(row.element);
      } else {
        this.sourceItems.set(item.key, row);
        this.sourceList.appendChild(row.element);
      }
    });
  }

  /**
   * Get keys currently on the target (right) side
   */
  getTargetKeys(): string[] {
    return Array.from(this.targetItems.keys());
  }

  /**
   * Get keys currently on the source (left) side
   */
  getSourceKeys(): string[] {
    return Array.from(this.sourceItems.keys());
  }

  /**
   * Set disabled state for a specific item by key
   */
  setItemDisabled(key: string, disabled: boolean): void {
    const item = this.sourceItems.get(key) || this.targetItems.get(key);
    if (!item) return;
    item.disabled = disabled;
    item.element.classList.toggle('ag-transfer-item--disabled', disabled);
    const checkbox = item.element.querySelector('.ag-transfer-checkbox');
    if (checkbox instanceof HTMLInputElement) {
      checkbox.disabled = disabled;
    }
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
    this.sourceItems.forEach((item) => item.element.remove());
    this.targetItems.forEach((item) => item.element.remove());
    this.sourceItems.clear();
    this.targetItems.clear();
  }
}

/**
 * Create transfer from scratch
 */
export function createTransfer(options: TransferOptions = {}): Transfer {
  const container = dom.createElement('div', {
    className: 'ag-transfer',
  });

  const instance = new Transfer(container, options);
  return instance;
}
