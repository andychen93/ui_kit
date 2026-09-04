import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Tag, createTag, TagVariant } from '../src/components/tag';

describe('Tag Component', () => {
  let container: HTMLDivElement;
  let tagEl: HTMLSpanElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    tagEl = document.createElement('span');
    container.appendChild(tagEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const tag = new Tag(tagEl);
      expect(tag.getElement()).toBe(tagEl);
    });

    it('should initialize with element selector', () => {
      tagEl.id = 'test-tag';
      const tag = new Tag('#test-tag');
      expect(tag.getElement()).toBe(tagEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Tag('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should apply default classes without a variant suffix for "default"', () => {
      new Tag(tagEl);
      expect(tagEl.className).toContain('ag-tag');
      expect(tagEl.className).toContain('ag-tag--md');
      expect(tagEl.className).not.toContain('ag-tag--default');
      expect(tagEl.className).not.toContain('ag-tag--closeable');
    });

    it('should apply a variant class for non-default variants', () => {
      const variant: TagVariant = 'success';
      new Tag(tagEl, { variant });
      expect(tagEl.className).toContain('ag-tag--success');
    });

    it('should apply size class', () => {
      new Tag(tagEl, { size: 'lg' });
      expect(tagEl.className).toContain('ag-tag--lg');
      expect(tagEl.className).not.toContain('ag-tag--md');
    });

    it('should render a close button when closeable', () => {
      new Tag(tagEl, { closeable: true });
      expect(tagEl.querySelector('.ag-tag-close')).not.toBeNull();
      expect(tagEl.className).toContain('ag-tag--closeable');
    });

    it('should not render a close button by default', () => {
      new Tag(tagEl);
      expect(tagEl.querySelector('.ag-tag-close')).toBeNull();
    });
  });

  describe('variant management', () => {
    it('should set variant and update classes', () => {
      const tag = new Tag(tagEl);
      tag.setVariant('danger');
      expect(tag.getVariant()).toBe('danger');
      expect(tagEl.className).toContain('ag-tag--danger');
    });

    it('should get default variant', () => {
      const tag = new Tag(tagEl);
      expect(tag.getVariant()).toBe('default');
    });
  });

  describe('size management', () => {
    it('should set size and update classes', () => {
      const tag = new Tag(tagEl);
      tag.setSize('sm');
      expect(tag.getSize()).toBe('sm');
      expect(tagEl.className).toContain('ag-tag--sm');
      expect(tagEl.className).not.toContain('ag-tag--md');
    });

    it('should get default size', () => {
      const tag = new Tag(tagEl);
      expect(tag.getSize()).toBe('md');
    });
  });

  describe('close', () => {
    it('should remove the element from the DOM and call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      new Tag(tagEl, { closeable: true, onClose });

      const closeBtn = tagEl.querySelector('.ag-tag-close') as HTMLButtonElement;
      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(container.contains(tagEl)).toBe(false);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should be safe to call close() more than once', () => {
      const onClose = vi.fn();
      const tag = new Tag(tagEl, { closeable: true, onClose });
      tag.close();
      tag.close();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should remove listeners as part of close (via destroy)', () => {
      const onClose = vi.fn();
      const tag = new Tag(tagEl, { closeable: true, onClose });
      const closeBtn = tagEl.querySelector('.ag-tag-close') as HTMLButtonElement;
      tag.close();
      // Dispatching another click on the detached button must not call onClose again.
      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    it('should remove the close button but keep the tag element in the DOM', () => {
      const tag = new Tag(tagEl, { closeable: true });
      tag.destroy();
      expect(tagEl.querySelector('.ag-tag-close')).toBeNull();
      expect(container.contains(tagEl)).toBe(true);
    });

    it('should stop close button clicks from firing onClose after destroy', () => {
      const onClose = vi.fn();
      const tag = new Tag(tagEl, { closeable: true, onClose });
      const closeBtn = tagEl.querySelector('.ag-tag-close') as HTMLButtonElement;

      tag.destroy();

      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('createTag', () => {
    it('should create a tag element from scratch with the given options', () => {
      const tag = createTag({ variant: 'primary', size: 'sm', closeable: true });
      const element = tag.getElement();
      expect(element.tagName).toBe('SPAN');
      expect(element.className).toContain('ag-tag');
      expect(element.className).toContain('ag-tag--primary');
      expect(element.className).toContain('ag-tag--sm');
      expect(element.querySelector('.ag-tag-close')).not.toBeNull();
    });

    it('should wire up onClose for the created tag', () => {
      const onClose = vi.fn();
      const tag = createTag({ closeable: true, onClose });
      const closeBtn = tag.getElement().querySelector('.ag-tag-close') as HTMLButtonElement;
      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
