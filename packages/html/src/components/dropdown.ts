/**
 * Dropdown, Menu and Tree components
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';
import { ChangeHandler } from '../types/index';

export interface MenuItem {
  label: string;
  value?: string;
  disabled?: boolean;
  children?: MenuItem[];
  onClick?: () => void;
}

export interface DropdownOptions {
  items: MenuItem[];
  trigger?: 'click' | 'hover';
  placement?: 'bottom' | 'top' | 'left' | 'right';
}

export class Dropdown {
  private trigger: HTMLElement;
  private menu: HTMLUListElement;
  private options: DropdownOptions;
  private eventManager = new EventManager();
  private isOpen = false;

  constructor(
    trigger: HTMLElement | string,
    options: DropdownOptions
  ) {
    this.trigger = dom.getElement<HTMLElement>(trigger);
    this.options = {
      trigger: 'click',
      placement: 'bottom',
      ...options
    };
    this.menu = this.createMenu();
    this.init();
  }

  private createMenu(): HTMLUListElement {
    const menu = dom.createElement('ul', {
      className: `ag-dropdown ag-dropdown--${this.options.placement}`
    });

    const renderMenuItems = (items: MenuItem[], container: HTMLElement) => {
      items.forEach(item => {
        const li = dom.createElement('li');
        const a = dom.createElement('a', {
          className: item.disabled ? 'ag-dropdown__item--disabled' : 'ag-dropdown__item',
          textContent: item.label,
          attributes: {
            href: '#',
            role: 'menuitem'
          }
        });

        this.eventManager.on(a, 'click', (e) => {
          e.preventDefault();
          if (!item.disabled) {
            item.onClick?.();
            this.close();
          }
        });

        li.appendChild(a);

        if (item.children && item.children.length > 0) {
          const submenu = dom.createElement('ul', {
            className: 'ag-dropdown__submenu'
          });
          renderMenuItems(item.children, submenu);
          li.appendChild(submenu);
        }

        container.appendChild(li);
      });
    };

    renderMenuItems(this.options.items, menu);
    menu.style.display = 'none';
    return menu;
  }

  private init(): void {
    document.body.appendChild(this.menu);

    if (this.options.trigger === 'click') {
      this.eventManager.on(this.trigger, 'click', () => {
        this.isOpen ? this.close() : this.open();
      });
    } else {
      this.eventManager.on(this.trigger, 'mouseenter', () => this.open());
      this.eventManager.on(this.menu, 'mouseleave', () => this.close());
    }

    // Close on outside click
    this.eventManager.on(document, 'click', (e) => {
      const target = e.target as HTMLElement;
      if (!this.trigger.contains(target) && !this.menu.contains(target)) {
        this.close();
      }
    });
  }

  /**
   * Open dropdown
   */
  open(): void {
    this.isOpen = true;
    dom.show(this.menu);
  }

  /**
   * Close dropdown
   */
  close(): void {
    this.isOpen = false;
    dom.hide(this.menu);
  }

  /**
   * Get menu element
   */
  getMenu(): HTMLUListElement {
    return this.menu;
  }

  /**
   * Destroy
   */
  destroy(): void {
    this.close();
    dom.removeElement(this.menu);
    this.eventManager.removeAll();
  }
}

export interface TreeNode {
  label: string;
  value?: string;
  children?: TreeNode[];
  expanded?: boolean;
  disabled?: boolean;
}

export interface TreeOptions {
  data: TreeNode[];
  onChange?: ChangeHandler<string>;
}

export class Tree {
  private element: HTMLUListElement;
  private options: TreeOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLUListElement | string,
    options: TreeOptions
  ) {
    this.element = dom.getElement<HTMLUListElement>(element);
    this.options = options;
    this.init();
  }

  private init(): void {
    dom.addClass(this.element, 'ag-tree');
    this.renderTree();
  }

  private renderTree(nodes = this.options.data, container = this.element): void {
    // Clean up old event listeners for this container before re-rendering
    if (container === this.element) {
      this.eventManager.removeAll();
    }

    container.innerHTML = '';

    nodes.forEach(node => {
      const li = dom.createElement('li', {
        className: 'ag-tree__node'
      });

      if (node.children && node.children.length > 0) {
        const toggle = dom.createElement('span', {
          className: node.expanded ? 'ag-tree__toggle ag-tree__toggle--expanded' : 'ag-tree__toggle',
          textContent: '▶'
        });

        this.eventManager.on(toggle, 'click', () => {
          node.expanded = !node.expanded;
          this.renderTree();
        });

        li.appendChild(toggle);
      }

      const label = dom.createElement('span', {
        className: 'ag-tree__label',
        textContent: node.label
      });

      this.eventManager.on(label, 'click', () => {
        if (this.options.onChange && node.value) {
          this.options.onChange(node.value, new Event('change'));
        }
      });

      li.appendChild(label);

      if (node.children && node.children.length > 0 && node.expanded) {
        const childrenUl = dom.createElement('ul', {
          className: 'ag-tree__children'
        });
        this.renderTree(node.children, childrenUl);
        li.appendChild(childrenUl);
      }

      container.appendChild(li);
    });
  }

  /**
   * Get element
   */
  getElement(): HTMLUListElement {
    return this.element;
  }

  /**
   * Destroy
   */
  destroy(): void {
    this.eventManager.removeAll();
  }
}

/**
 * Create tree
 */
export function createTree(options: TreeOptions): Tree {
  const ul = dom.createElement('ul', {
    className: 'ag-tree'
  });

  const instance = new Tree(ul, options);
  return instance;
}
