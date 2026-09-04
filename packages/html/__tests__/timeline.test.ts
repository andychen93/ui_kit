import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Timeline, createTimeline } from '../src/components/timeline';

describe('Timeline Component', () => {
  let container: HTMLDivElement;
  let timelineEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    timelineEl = document.createElement('div');
    container.appendChild(timelineEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const timeline = new Timeline(timelineEl);
      expect(timeline.getElement()).toBe(timelineEl);
    });

    it('should initialize with selector', () => {
      timelineEl.id = 'test-timeline';
      const timeline = new Timeline('#test-timeline');
      expect(timeline.getElement()).toBe(timelineEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Timeline('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should default to alternate mode class', () => {
      new Timeline(timelineEl);
      expect(timelineEl.className).toContain('ag-timeline');
      expect(timelineEl.className).toContain('ag-timeline--alternate');
    });

    it('should apply the left mode class when specified', () => {
      new Timeline(timelineEl, { mode: 'left' });
      expect(timelineEl.className).toContain('ag-timeline--left');
      expect(timelineEl.className).not.toContain('ag-timeline--alternate');
    });

    it('should not render a pending item by default', () => {
      new Timeline(timelineEl);
      expect(timelineEl.querySelector('.ag-timeline-item-pending')).toBeNull();
    });

    it('should render a pending item with pending text when enabled', () => {
      new Timeline(timelineEl, { pending: true, pendingText: 'Loading more...' });
      const pendingItem = timelineEl.querySelector('.ag-timeline-item-pending');
      expect(pendingItem).not.toBeNull();
      expect(pendingItem?.querySelector('.ag-timeline-content')?.textContent).toBe('Loading more...');
      expect(timelineEl.className).toContain('ag-timeline--pending');
    });

    it('should pick up pre-existing item elements already in the DOM', () => {
      const existingItem = document.createElement('div');
      existingItem.className = 'ag-timeline-item';
      timelineEl.appendChild(existingItem);

      const timeline = new Timeline(timelineEl);
      expect(timeline.getItems()).toContain(existingItem);
    });
  });

  describe('addItem', () => {
    it('should append an item with the given content', () => {
      const timeline = new Timeline(timelineEl);
      const item = timeline.addItem('Something happened');

      expect(timelineEl.contains(item)).toBe(true);
      expect(item.querySelector('.ag-timeline-content')?.textContent).toBe('Something happened');
      expect(timeline.getItems()).toContain(item);
    });

    it('should apply a custom node color when provided', () => {
      const timeline = new Timeline(timelineEl);
      const item = timeline.addItem('Event', 'red');
      const node = item.querySelector('.ag-timeline-node') as HTMLElement;
      expect(node.style.backgroundColor).toBe('red');
    });

    it('should not set a background color when no color is provided', () => {
      const timeline = new Timeline(timelineEl);
      const item = timeline.addItem('Event');
      const node = item.querySelector('.ag-timeline-node') as HTMLElement;
      expect(node.style.backgroundColor).toBe('');
    });
  });

  describe('setPending', () => {
    it('should add a pending item and the pending class when set to true', () => {
      const timeline = new Timeline(timelineEl);
      timeline.setPending(true);
      expect(timelineEl.className).toContain('ag-timeline--pending');
      expect(timelineEl.querySelector('.ag-timeline-item-pending')).not.toBeNull();
    });

    it('should remove the pending class when set to false', () => {
      const timeline = new Timeline(timelineEl, { pending: true });
      timeline.setPending(false);
      expect(timelineEl.className).not.toContain('ag-timeline--pending');
    });
  });

  describe('setPendingText', () => {
    it('should update the pending item text when pending is active', () => {
      const timeline = new Timeline(timelineEl, { pending: true, pendingText: 'Loading' });
      timeline.setPendingText('Almost done');
      const content = timelineEl.querySelector('.ag-timeline-item-pending .ag-timeline-content');
      expect(content?.textContent).toBe('Almost done');
    });

    it('should not throw when pending is not active', () => {
      const timeline = new Timeline(timelineEl);
      expect(() => timeline.setPendingText('Ignored')).not.toThrow();
      expect(timelineEl.querySelector('.ag-timeline-item-pending')).toBeNull();
    });
  });

  describe('setMode', () => {
    it('should switch mode classes', () => {
      const timeline = new Timeline(timelineEl);
      timeline.setMode('right');
      expect(timelineEl.className).toContain('ag-timeline--right');
      expect(timelineEl.className).not.toContain('ag-timeline--alternate');
    });
  });

  describe('destroy', () => {
    it('should remove all item elements from the DOM', () => {
      const timeline = new Timeline(timelineEl);
      timeline.addItem('A');
      timeline.addItem('B');
      expect(timelineEl.querySelectorAll('.ag-timeline-item').length).toBe(2);

      timeline.destroy();
      expect(timelineEl.querySelectorAll('.ag-timeline-item').length).toBe(0);
      expect(timeline.getItems().length).toBe(0);
    });

    it('should not remove the root element itself', () => {
      const timeline = new Timeline(timelineEl);
      timeline.destroy();
      expect(timelineEl.parentElement).toBe(container);
    });
  });

  describe('createTimeline', () => {
    it('should create a timeline element from scratch with options applied', () => {
      const timeline = createTimeline({ mode: 'left', pending: true, pendingText: 'Wait' });
      const element = timeline.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.className).toContain('ag-timeline--left');
      expect(element.querySelector('.ag-timeline-item-pending .ag-timeline-content')?.textContent).toBe('Wait');
    });
  });
});
