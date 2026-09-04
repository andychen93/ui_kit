import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Descriptions, createDescriptions } from '../src/components/descriptions';

describe('Descriptions Component', () => {
  let container: HTMLDivElement;
  let descEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    descEl = document.createElement('div');
    container.appendChild(descEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const desc = new Descriptions(descEl);
      expect(desc.getElement()).toBe(descEl);
    });

    it('should initialize with selector', () => {
      descEl.id = 'test-desc';
      const desc = new Descriptions('#test-desc');
      expect(desc.getElement()).toBe(descEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Descriptions('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should apply default size class and no bordered modifier', () => {
      new Descriptions(descEl);
      expect(descEl.className).toContain('ag-descriptions');
      expect(descEl.className).toContain('ag-descriptions--md');
      expect(descEl.className).not.toContain('ag-descriptions--bordered');
    });

    it('should apply the bordered modifier class when bordered is true', () => {
      new Descriptions(descEl, { bordered: true });
      expect(descEl.className).toContain('ag-descriptions--bordered');
    });

    it('should apply a custom size class', () => {
      new Descriptions(descEl, { size: 'lg' });
      expect(descEl.className).toContain('ag-descriptions--lg');
    });

    it('should not render a header when no title is provided', () => {
      new Descriptions(descEl);
      expect(descEl.querySelector('.ag-descriptions-header')).toBeNull();
    });

    it('should render a header with the title text when provided', () => {
      new Descriptions(descEl, { title: 'User Info' });
      const title = descEl.querySelector('.ag-descriptions-title');
      expect(title?.textContent).toBe('User Info');
    });

    it('should pick up pre-existing item elements already in the DOM', () => {
      const existingItem = document.createElement('div');
      existingItem.className = 'ag-descriptions-item';
      descEl.appendChild(existingItem);

      const desc = new Descriptions(descEl);
      expect(desc.getItems()).toContain(existingItem);
    });
  });

  describe('addItem', () => {
    it('should append a new item with label and content', () => {
      const desc = new Descriptions(descEl);
      const item = desc.addItem({ label: 'Name', content: 'John' });

      expect(descEl.contains(item)).toBe(true);
      expect(item.querySelector('.ag-descriptions-item-label')?.textContent).toBe('Name');
      expect(item.querySelector('.ag-descriptions-item-content')?.textContent).toBe('John');
      expect(desc.getItems()).toContain(item);
    });

    it('should set flex basis on the item based on column count when bordered', () => {
      const desc = new Descriptions(descEl, { bordered: true, column: 4 });
      const item = desc.addItem({ label: 'Age', content: '30' });
      expect(item.style.flex).toBe('0 0 25%');
    });

    it('should not set flex basis when not bordered', () => {
      const desc = new Descriptions(descEl, { bordered: false });
      const item = desc.addItem({ label: 'Age', content: '30' });
      expect(item.style.flex).toBe('');
    });

    it('should not render a label element when label is omitted', () => {
      const desc = new Descriptions(descEl);
      const item = desc.addItem({ content: 'Just content' });
      expect(item.querySelector('.ag-descriptions-item-label')).toBeNull();
    });
  });

  describe('setTitle', () => {
    it('should create a header if none existed and set the text', () => {
      const desc = new Descriptions(descEl);
      expect(descEl.querySelector('.ag-descriptions-header')).toBeNull();
      desc.setTitle('New Title');
      expect(descEl.querySelector('.ag-descriptions-title')?.textContent).toBe('New Title');
    });

    it('should update the text of an existing header', () => {
      const desc = new Descriptions(descEl, { title: 'Old Title' });
      desc.setTitle('Updated Title');
      expect(descEl.querySelector('.ag-descriptions-title')?.textContent).toBe('Updated Title');
      expect(descEl.querySelectorAll('.ag-descriptions-header').length).toBe(1);
    });

    it('should remove the header when set to an empty string', () => {
      const desc = new Descriptions(descEl, { title: 'Old Title' });
      desc.setTitle('');
      expect(descEl.querySelector('.ag-descriptions-header')).toBeNull();
    });
  });

  describe('setColumn', () => {
    it('should update flex basis of existing items when bordered', () => {
      const desc = new Descriptions(descEl, { bordered: true, column: 3 });
      const item = desc.addItem({ label: 'A', content: 'B' });
      desc.setColumn(2);
      expect(item.style.flex).toBe('0 0 50%');
    });

    it('should not touch item flex when not bordered', () => {
      const desc = new Descriptions(descEl, { bordered: false });
      const item = desc.addItem({ label: 'A', content: 'B' });
      desc.setColumn(2);
      expect(item.style.flex).toBe('');
    });
  });

  describe('destroy', () => {
    it('should remove all item elements from the DOM', () => {
      const desc = new Descriptions(descEl);
      desc.addItem({ label: 'A', content: '1' });
      desc.addItem({ label: 'B', content: '2' });
      expect(descEl.querySelectorAll('.ag-descriptions-item').length).toBe(2);

      desc.destroy();
      expect(descEl.querySelectorAll('.ag-descriptions-item').length).toBe(0);
      expect(desc.getItems().length).toBe(0);
    });

    it('should not remove the root element itself', () => {
      const desc = new Descriptions(descEl);
      desc.destroy();
      expect(descEl.parentElement).toBe(container);
    });
  });

  describe('createDescriptions', () => {
    it('should create a descriptions element from scratch with options applied', () => {
      const desc = createDescriptions({ title: 'Profile', bordered: true });
      const element = desc.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.className).toContain('ag-descriptions--bordered');
      expect(element.querySelector('.ag-descriptions-title')?.textContent).toBe('Profile');
    });
  });
});
