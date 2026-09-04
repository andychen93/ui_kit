import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Badge, createBadge } from '../src/components/badge';

describe('Badge Component', () => {
  let container: HTMLDivElement;
  let badgeEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    badgeEl = document.createElement('div');
    container.appendChild(badgeEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const badge = new Badge(badgeEl);
      expect(badge.getElement()).toBe(badgeEl);
    });

    it('should initialize with element selector', () => {
      badgeEl.id = 'test-badge';
      const badge = new Badge('#test-badge');
      expect(badge.getElement()).toBe(badgeEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Badge('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should apply default variant and size classes', () => {
      new Badge(badgeEl);
      expect(badgeEl.className).toContain('ag-badge');
      expect(badgeEl.className).toContain('ag-badge--primary');
      expect(badgeEl.className).toContain('ag-badge--md');
    });

    it('should render count content of 0 by default', () => {
      new Badge(badgeEl);
      const content = badgeEl.querySelector('.ag-badge-content');
      expect(content?.textContent).toBe('0');
    });

    it('should render a numeric count', () => {
      new Badge(badgeEl, { count: 5 });
      expect(badgeEl.querySelector('.ag-badge-content')?.textContent).toBe('5');
    });

    it('should render overflow text when count exceeds overflowCount', () => {
      new Badge(badgeEl, { count: 150, overflowCount: 99 });
      expect(badgeEl.querySelector('.ag-badge-content')?.textContent).toBe('99+');
    });

    it('should render a string count as-is', () => {
      new Badge(badgeEl, { count: 'new' });
      expect(badgeEl.querySelector('.ag-badge-content')?.textContent).toBe('new');
    });

    it('should apply the dot class when dot option is true', () => {
      new Badge(badgeEl, { dot: true });
      const content = badgeEl.querySelector('.ag-badge-content');
      expect(content?.className).toContain('ag-badge-dot');
    });

    it('should apply variant class', () => {
      new Badge(badgeEl, { variant: 'danger' });
      expect(badgeEl.className).toContain('ag-badge--danger');
      expect(badgeEl.className).not.toContain('ag-badge--primary');
    });

    it('should apply size class', () => {
      new Badge(badgeEl, { size: 'lg' });
      expect(badgeEl.className).toContain('ag-badge--lg');
      expect(badgeEl.className).not.toContain('ag-badge--md');
    });
  });

  describe('setCount', () => {
    it('should update the rendered count text', () => {
      const badge = new Badge(badgeEl, { count: 1 });
      badge.setCount(7);
      expect(badgeEl.querySelector('.ag-badge-content')?.textContent).toBe('7');
    });

    it('should show overflow text when the new count exceeds overflowCount', () => {
      const badge = new Badge(badgeEl, { count: 1, overflowCount: 10 });
      badge.setCount(20);
      expect(badgeEl.querySelector('.ag-badge-content')?.textContent).toBe('10+');
    });
  });

  describe('setDot', () => {
    it('should add the dot class when set to true', () => {
      const badge = new Badge(badgeEl, { count: 3 });
      badge.setDot(true);
      expect(badgeEl.querySelector('.ag-badge-content')?.className).toBe(
        'ag-badge-content ag-badge-dot'
      );
    });

    it('should remove the dot class when set to false', () => {
      const badge = new Badge(badgeEl, { dot: true });
      badge.setDot(false);
      expect(badgeEl.querySelector('.ag-badge-content')?.className).toBe('ag-badge-content');
    });
  });

  describe('variant management', () => {
    it('should set variant and update classes', () => {
      const badge = new Badge(badgeEl);
      badge.setVariant('success');
      expect(badge.getVariant()).toBe('success');
      expect(badgeEl.className).toContain('ag-badge--success');
      expect(badgeEl.className).not.toContain('ag-badge--primary');
    });

    it('should get default variant', () => {
      const badge = new Badge(badgeEl);
      expect(badge.getVariant()).toBe('primary');
    });
  });

  describe('size management', () => {
    it('should set size and update classes', () => {
      const badge = new Badge(badgeEl);
      badge.setSize('sm');
      expect(badge.getSize()).toBe('sm');
      expect(badgeEl.className).toContain('ag-badge--sm');
      expect(badgeEl.className).not.toContain('ag-badge--md');
    });

    it('should get default size', () => {
      const badge = new Badge(badgeEl);
      expect(badge.getSize()).toBe('md');
    });
  });

  describe('destroy', () => {
    it('should remove the count element from the DOM', () => {
      const badge = new Badge(badgeEl, { count: 5 });
      expect(badgeEl.querySelector('.ag-badge-content')).not.toBeNull();
      badge.destroy();
      expect(badgeEl.querySelector('.ag-badge-content')).toBeNull();
    });

    it('should not remove the badge root element itself', () => {
      const badge = new Badge(badgeEl, { count: 5 });
      badge.destroy();
      expect(container.contains(badgeEl)).toBe(true);
    });
  });

  describe('createBadge', () => {
    it('should create a badge element from scratch with the given options', () => {
      const badge = createBadge({ count: 42, variant: 'info' });
      const element = badge.getElement();
      expect(element.tagName).toBe('DIV');
      expect(element.className).toContain('ag-badge');
      expect(element.className).toContain('ag-badge--info');
      expect(element.querySelector('.ag-badge-content')?.textContent).toBe('42');
    });
  });
});
