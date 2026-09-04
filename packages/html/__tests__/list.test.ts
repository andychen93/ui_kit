import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { List, createList } from '../src/components/list';

describe('List Component', () => {
  let container: HTMLDivElement;
  let listEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    listEl = document.createElement('div');
    container.appendChild(listEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const list = new List(listEl);
      expect(list.getElement()).toBe(listEl);
    });

    it('should initialize with selector', () => {
      listEl.id = 'test-list';
      const list = new List('#test-list');
      expect(list.getElement()).toBe(listEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new List('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should apply the split class by default', () => {
      new List(listEl);
      expect(listEl.className).toContain('ag-list');
      expect(listEl.className).toContain('ag-list--split');
    });

    it('should omit the split class when split is false', () => {
      new List(listEl, { split: false });
      expect(listEl.className).not.toContain('ag-list--split');
    });

    it('should apply the bordered class when bordered is true', () => {
      new List(listEl, { bordered: true });
      expect(listEl.className).toContain('ag-list--bordered');
    });

    it('should apply a custom size class', () => {
      new List(listEl, { size: 'sm' });
      expect(listEl.className).toContain('ag-list--sm');
    });

    it('should pick up pre-existing item elements already in the DOM', () => {
      const existingItem = document.createElement('div');
      existingItem.className = 'ag-list-item';
      listEl.appendChild(existingItem);

      const list = new List(listEl);
      expect(list.getItems()).toContain(existingItem);
    });
  });

  describe('addItem', () => {
    it('should append an item with title and description', () => {
      const list = new List(listEl);
      const item = list.addItem({ title: 'Item 1', description: 'Desc 1' });

      expect(listEl.contains(item)).toBe(true);
      expect(item.querySelector('.ag-list-item-title')?.textContent).toBe('Item 1');
      expect(item.querySelector('.ag-list-item-description')?.textContent).toBe('Desc 1');
      expect(list.getItems()).toContain(item);
    });

    it('should render action and extra elements when provided', () => {
      const list = new List(listEl);
      const item = list.addItem({ title: 'Item', action: 'Edit', extra: 'Extra info' });

      expect(item.querySelector('.ag-list-item-action')?.textContent).toBe('Edit');
      expect(item.querySelector('.ag-list-item-extra')?.textContent).toBe('Extra info');
    });

    it('should not render action or extra elements when omitted', () => {
      const list = new List(listEl);
      const item = list.addItem({ title: 'Item' });

      expect(item.querySelector('.ag-list-item-action')).toBeNull();
      expect(item.querySelector('.ag-list-item-extra')).toBeNull();
    });

    it('should increase the items count in order', () => {
      const list = new List(listEl);
      list.addItem({ title: 'First' });
      list.addItem({ title: 'Second' });
      expect(list.getItems().length).toBe(2);
      expect(list.getItems()[0].querySelector('.ag-list-item-title')?.textContent).toBe('First');
      expect(list.getItems()[1].querySelector('.ag-list-item-title')?.textContent).toBe('Second');
    });
  });

  describe('removeItem', () => {
    it('should remove the item at the given index from the DOM and items array', () => {
      const list = new List(listEl);
      list.addItem({ title: 'First' });
      const second = list.addItem({ title: 'Second' });

      list.removeItem(0);

      expect(list.getItems().length).toBe(1);
      expect(list.getItems()[0]).toBe(second);
      expect(listEl.contains(second)).toBe(true);
      expect(listEl.querySelectorAll('.ag-list-item').length).toBe(1);
    });

    it('should do nothing for an out-of-range index', () => {
      const list = new List(listEl);
      list.addItem({ title: 'Only' });
      list.removeItem(5);
      expect(list.getItems().length).toBe(1);
    });
  });

  describe('setSplit', () => {
    it('should add the split class when set to true', () => {
      const list = new List(listEl, { split: false });
      expect(listEl.className).not.toContain('ag-list--split');
      list.setSplit(true);
      expect(listEl.className).toContain('ag-list--split');
    });

    it('should remove the split class when set to false', () => {
      const list = new List(listEl);
      list.setSplit(false);
      expect(listEl.className).not.toContain('ag-list--split');
    });
  });

  describe('destroy', () => {
    it('should remove all item elements from the DOM', () => {
      const list = new List(listEl);
      list.addItem({ title: 'A' });
      list.addItem({ title: 'B' });
      expect(listEl.querySelectorAll('.ag-list-item').length).toBe(2);

      list.destroy();
      expect(listEl.querySelectorAll('.ag-list-item').length).toBe(0);
      expect(list.getItems().length).toBe(0);
    });

    it('should not remove the root element itself', () => {
      const list = new List(listEl);
      list.destroy();
      expect(listEl.parentElement).toBe(container);
    });
  });

  describe('createList', () => {
    it('should create a list element from scratch with options applied', () => {
      const list = createList({ bordered: true, size: 'lg' });
      const element = list.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.className).toContain('ag-list--bordered');
      expect(element.className).toContain('ag-list--lg');
    });
  });
});
