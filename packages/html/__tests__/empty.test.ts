import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Empty, createEmpty } from '../src/components/empty';

describe('Empty Component', () => {
  let container: HTMLDivElement;
  let emptyEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    emptyEl = document.createElement('div');
    container.appendChild(emptyEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const empty = new Empty(emptyEl);
      expect(empty.getElement()).toBe(emptyEl);
    });

    it('should initialize with selector', () => {
      emptyEl.id = 'test-empty';
      const empty = new Empty('#test-empty');
      expect(empty.getElement()).toBe(emptyEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Empty('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should apply base class with no image modifier for default "empty" image', () => {
      new Empty(emptyEl);
      expect(emptyEl.className).toContain('ag-empty');
      expect(emptyEl.className).not.toContain('ag-empty--error');
      expect(emptyEl.className).not.toContain('ag-empty--network');
      expect(emptyEl.className).not.toContain('ag-empty--noData');
    });

    it('should apply the error modifier class when image is "error"', () => {
      new Empty(emptyEl, { image: 'error' });
      expect(emptyEl.className).toContain('ag-empty--error');
    });

    it('should apply the network modifier class when image is "network"', () => {
      new Empty(emptyEl, { image: 'network' });
      expect(emptyEl.className).toContain('ag-empty--network');
    });

    it('should render an image element containing an svg', () => {
      new Empty(emptyEl);
      const image = emptyEl.querySelector('.ag-empty-image');
      expect(image).not.toBeNull();
      expect(image?.querySelector('svg')).not.toBeNull();
    });

    it('should default the description to "No Data"', () => {
      new Empty(emptyEl);
      expect(emptyEl.querySelector('.ag-empty-description')?.textContent).toBe('No Data');
    });

    it('should render a custom description when provided', () => {
      new Empty(emptyEl, { description: 'Nothing here' });
      expect(emptyEl.querySelector('.ag-empty-description')?.textContent).toBe('Nothing here');
    });
  });

  describe('setImage', () => {
    it('should change the rendered svg markup when the image type changes', () => {
      const empty = new Empty(emptyEl);
      const before = emptyEl.querySelector('.ag-empty-image')?.innerHTML;
      empty.setImage('error');
      const after = emptyEl.querySelector('.ag-empty-image')?.innerHTML;
      expect(after).not.toBe(before);
      expect(after).toContain('<svg');
    });

    it('should keep the image element in the DOM after switching type', () => {
      const empty = new Empty(emptyEl);
      empty.setImage('noData');
      expect(emptyEl.querySelector('.ag-empty-image svg')).not.toBeNull();
    });
  });

  describe('setDescription', () => {
    it('should update the description text content', () => {
      const empty = new Empty(emptyEl);
      empty.setDescription('Updated message');
      expect(emptyEl.querySelector('.ag-empty-description')?.textContent).toBe('Updated message');
    });
  });

  describe('destroy', () => {
    it('should remove the image element from the DOM', () => {
      const empty = new Empty(emptyEl);
      expect(emptyEl.querySelector('.ag-empty-image')).not.toBeNull();
      empty.destroy();
      expect(emptyEl.querySelector('.ag-empty-image')).toBeNull();
    });

    it('should leave the description element in place', () => {
      const empty = new Empty(emptyEl, { description: 'Still here' });
      empty.destroy();
      expect(emptyEl.querySelector('.ag-empty-description')?.textContent).toBe('Still here');
    });

    it('should not remove the root element itself', () => {
      const empty = new Empty(emptyEl);
      empty.destroy();
      expect(emptyEl.parentElement).toBe(container);
    });
  });

  describe('createEmpty', () => {
    it('should create an empty element from scratch with options applied', () => {
      const empty = createEmpty({ image: 'network', description: 'No connection' });
      const element = empty.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.className).toContain('ag-empty--network');
      expect(element.querySelector('.ag-empty-description')?.textContent).toBe('No connection');
    });
  });
});
