/**
 * TreeSelect component - A select with tree structure
 */

import { ComponentSize, EventHandler } from '../types/index';
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
  value?: string | string[];
  treeData?: TreeNode[];
  onChange?: (value: string | string[]) => void;
  className?: string;
}

export class TreeSelect {
  private element: HTMLDivElement;
  private options: TreeSelectOptions;
  private inputElement: HTMLInputElement | null;
  private dropdownElement: HTMLDivElement | null;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: TreeSelectOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      size: 'md',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createInput();
    this.createDropdown();
    this.bindEvents();
  }

  private createInput(): void {
    const input = dom.createElement('input', {
      type: 'text',
      className: 'ag-input',
      placeholder: this.options.placeholder || 'Select...',
      readonly: 'readonly',
    });

    if (this.options.value) {
      input.value = this.getValueText(this.options.value);
    }

    this.element.appendChild(input);
    this.inputElement = input;
  }

  private createDropdown(): void {
    if (!this.options.treeData) return;

    const dropdown = dom.createElement('div', {
      className: 'ag-tree-select-dropdown',
    });

    const tree = dom.createElement('div', {
      className: 'ag-tree',
    });

    this.options.treeData.forEach(node => {
      this.renderTreeNode(node, tree);
    });

    dropdown.appendChild(tree);
    this.element.appendChild(dropdown);
    this.dropdownElement = dropdown;
  }

  private renderTreeNode(node: TreeNode, parent: HTMLElement): void {
    const item = dom.createElement('div', {
      className: 'ag-tree-item',
      attributes: {
        'data-key': node.key,
      },
    });

    if (node.disabled) {
      item.classList.add('ag-tree-item--disabled');
    }

    const label = dom.createElement('div', {
      className: 'ag-tree-item-label',
      textContent: node.title || '',
    });

    if (node.children && node.children.length > 0) {
      label.innerHTML += '<span class="ag-tree-item-expand">▼</span>';
    }

    item.appendChild(label);

    if (node.children && node.children.length > 0) {
      const children = dom.createElement('div', {
        className: 'ag-tree-item-children',
      });
      children.style.display = 'none';

      node.children.forEach(child => {
        this.renderTreeNode(child, children);
      });

      item.appendChild(children);

      label.addEventListener('click', () => {
        children.style.display = children.style.display === 'none' ? 'block' : 'none';
      });
    } else {
      label.addEventListener('click', () => {
        if (!node.disabled && this.options.onChange) {
          this.setValue(node.key);
          this.closeDropdown();
        }
      });
    }

    parent.appendChild(item);
  }

  private getValueText(value: string | string[]): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return this.findNodeTitle(value);
  }

  private findNodeTitle(key: string): string {
    if (!this.options.treeData) return '';
    
    let title = '';
    const find = (nodes: TreeNode[]) => {
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
    if (this.inputElement) {
      this.eventManager.on(this.inputElement, 'click', () => {
        this.toggleDropdown();
      });
    }

    // Close on document click
    this.eventManager.on(document, 'click', (e: MouseEvent) => {
      if (this.dropdownElement && 
          this.dropdownElement.style.display === 'block' &&
          !this.element.contains(e.target as Node)) {
        this.closeDropdown();
      }
    });
  }

  private toggleDropdown(): void {
    if (this.dropdownElement) {
      if (this.dropdownElement.style.display === 'block') {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    }
  }

  private openDropdown(): void {
    if (this.dropdownElement) {
      this.dropdownElement.style.display = 'block';
    }
  }

  private closeDropdown(): void {
    if (this.dropdownElement) {
      this.dropdownElement.style.display = 'none';
    }
  }

  /**
   * Set value
   */
  setValue(value: string | string[]): void {
    this.options.value = value;
    if (this.inputElement) {
      this.inputElement.value = this.getValueText(value);
    }
    if (this.options.onChange) {
      this.options.onChange(value);
    }
  }

  /**
   * Get value
   */
  getValue(): string | string[] {
    return this.options.value || '';
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.updateClasses();
  }

  /**
   * Set size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
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
    if (this.inputElement) {
      this.inputElement.remove();
    }
    if (this.dropdownElement) {
      this.dropdownElement.remove();
    }
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
