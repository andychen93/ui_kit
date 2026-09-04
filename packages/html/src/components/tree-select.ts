/**
 * TreeSelect component - A select with tree structure
 */

import { ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { treeSelectClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface TreeNode {
  key: string;
  title?: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeSelectOptions {
  size?: ComponentSize;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  value?: string;
  treeData?: TreeNode[];
  onChange?: (value: string) => void;
  className?: string;
}

export class TreeSelect {
  private element: HTMLDivElement;
  private options: TreeSelectOptions;
  private inputElement: HTMLInputElement;
  private clearButton: HTMLButtonElement;
  private dropdownElement: HTMLDivElement;
  private eventManager = new EventManager();
  private value: string;

  constructor(
    element: HTMLDivElement | string,
    options: TreeSelectOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      size: 'md',
      ...options,
    };
    this.value = this.options.value || '';

    this.inputElement = this.createInput();
    this.clearButton = this.createClearButton();
    this.dropdownElement = this.createDropdown();

    this.updateClasses();
    this.bindEvents();
  }

  private createInput(): HTMLInputElement {
    const input = dom.createElement('input', {
      className: 'ag-input ag-tree-select-input',
      attributes: {
        type: 'text',
        placeholder: this.options.placeholder || 'Select...',
        readonly: 'readonly',
      },
    });
    input.value = this.getValueText(this.value);
    this.element.appendChild(input);
    return input;
  }

  private createClearButton(): HTMLButtonElement {
    const button = dom.createElement('button', {
      className: 'ag-tree-select-clear',
      attributes: { type: 'button', 'aria-label': 'Clear' },
      textContent: '\u00d7',
    });
    button.style.display = this.value ? 'inline' : 'none';
    this.element.appendChild(button);
    return button;
  }

  private createDropdown(): HTMLDivElement {
    const dropdown = dom.createElement('div', {
      className: 'ag-tree-select-dropdown',
    });
    dropdown.style.display = 'none';

    const tree = dom.createElement('div', {
      className: 'ag-tree',
    });

    this.options.treeData?.forEach((node) => {
      this.renderTreeNode(node, tree);
    });

    dropdown.appendChild(tree);
    this.element.appendChild(dropdown);
    return dropdown;
  }

  private renderTreeNode(node: TreeNode, parent: HTMLElement): void {
    const item = dom.createElement('div', {
      className: 'ag-tree-item',
    });
    item.dataset.key = node.key;

    if (node.disabled) {
      item.classList.add('ag-tree-item--disabled');
    }

    const label = dom.createElement('div', {
      className: 'ag-tree-item-label',
      textContent: node.title || '',
    });

    const hasChildren = !!node.children && node.children.length > 0;

    if (hasChildren) {
      const expandIcon = dom.createElement('span', {
        className: 'ag-tree-item-expand',
        textContent: '\u25bc',
      });
      label.appendChild(expandIcon);
    }

    item.appendChild(label);

    if (hasChildren) {
      const childrenContainer = dom.createElement('div', {
        className: 'ag-tree-item-children',
      });
      childrenContainer.style.display = 'none';

      node.children!.forEach((child) => {
        this.renderTreeNode(child, childrenContainer);
      });

      item.appendChild(childrenContainer);

      this.eventManager.on(label, 'click', (e: Event) => {
        e.stopPropagation();
        const isOpen = childrenContainer.style.display !== 'none';
        childrenContainer.style.display = isOpen ? 'none' : 'block';
        item.classList.toggle('ag-tree-item--expanded', !isOpen);
      });
    } else {
      this.eventManager.on(label, 'click', (e: Event) => {
        e.stopPropagation();
        if (node.disabled) return;
        this.setValue(node.key);
        this.closeDropdown();
      });
    }

    parent.appendChild(item);
  }

  private getValueText(value: string): string {
    if (!value) return '';
    return this.findNodeTitle(value) || value;
  }

  private findNodeTitle(key: string): string {
    if (!this.options.treeData) return '';

    let title = '';
    const find = (nodes: TreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.key === key) {
          title = node.title || '';
          return true;
        }
        if (node.children && find(node.children)) {
          return true;
        }
      }
      return false;
    };

    find(this.options.treeData);
    return title;
  }

  private bindEvents(): void {
    this.eventManager.on(this.inputElement, 'click', () => {
      if (this.options.disabled) return;
      this.toggleDropdown();
    });

    this.eventManager.on(this.clearButton, 'click', (e: Event) => {
      e.stopPropagation();
      this.clear();
    });

    // Close on document click
    this.eventManager.on(document, 'click', (e: MouseEvent) => {
      if (
        this.dropdownElement.style.display === 'block' &&
        !this.element.contains(e.target as Node)
      ) {
        this.closeDropdown();
      }
    });
  }

  private toggleDropdown(): void {
    if (this.dropdownElement.style.display === 'block') {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Open the tree dropdown
   */
  openDropdown(): void {
    this.dropdownElement.style.display = 'block';
  }

  /**
   * Close the tree dropdown
   */
  closeDropdown(): void {
    this.dropdownElement.style.display = 'none';
  }

  /**
   * Whether the dropdown is currently open
   */
  isOpen(): boolean {
    return this.dropdownElement.style.display === 'block';
  }

  /**
   * Set value
   */
  setValue(value: string): void {
    this.value = value;
    this.options.value = value;
    this.inputElement.value = this.getValueText(value);
    this.clearButton.style.display = value ? 'inline' : 'none';
    this.options.onChange?.(value);
  }

  /**
   * Get value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Clear the selected value
   */
  clear(): void {
    this.setValue('');
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.updateClasses();
    if (disabled) {
      this.closeDropdown();
    }
  }

  /**
   * Set size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
  }

  private updateClasses(): void {
    this.element.className = treeSelectClasses({
      size: this.options.size,
      disabled: this.options.disabled,
      error: !!this.options.error,
      className: this.options.className,
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
    this.inputElement.remove();
    this.clearButton.remove();
    this.dropdownElement.remove();
  }
}

/**
 * Create tree select from scratch
 */
export function createTreeSelect(options: TreeSelectOptions = {}): TreeSelect {
  const container = dom.createElement('div', {
    className: 'ag-tree-select',
  });

  const instance = new TreeSelect(container, options);
  return instance;
}
