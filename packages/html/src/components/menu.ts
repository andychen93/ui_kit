/**
 * Menu component
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface MenuItemOptions {
  title?: string;
  key?: string;
  icon?: string;
  children?: MenuItemOptions[];
  className?: string;
}

export interface MenuOptions {
  mode?: 'vertical' | 'horizontal';
  selectedKeys?: string[];
  openKeys?: string[];
  onClick?: (key: string) => void;
  onOpenChange?: (keys: string[]) => void;
  className?: string;
}

export class Menu {
  private element: HTMLDivElement;
  private options: MenuOptions;
  private items: Map<string, HTMLDivElement> = new Map();
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: MenuOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      mode: 'vertical',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.processItems();
    this.bindEvents();
  }

  private processItems(): void {
    // Find all menu items recursively
    const menuItems = this.element.querySelectorAll('.ag-menu-item, .ag-menu-submenu');
    menuItems.forEach(el => {
      const item = el as HTMLDivElement;
      const key = (item as HTMLElement).dataset.key || '';

      if (key) {
        this.items.set(key, item);

        // Check if selected
        if (this.options.selectedKeys?.includes(key)) {
          item.classList.add('ag-menu-item--selected');
        }
      }
    });
  }

  private bindEvents(): void {
    // Handle item clicks
    const handleItemClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const item = target.closest('.ag-menu-item');

      if (item && this.options.onClick) {
        const key = (item as HTMLElement).dataset.key || '';
        if (key) {
          this.options.onClick(key);
        }
      }
    };

    this.eventManager.on(this.element, 'click', handleItemClick);
  }

  private updateClasses(): void {
    const modeClass = this.options.mode === 'vertical'
      ? 'ag-menu--vertical'
      : 'ag-menu--horizontal';

    this.element.className = `ag-menu ${modeClass}`;
    if (this.options.className) {
      this.element.className += ` ${this.options.className}`;
    }
  }

  /**
   * Add menu item
   */
  addItem(options: MenuItemOptions): HTMLDivElement {
    const item = dom.createElement('div', {
      className: 'ag-menu-item',
      attributes: {
        'data-key': options.key || '',
      },
    });

    if (options.icon) {
      const icon = dom.createElement('div', {
        className: 'ag-menu-item-icon',
        textContent: options.icon,
      });
      item.appendChild(icon);
    }

    if (options.title) {
      const title = dom.createElement('div', {
        className: 'ag-menu-item-title',
        textContent: options.title,
      });
      item.appendChild(title);
    }

    if (this.options.mode === 'vertical' && options.children?.length) {
      const submenu = this.createSubmenu(options.children);
      item.appendChild(submenu);
    }

    this.element.appendChild(item);
    if (options.key) {
      this.items.set(options.key, item);
    }

    // Check if selected
    if (this.options.selectedKeys?.includes(options.key || '')) {
      item.classList.add('ag-menu-item--selected');
    }

    return item;
  }

  private createSubmenu(items: MenuItemOptions[]): HTMLDivElement {
    const submenu = dom.createElement('div', {
      className: 'ag-menu-submenu',
    });

    const list = dom.createElement('div', {
      className: 'ag-menu-submenu-list',
    });

    items.forEach(child => {
      const item = dom.createElement('div', {
        className: 'ag-menu-item',
        attributes: {
          'data-key': child.key || '',
        },
      });

      if (child.title) {
        const title = dom.createElement('div', {
          className: 'ag-menu-item-title',
          textContent: child.title,
        });
        item.appendChild(title);
      }

      list.appendChild(item);
    });

    submenu.appendChild(list);
    return submenu;
  }

  /**
   * Remove menu item
   */
  removeItem(key: string): void {
    const item = this.items.get(key);
    if (item) {
      item.remove();
      this.items.delete(key);
    }
  }

  /**
   * Select item
   */
  selectItem(key: string): void {
    // Deselect all items
    this.items.forEach(item => {
      item.classList.remove('ag-menu-item--selected');
    });

    // Select the requested item
    const item = this.items.get(key);
    if (item) {
      item.classList.add('ag-menu-item--selected');
    }

    if (this.options.onClick) {
      this.options.onClick(key);
    }
  }

  /**
   * Get selected keys
   */
  getSelectedKeys(): string[] {
    const keys: string[] = [];
    this.items.forEach((item, key) => {
      if (item.classList.contains('ag-menu-item--selected')) {
        keys.push(key);
      }
    });
    return keys;
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
    this.items.forEach(item => {
      item.remove();
    });
    this.items.clear();
  }
}

/**
 * Create menu from scratch
 */
export function createMenu(options: MenuOptions = {}): Menu {
  const container = dom.createElement('div', {
    className: 'ag-menu',
  });

  const instance = new Menu(container, options);
  return instance;
}
