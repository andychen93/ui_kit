/**
 * Transfer component
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface TransferItem {
  key: string;
  title?: string;
  description?: string;
  checked?: boolean;
  className?: string;
}

export interface TransferOptions {
  dataSource?: TransferItem[];
  selectedKeys?: string[];
  onChange?: (selectedKeys: string[]) => void;
  className?: string;
}

export class Transfer {
  private element: HTMLDivElement;
  private options: TransferOptions;
  private sourceList: HTMLDivElement | null;
  private targetList: HTMLDivElement | null;
  private sourceItems: Map<string, HTMLDivElement> = new Map();
  private targetItems: Map<string, HTMLDivElement> = new Map();
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: TransferOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      selectedKeys: [],
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createLayout();
    this.processItems();
    this.bindEvents();
  }

  private createLayout(): void {
    // Header
    const header = dom.createElement('div', {
      className: 'ag-transfer-header',
    });

    const sourceTitle = dom.createElement('div', {
      className: 'ag-transfer-title',
      textContent: 'Available',
    });
    header.appendChild(sourceTitle);

    const targetTitle = dom.createElement('div', {
      className: 'ag-transfer-title',
      textContent: 'Selected',
    });
    header.appendChild(targetTitle);

    this.element.appendChild(header);

    // Body
    const body = dom.createElement('div', {
      className: 'ag-transfer-body',
    });

    // Source list
    const sourceContainer = dom.createElement('div', {
      className: 'ag-transfer-list ag-transfer-list--source',
    });
    body.appendChild(sourceContainer);
    this.sourceList = sourceContainer;

    // Buttons
    const buttons = dom.createElement('div', {
      className: 'ag-transfer-buttons',
    });

    const toRightBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--sm',
      textContent: '→',
    });
    buttons.appendChild(toRightBtn);

    const toLeftBtn = dom.createElement('button', {
      className: 'ag-btn ag-btn--sm',
      textContent: '←',
    });
    buttons.appendChild(toLeftBtn);

    body.appendChild(buttons);

    // Target list
    const targetContainer = dom.createElement('div', {
      className: 'ag-transfer-list ag-transfer-list--target',
    });
    body.appendChild(targetContainer);
    this.targetList = targetContainer;

    this.element.appendChild(body);
  }

  private processItems(): void {
    this.options.dataSource?.forEach(item => {
      this.addItem(item);
    });
  }

  private bindEvents(): void {
    if (this.sourceList) {
      this.eventManager.on(this.sourceList, 'click', (e) => {
        this.handleItemClick(e, 'source');
      });
    }

    if (this.targetList) {
      this.eventManager.on(this.targetList, 'click', (e) => {
        this.handleItemClick(e, 'target');
      });
    }

    if (this.sourceList && this.targetList) {
      // To right button
      const toRightBtn = this.element.querySelector('.ag-transfer-buttons button:first-child');
      if (toRightBtn) {
        this.eventManager.on(toRightBtn, 'click', () => this.moveItems('source', 'target'));
      }

      // To left button
      const toLeftBtn = this.element.querySelector('.ag-transfer-buttons button:last-child');
      if (toLeftBtn) {
        this.eventManager.on(toLeftBtn, 'click', () => this.moveItems('target', 'source'));
      }
    }
  }

  private addItem(item: TransferItem): void {
    const list = this.sourceList;
    if (!list) return;

    const li = dom.createElement('div', {
      className: 'ag-transfer-item',
      attributes: {
        'data-key': item.key,
      },
    });

    if (item.checked) {
      li.classList.add('ag-transfer-item--checked');
    }

    const checkbox = dom.createElement('input', {
      type: 'checkbox',
      className: 'ag-transfer-checkbox',
    });
    if (item.checked) {
      checkbox.checked = true;
    }
    li.appendChild(checkbox);

    const label = dom.createElement('label', {
      className: 'ag-transfer-label',
      textContent: item.title || '',
    });
    li.appendChild(label);

    if (item.description) {
      const desc = dom.createElement('div', {
        className: 'ag-transfer-description',
        textContent: item.description,
      });
      li.appendChild(desc);
    }

    list.appendChild(li);
    this.sourceItems.set(item.key, li);
  }

  private handleItemClick(e: MouseEvent, listType: 'source' | 'target'): void {
    const target = e.target as HTMLElement;
    const item = target.closest('.ag-transfer-item');

    if (item) {
      const key = item.dataset.key || '';
      const checkbox = item.querySelector('.ag-transfer-checkbox') as HTMLInputElement;

      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        
        if (checkbox.checked) {
          item.classList.add('ag-transfer-item--checked');
          if (listType === 'source') {
            this.moveItem(key, 'source', 'target');
          } else {
            this.moveItem(key, 'target', 'source');
          }
        } else {
          item.classList.remove('ag-transfer-item--checked');
          if (listType === 'target') {
            this.moveItem(key, 'target', 'source');
          } else {
            this.moveItem(key, 'source', 'target');
          }
        }
      }
    }
  }

  private moveItems(from: 'source' | 'target', to: 'source' | 'target'): void {
    const fromList = from === 'source' ? this.sourceList : this.targetList;
    const toList = to === 'source' ? this.sourceList : this.targetList;

    if (!fromList || !toList) return;

    const checkedItems = Array.from(fromList.querySelectorAll('.ag-transfer-item--checked'));
    
    checkedItems.forEach(item => {
      const key = item.dataset.key || '';
      
      if (from === 'source' && to === 'target') {
        this.sourceItems.delete(key);
        this.targetItems.set(key, item);
      } else {
        this.targetItems.delete(key);
        this.sourceItems.set(key, item);
      }

      fromList.removeChild(item);
      toList.appendChild(item);
    });

    this.updateSelectedKeys();
  }

  private moveItem(key: string, from: 'source' | 'target', to: 'source' | 'target'): void {
    const fromList = from === 'source' ? this.sourceList : this.targetList;
    const toList = to === 'source' ? this.sourceList : this.targetList;

    if (!fromList || !toList) return;

    const item = fromList.querySelector(`.ag-transfer-item[data-key="${key}"]`);
    if (item) {
      if (from === 'source' && to === 'target') {
        this.sourceItems.delete(key);
        this.targetItems.set(key, item);
      } else {
        this.targetItems.delete(key);
        this.sourceItems.set(key, item);
      }

      fromList.removeChild(item);
      toList.appendChild(item);
    }

    this.updateSelectedKeys();
  }

  private updateSelectedKeys(): void {
    const selectedKeys: string[] = [];
    this.targetItems.forEach((_, key) => {
      selectedKeys.push(key);
    });

    if (this.options.onChange) {
      this.options.onChange(selectedKeys);
    }
  }

  /**
   * Add item
   */
  addItem(item: TransferItem): void {
    if (!this.sourceList) return;
    this.addItem(item);
  }

  /**
   * Remove item
   */
  removeItem(key: string): void {
    const item = this.targetItems.get(key);
    if (item) {
      this.targetItems.delete(key);
      this.sourceItems.set(key, item);
      
      if (this.targetList) {
        this.targetList.removeChild(item);
      }
      if (this.sourceList) {
        this.sourceList.appendChild(item);
      }
    }
  }

  /**
   * Get selected keys
   */
  getSelectedKeys(): string[] {
    const keys: string[] = [];
    this.targetItems.forEach((_, key) => {
      keys.push(key);
    });
    return keys;
  }

  /**
   * Set data source
   */
  setDataSource(dataSource: TransferItem[]): void {
    // Clear existing items
    this.sourceItems.forEach(item => {
      if (this.sourceList) {
        this.sourceList.removeChild(item);
      }
    });
    this.targetItems.forEach(item => {
      if (this.targetList) {
        this.targetList.removeChild(item);
      }
    });
    this.sourceItems.clear();
    this.targetItems.clear();

    // Add new items
    dataSource.forEach(item => {
      this.addItem(item);
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
    this.sourceItems.forEach(item => {
      item.remove();
    });
    this.targetItems.forEach(item => {
      item.remove();
    });
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
