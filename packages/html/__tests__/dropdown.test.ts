import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Dropdown, MenuItem } from '../src/components/dropdown';

describe('Dropdown Component', () => {
  let container: HTMLDivElement;
  let trigger: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    trigger = document.createElement('button');
    trigger.textContent = 'Menu';
    container.appendChild(trigger);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('basic menu', () => {
    it('should render menu items', () => {
      const items: MenuItem[] = [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' }
      ];

      const dropdown = new Dropdown(trigger, { items });
      const menu = dropdown.getMenu();

      const listItems = menu.querySelectorAll('li');
      expect(listItems).toHaveLength(2);
      expect(listItems[0].textContent).toContain('Item 1');
      expect(listItems[1].textContent).toContain('Item 2');

      dropdown.destroy();
    });

    it('should toggle menu visibility', () => {
      const items: MenuItem[] = [
        { label: 'Item 1', value: 'item1' }
      ];

      const dropdown = new Dropdown(trigger, { items });
      const menu = dropdown.getMenu();

      expect(menu.style.display).toBe('none');

      dropdown.open();
      expect(menu.style.display).not.toBe('none');

      dropdown.close();
      expect(menu.style.display).toBe('none');

      dropdown.destroy();
    });

    it('should call onClick handler', () => {
      const onClick = vi.fn();
      const items: MenuItem[] = [
        { label: 'Item 1', value: 'item1', onClick }
      ];

      const dropdown = new Dropdown(trigger, { items });
      dropdown.open();

      const link = dropdown.getMenu().querySelector('a') as HTMLElement | null;
      if (link) {
        link.click();
      }

      expect(onClick).toHaveBeenCalled();
      dropdown.destroy();
    });
  });

  describe('nested menu', () => {
    it('should render submenu items', () => {
      const items: MenuItem[] = [
        {
          label: 'Parent 1',
          value: 'parent1',
          children: [
            { label: 'Child 1.1', value: 'child1.1' },
            { label: 'Child 1.2', value: 'child1.2' }
          ]
        },
        {
          label: 'Parent 2',
          value: 'parent2',
          children: [
            { label: 'Child 2.1', value: 'child2.1' }
          ]
        }
      ];

      const dropdown = new Dropdown(trigger, { items });
      const menu = dropdown.getMenu();

      // Check parent items
      const parentItems = Array.from(menu.querySelectorAll('li')).filter(
        li => li.parentElement === menu
      );
      expect(parentItems).toHaveLength(2);

      // Check submenus exist
      const submenus = menu.querySelectorAll('.ag-dropdown__submenu');
      expect(submenus.length).toBeGreaterThan(0);

      dropdown.destroy();
    });

    it('should not flatten nested children', () => {
      const items: MenuItem[] = [
        {
          label: 'Parent',
          value: 'parent',
          children: [
            { label: 'Child 1', value: 'child1' },
            { label: 'Child 2', value: 'child2' }
          ]
        }
      ];

      const dropdown = new Dropdown(trigger, { items });
      const menu = dropdown.getMenu();

      // Get the parent li
      const parentLi = menu.querySelector('li');
      expect(parentLi).toBeDefined();

      // Check that submenu is child of parent li, not top-level
      const submenu = parentLi?.querySelector('.ag-dropdown__submenu');
      expect(submenu).toBeDefined();

      // Submenu should have correct children count
      const submenuItems = submenu?.querySelectorAll('li');
      expect(submenuItems?.length).toBe(2);

      dropdown.destroy();
    });

    it('should close menu when submenu item clicked', () => {
      const onClick = vi.fn();
      const items: MenuItem[] = [
        {
          label: 'Parent',
          value: 'parent',
          children: [
            { label: 'Child', value: 'child', onClick }
          ]
        }
      ];

      const dropdown = new Dropdown(trigger, { items, trigger: 'click' });
      dropdown.open();

      const submenuLink = dropdown.getMenu().querySelector('.ag-dropdown__submenu a');
      submenuLink?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onClick).toHaveBeenCalled();
      // Menu should be closed after item click
      expect(dropdown.getMenu().style.display).toBe('none');

      dropdown.destroy();
    });

    it('should handle deeply nested items', () => {
      const items: MenuItem[] = [
        {
          label: 'Level 1',
          value: 'level1',
          children: [
            {
              label: 'Level 2',
              value: 'level2',
              children: [
                { label: 'Level 3', value: 'level3' }
              ]
            }
          ]
        }
      ];

      const dropdown = new Dropdown(trigger, { items });
      const menu = dropdown.getMenu();

      // Should have level 1 items
      const level1Items = menu.querySelectorAll(':scope > li');
      expect(level1Items).toHaveLength(1);

      // Should have level 2 submenu
      const level2Submenu = menu.querySelector('.ag-dropdown__submenu');
      expect(level2Submenu).toBeDefined();

      // Should have level 3 submenu inside level 2
      const level3Submenu = level2Submenu?.querySelector('.ag-dropdown__submenu');
      expect(level3Submenu).toBeDefined();

      dropdown.destroy();
    });
  });

  describe('disabled items', () => {
    it('should mark disabled items', () => {
      const items: MenuItem[] = [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Disabled', value: 'disabled', disabled: true }
      ];

      const dropdown = new Dropdown(trigger, { items });
      const menu = dropdown.getMenu();

      const links = menu.querySelectorAll('a');
      expect(links[0].className).toContain('ag-dropdown__item');
      expect(links[1].className).toContain('ag-dropdown__item--disabled');

      dropdown.destroy();
    });

    it('should not call onClick for disabled items', () => {
      const onClick = vi.fn();
      const items: MenuItem[] = [
        { label: 'Item', value: 'item', disabled: true, onClick }
      ];

      const dropdown = new Dropdown(trigger, { items });
      dropdown.open();

      const link = dropdown.getMenu().querySelector('a') as HTMLElement | null;
      if (link) {
        link.click();
      }

      expect(onClick).not.toHaveBeenCalled();
      dropdown.destroy();
    });

    it('should disable nested items', () => {
      const onClick = vi.fn();
      const items: MenuItem[] = [
        {
          label: 'Parent',
          value: 'parent',
          children: [
            { label: 'Child', value: 'child', disabled: true, onClick }
          ]
        }
      ];

      const dropdown = new Dropdown(trigger, { items });
      dropdown.open();

      const childLink = dropdown.getMenu().querySelector('.ag-dropdown__submenu a') as HTMLElement | null;
      expect(childLink?.className).toContain('ag-dropdown__item--disabled');

      if (childLink) {
        childLink.click();
      }
      expect(onClick).not.toHaveBeenCalled();

      dropdown.destroy();
    });
  });

  describe('hover trigger', () => {
    it('should open on hover', async () => {
      const items: MenuItem[] = [
        { label: 'Item', value: 'item' }
      ];

      const dropdown = new Dropdown(trigger, { items, trigger: 'hover' });
      const menu = dropdown.getMenu();

      expect(menu.style.display).toBe('none');

      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      // Menu should be visible after hover
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(menu.style.display).not.toBe('none');
      dropdown.destroy();
    });
  });

  describe('placement', () => {
    it('should apply placement class', () => {
      const items: MenuItem[] = [
        { label: 'Item', value: 'item' }
      ];

      const dropdown = new Dropdown(trigger, {
        items,
        placement: 'top'
      });

      const menu = dropdown.getMenu();
      expect(menu.className).toContain('ag-dropdown--top');

      dropdown.destroy();
    });
  });

  describe('destroy', () => {
    it('should remove menu element', () => {
      const items: MenuItem[] = [
        { label: 'Item', value: 'item' }
      ];

      const dropdown = new Dropdown(trigger, { items });
      const menu = dropdown.getMenu();
      const parent = menu.parentElement;

      expect(parent).toBe(document.body);

      dropdown.destroy();

      expect(menu.parentElement).toBeNull();
    });
  });
});
