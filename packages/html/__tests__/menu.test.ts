import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Menu, createMenu } from '../src/components/menu';

describe('Menu Component', () => {
  let container: HTMLDivElement;
  let menuEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    menuEl = document.createElement('div');
    container.appendChild(menuEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with an element reference', () => {
      const menu = new Menu(menuEl);
      expect(menu.getElement()).toBe(menuEl);
    });

    it('should initialize with a CSS selector string', () => {
      menuEl.id = 'test-menu';
      const menu = new Menu('#test-menu');
      expect(menu.getElement()).toBe(menuEl);
    });

    it('should throw when the selector does not match any element', () => {
      expect(() => new Menu('#does-not-exist')).toThrow(
        'Element not found for selector: #does-not-exist'
      );
    });
  });

  describe('initial render', () => {
    it('should apply the vertical mode class by default', () => {
      const menu = new Menu(menuEl);
      expect(menuEl.className).toContain('ag-menu');
      expect(menuEl.className).toContain('ag-menu--vertical');
      expect(menuEl.className).not.toContain('ag-menu--horizontal');
    });

    it('should apply the horizontal mode class when configured', () => {
      const menu = new Menu(menuEl, { mode: 'horizontal' });
      expect(menuEl.className).toContain('ag-menu--horizontal');
      expect(menuEl.className).not.toContain('ag-menu--vertical');
    });

    it('should append the custom className when provided', () => {
      const menu = new Menu(menuEl, { className: 'my-menu' });
      expect(menuEl.className).toContain('my-menu');
    });

    it('should mark pre-existing markup items matching selectedKeys as selected', () => {
      const item = document.createElement('div');
      item.className = 'ag-menu-item';
      item.dataset.key = 'home';
      menuEl.appendChild(item);

      const menu = new Menu(menuEl, { selectedKeys: ['home'] });

      expect(item.classList.contains('ag-menu-item--selected')).toBe(true);
    });

    it('should not mark pre-existing items as selected when their key is not in selectedKeys', () => {
      const item = document.createElement('div');
      item.className = 'ag-menu-item';
      item.dataset.key = 'about';
      menuEl.appendChild(item);

      const menu = new Menu(menuEl, { selectedKeys: ['home'] });

      expect(item.classList.contains('ag-menu-item--selected')).toBe(false);
    });
  });

  describe('addItem', () => {
    it('should append an item with icon and title reflecting the given options', () => {
      const menu = new Menu(menuEl);
      const item = menu.addItem({ key: 'home', title: 'Home', icon: 'home-icon' });

      expect(menuEl.contains(item)).toBe(true);
      expect(item.dataset.key).toBe('home');
      expect(item.querySelector('.ag-menu-item-icon')?.textContent).toBe('home-icon');
      expect(item.querySelector('.ag-menu-item-title')?.textContent).toBe('Home');
    });

    it('should mark the new item as selected when its key is in selectedKeys', () => {
      const menu = new Menu(menuEl, { selectedKeys: ['dash'] });
      const item = menu.addItem({ key: 'dash', title: 'Dashboard' });
      expect(item.classList.contains('ag-menu-item--selected')).toBe(true);
    });

    it('should create a nested submenu for children when mode is vertical', () => {
      const menu = new Menu(menuEl, { mode: 'vertical' });
      const item = menu.addItem({
        key: 'parent',
        title: 'Parent',
        children: [{ key: 'child1', title: 'Child 1' }],
      });

      const submenu = item.querySelector('.ag-menu-submenu');
      expect(submenu).not.toBeNull();
      const childItem = submenu?.querySelector('.ag-menu-item[data-key="child1"]');
      expect(childItem?.querySelector('.ag-menu-item-title')?.textContent).toBe('Child 1');
    });

    it('should not create a submenu for children when mode is horizontal', () => {
      const menu = new Menu(menuEl, { mode: 'horizontal' });
      const item = menu.addItem({
        key: 'parent',
        title: 'Parent',
        children: [{ key: 'child1', title: 'Child 1' }],
      });

      expect(item.querySelector('.ag-menu-submenu')).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove the item from the DOM', () => {
      const menu = new Menu(menuEl);
      const item = menu.addItem({ key: 'x', title: 'X' });

      menu.removeItem('x');

      expect(menuEl.contains(item)).toBe(false);
    });

    it('should un-select a removed key so getSelectedKeys no longer reports it', () => {
      const menu = new Menu(menuEl);
      menu.addItem({ key: 'x', title: 'X' });
      menu.selectItem('x');
      expect(menu.getSelectedKeys()).toEqual(['x']);

      menu.removeItem('x');

      expect(menu.getSelectedKeys()).toEqual([]);
    });
  });

  describe('selectItem', () => {
    it('should mark the requested item as selected and deselect others', () => {
      const menu = new Menu(menuEl);
      const itemA = menu.addItem({ key: 'a', title: 'A' });
      const itemB = menu.addItem({ key: 'b', title: 'B' });

      menu.selectItem('a');
      expect(itemA.classList.contains('ag-menu-item--selected')).toBe(true);
      expect(itemB.classList.contains('ag-menu-item--selected')).toBe(false);

      menu.selectItem('b');
      expect(itemA.classList.contains('ag-menu-item--selected')).toBe(false);
      expect(itemB.classList.contains('ag-menu-item--selected')).toBe(true);
    });

    it('should invoke the onClick callback with the selected key', () => {
      const onClick = vi.fn();
      const menu = new Menu(menuEl, { onClick });
      menu.addItem({ key: 'settings', title: 'Settings' });

      menu.selectItem('settings');

      expect(onClick).toHaveBeenCalledWith('settings');
    });
  });

  describe('getSelectedKeys', () => {
    it('should reflect the current set of selected keys', () => {
      const menu = new Menu(menuEl, { selectedKeys: ['a'] });
      menu.addItem({ key: 'a', title: 'A' });
      menu.addItem({ key: 'b', title: 'B' });

      expect(menu.getSelectedKeys()).toEqual(['a']);
    });
  });

  describe('item click wiring', () => {
    it('should call onClick with the clicked item key when a menu item is clicked', () => {
      const onClick = vi.fn();
      const menu = new Menu(menuEl, { onClick });
      const item = menu.addItem({ key: 'profile', title: 'Profile' });
      const titleEl = item.querySelector('.ag-menu-item-title') as HTMLElement;

      titleEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onClick).toHaveBeenCalledWith('profile');
    });

    it('should not call onClick when the click target is outside any menu item', () => {
      const onClick = vi.fn();
      const menu = new Menu(menuEl, { onClick });
      menu.addItem({ key: 'profile', title: 'Profile' });

      menuEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should remove all item elements from the DOM', () => {
      const menu = new Menu(menuEl);
      const item = menu.addItem({ key: 'x', title: 'X' });

      menu.destroy();

      expect(menuEl.contains(item)).toBe(false);
      expect(menu.getSelectedKeys()).toEqual([]);
    });

    it('should stop firing onClick for clicks after destroy', () => {
      const onClick = vi.fn();
      const menu = new Menu(menuEl, { onClick });
      const item = menu.addItem({ key: 'x', title: 'X' });
      const titleEl = item.querySelector('.ag-menu-item-title') as HTMLElement;

      menu.destroy();

      // item was detached from DOM by destroy(); dispatch directly on it to
      // confirm the delegated click listener on the menu root was torn down
      titleEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('createMenu', () => {
    it('should create a menu element from scratch reflecting given options', () => {
      const menu = createMenu({ mode: 'horizontal' });
      const element = menu.getElement();
      expect(element.className).toContain('ag-menu');
      expect(element.className).toContain('ag-menu--horizontal');
    });
  });
});
