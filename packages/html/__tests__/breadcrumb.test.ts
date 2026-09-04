import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Breadcrumb, createBreadcrumb } from '../src/components/breadcrumb';

describe('Breadcrumb Component', () => {
  let container: HTMLDivElement;
  let breadcrumbEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    breadcrumbEl = document.createElement('div');
    container.appendChild(breadcrumbEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with an element reference', () => {
      const bc = new Breadcrumb(breadcrumbEl);
      expect(bc.getElement()).toBe(breadcrumbEl);
    });

    it('should initialize with a CSS selector string', () => {
      breadcrumbEl.id = 'test-breadcrumb';
      const bc = new Breadcrumb('#test-breadcrumb');
      expect(bc.getElement()).toBe(breadcrumbEl);
    });

    it('should throw when the selector does not match any element', () => {
      expect(() => new Breadcrumb('#does-not-exist')).toThrow(
        'Element not found for selector: #does-not-exist'
      );
    });
  });

  describe('initial render', () => {
    it('should render items with a link for items that have href, separated by the default separator', () => {
      const bc = new Breadcrumb(breadcrumbEl, {
        items: [
          { title: 'Home', href: '/' },
          { title: 'Detail', href: '/detail' },
        ],
      });

      // structure: [item0, separator, item1]
      expect(breadcrumbEl.children.length).toBe(3);

      const item0 = breadcrumbEl.children[0] as HTMLElement;
      expect(item0.className).toBe('ag-breadcrumb-item');
      const link0 = item0.querySelector('a.ag-breadcrumb-link');
      expect(link0?.textContent).toBe('Home');
      expect(link0?.getAttribute('href')).toBe('/');

      const sep = breadcrumbEl.children[1] as HTMLElement;
      expect(sep.className).toBe('ag-breadcrumb-separator');
      expect(sep.textContent).toBe('/');

      const item1 = breadcrumbEl.children[2] as HTMLElement;
      const link1 = item1.querySelector('a.ag-breadcrumb-link');
      expect(link1?.textContent).toBe('Detail');
      expect(link1?.getAttribute('href')).toBe('/detail');
    });

    it('should render a plain text span for items without href', () => {
      const bc = new Breadcrumb(breadcrumbEl, {
        items: [{ title: 'Plain' }],
      });

      const item0 = breadcrumbEl.children[0] as HTMLElement;
      expect(item0.querySelector('a')).toBeNull();
      const text = item0.querySelector('span.ag-breadcrumb-text');
      expect(text?.textContent).toBe('Plain');
    });

    it('should use a custom separator when provided', () => {
      const bc = new Breadcrumb(breadcrumbEl, {
        separator: '>',
        items: [{ title: 'A' }, { title: 'B' }],
      });

      const sep = breadcrumbEl.querySelector('.ag-breadcrumb-separator');
      expect(sep?.textContent).toBe('>');
    });

    it('should not render any separator before the first item', () => {
      const bc = new Breadcrumb(breadcrumbEl, {
        items: [{ title: 'Only' }],
      });

      expect(breadcrumbEl.querySelector('.ag-breadcrumb-separator')).toBeNull();
    });
  });

  describe('getItems / getElement', () => {
    it('should track crumb elements distinct from separators', () => {
      const bc = new Breadcrumb(breadcrumbEl, {
        items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
      });

      const items = bc.getItems();
      expect(items.length).toBe(3);
      items.forEach(item => {
        expect(item.className).toBe('ag-breadcrumb-item');
      });
    });

    it('should return the underlying element via getElement', () => {
      const bc = new Breadcrumb(breadcrumbEl);
      expect(bc.getElement()).toBe(breadcrumbEl);
    });
  });

  describe('addItem', () => {
    it('should append a new separator and crumb reflecting the given item', () => {
      const bc = new Breadcrumb(breadcrumbEl, {
        items: [{ title: 'Home', href: '/' }],
      });

      const crumb = bc.addItem({ title: 'New', href: '/new' });

      expect(breadcrumbEl.contains(crumb)).toBe(true);
      expect(crumb.querySelector('a')?.textContent).toBe('New');
      expect(bc.getItems().length).toBe(2);
      // item0 (first item, no leading separator), new separator, new crumb
      expect(breadcrumbEl.children.length).toBe(3);
      expect(breadcrumbEl.children[1].className).toBe('ag-breadcrumb-separator');
      expect(breadcrumbEl.children[2]).toBe(crumb);
    });

    it('should render text-only crumbs for items without href', () => {
      const bc = new Breadcrumb(breadcrumbEl);
      const crumb = bc.addItem({ title: 'NoLink' });
      expect(crumb.querySelector('a')).toBeNull();
      expect(crumb.querySelector('.ag-breadcrumb-text')?.textContent).toBe('NoLink');
    });
  });

  describe('removeItem', () => {
    it('should remove the item and the separator preceding it', () => {
      const bc = new Breadcrumb(breadcrumbEl, {
        items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
      });

      expect(breadcrumbEl.children.length).toBe(5); // A sep B sep C

      bc.removeItem(1); // remove B and the separator before it

      expect(bc.getItems().length).toBe(2);
      expect(bc.getItems().map(i => i.textContent)).toEqual(['A', 'C']);
      expect(breadcrumbEl.querySelectorAll('.ag-breadcrumb-separator').length).toBe(1);
      expect(breadcrumbEl.contains(bc.getItems()[0])).toBe(true);
      expect(breadcrumbEl.contains(bc.getItems()[1])).toBe(true);
    });

    it('should do nothing for an out-of-range index', () => {
      const bc = new Breadcrumb(breadcrumbEl, {
        items: [{ title: 'A' }],
      });
      bc.removeItem(5);
      expect(bc.getItems().length).toBe(1);
    });
  });

  describe('destroy', () => {
    it('should remove all crumb elements from the DOM and clear items', () => {
      const bc = new Breadcrumb(breadcrumbEl, {
        items: [{ title: 'A' }, { title: 'B' }],
      });
      const crumbs = bc.getItems();

      bc.destroy();

      expect(bc.getItems()).toEqual([]);
      crumbs.forEach(crumb => {
        expect(breadcrumbEl.contains(crumb)).toBe(false);
      });
    });
  });

  describe('createBreadcrumb', () => {
    it('should create a breadcrumb element from scratch reflecting given items', () => {
      const bc = createBreadcrumb({
        items: [{ title: 'Root', href: '/' }],
      });
      const element = bc.getElement();
      expect(element.className).toBe('ag-breadcrumb');
      expect(element.querySelector('a')?.textContent).toBe('Root');
    });
  });
});
