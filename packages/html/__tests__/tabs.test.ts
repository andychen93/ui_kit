import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Tabs, createTabs } from '../src/components/tabs';

describe('Tabs Component', () => {
  let container: HTMLDivElement;
  let el: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    el = document.createElement('div');
    container.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const tabs = new Tabs(el);
      expect(tabs.getElement()).toBe(el);
    });

    it('should initialize with selector', () => {
      el.id = 'test-tabs';
      const tabs = new Tabs('#test-tabs');
      expect(tabs.getElement()).toBe(el);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Tabs('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should render tabs and content panes reflecting options', () => {
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'Tab A', content: 'Content A' },
          { key: 'b', title: 'Tab B', content: 'Content B', disabled: true },
        ],
        activeKey: 'a',
      });

      const tabEls = el.querySelectorAll('.ag-tabs-tab');
      expect(tabEls.length).toBe(2);
      expect(tabEls[0].querySelector('.ag-tabs-tab-title')?.textContent).toBe('Tab A');
      expect(tabEls[0].classList.contains('ag-tabs-tab--active')).toBe(true);
      expect(tabEls[1].classList.contains('ag-tabs-tab--disabled')).toBe(true);
      expect(tabEls[1].classList.contains('ag-tabs-tab--active')).toBe(false);

      const contentA = el.querySelector('.ag-tabs-content-item[data-key="a"]') as HTMLElement;
      const contentB = el.querySelector('.ag-tabs-content-item[data-key="b"]') as HTMLElement;
      expect(contentA.textContent).toBe('Content A');
      expect(contentA.style.display).toBe('block');
      expect(contentB.style.display).toBe('none');
      expect(tabs.getActiveKey()).toBe('a');
    });

    it('should auto-activate the first tab when no activeKey is given', () => {
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB' },
        ],
      });
      expect(tabs.getActiveKey()).toBe('a');
      const contentA = el.querySelector('.ag-tabs-content-item[data-key="a"]') as HTMLElement;
      expect(contentA.style.display).toBe('block');
    });
  });

  describe('addTab', () => {
    it('should append a new tab and content pane', () => {
      const tabs = new Tabs(el);
      tabs.addTab({ key: 'x', title: 'X', content: 'Content X' });

      expect(el.querySelectorAll('.ag-tabs-tab').length).toBe(1);
      expect(el.querySelectorAll('.ag-tabs-content-item').length).toBe(1);
      expect(tabs.getActiveKey()).toBe('x');
    });

    it('should not auto-activate a subsequently added tab', () => {
      const tabs = new Tabs(el);
      tabs.addTab({ key: 'a', title: 'A', content: 'CA' });
      tabs.addTab({ key: 'b', title: 'B', content: 'CB' });

      expect(tabs.getActiveKey()).toBe('a');
      const tabBEl = el.querySelector('[data-key="b"]') as HTMLElement;
      expect(tabBEl.classList.contains('ag-tabs-tab--active')).toBe(false);
    });
  });

  describe('setActiveKey', () => {
    it('should switch visible content and active tab class', () => {
      const onChange = vi.fn();
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB' },
        ],
        onChange,
      });

      tabs.setActiveKey('b');

      expect(tabs.getActiveKey()).toBe('b');
      expect(onChange).toHaveBeenCalledWith('b');

      const tabA = el.querySelector('[data-key="a"].ag-tabs-tab') as HTMLElement;
      const tabB = el.querySelector('[data-key="b"].ag-tabs-tab') as HTMLElement;
      expect(tabA.classList.contains('ag-tabs-tab--active')).toBe(false);
      expect(tabB.classList.contains('ag-tabs-tab--active')).toBe(true);

      const contentA = el.querySelector('.ag-tabs-content-item[data-key="a"]') as HTMLElement;
      const contentB = el.querySelector('.ag-tabs-content-item[data-key="b"]') as HTMLElement;
      expect(contentA.style.display).toBe('none');
      expect(contentB.style.display).toBe('block');
    });

    it('should switch tabs when clicking a tab element', () => {
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB' },
        ],
      });

      const tabB = el.querySelector('[data-key="b"].ag-tabs-tab') as HTMLElement;
      tabB.click();

      expect(tabs.getActiveKey()).toBe('b');
      expect(tabB.classList.contains('ag-tabs-tab--active')).toBe(true);
    });
  });

  describe('disabled tabs', () => {
    it('should not be activated via click', () => {
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB', disabled: true },
        ],
      });

      const tabB = el.querySelector('[data-key="b"].ag-tabs-tab') as HTMLElement;
      tabB.click();

      expect(tabs.getActiveKey()).toBe('a');
      expect(tabB.classList.contains('ag-tabs-tab--active')).toBe(false);
    });

    it('should not be activated via setActiveKey either', () => {
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB', disabled: true },
        ],
      });

      tabs.setActiveKey('b');
      expect(tabs.getActiveKey()).toBe('a');
    });

    it('should toggle disabled state via setTabDisabled', () => {
      const tabs = new Tabs(el, {
        tabs: [{ key: 'a', title: 'A', content: 'CA' }],
      });
      const tabA = el.querySelector('[data-key="a"].ag-tabs-tab') as HTMLElement;
      expect(tabA.classList.contains('ag-tabs-tab--disabled')).toBe(false);

      tabs.setTabDisabled('a', true);
      expect(tabA.classList.contains('ag-tabs-tab--disabled')).toBe(true);

      tabs.setTabDisabled('a', false);
      expect(tabA.classList.contains('ag-tabs-tab--disabled')).toBe(false);
    });
  });

  describe('removeTab', () => {
    it('should remove the tab and its content pane', () => {
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB' },
        ],
      });

      tabs.removeTab('b');

      expect(el.querySelectorAll('.ag-tabs-tab').length).toBe(1);
      expect(el.querySelector('.ag-tabs-content-item[data-key="b"]')).toBeNull();
    });

    it('should activate the next available tab when removing the active tab', () => {
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB' },
          { key: 'c', title: 'C', content: 'CC' },
        ],
      });

      tabs.setActiveKey('c');
      expect(tabs.getActiveKey()).toBe('c');

      tabs.removeTab('c');

      // 'c' was active and removed; the next remaining tab becomes active.
      expect(tabs.getActiveKey()).toBe('a');
      const tabA = el.querySelector('[data-key="a"].ag-tabs-tab') as HTMLElement;
      expect(tabA.classList.contains('ag-tabs-tab--active')).toBe(true);
      const contentA = el.querySelector('.ag-tabs-content-item[data-key="a"]') as HTMLElement;
      expect(contentA.style.display).toBe('block');
    });

    it('should clear activeKey when removing the last remaining tab', () => {
      const tabs = new Tabs(el, {
        tabs: [{ key: 'a', title: 'A', content: 'CA' }],
      });

      tabs.removeTab('a');
      expect(tabs.getActiveKey()).toBe('');
    });

    it('should not change the active key when removing a non-active tab', () => {
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB' },
        ],
      });

      tabs.removeTab('b');
      expect(tabs.getActiveKey()).toBe('a');
    });
  });

  describe('editable-card', () => {
    it('should render a close button on each tab', () => {
      const tabs = new Tabs(el, {
        type: 'editable-card',
        tabs: [{ key: 'a', title: 'A' }],
      });
      expect(el.querySelector('.ag-tabs-tab-close')).not.toBeNull();
    });

    it('should fire onEdit with "remove" when the close button is clicked', () => {
      const onEdit = vi.fn();
      const tabs = new Tabs(el, {
        type: 'editable-card',
        tabs: [{ key: 'a', title: 'A' }],
        onEdit,
      });

      const closeBtn = el.querySelector('.ag-tabs-tab-close') as HTMLElement;
      closeBtn.click();

      expect(onEdit).toHaveBeenCalledWith('a', 'remove');
      // Removing is left to the consumer via onEdit; the tab itself is
      // still present since removeTab was not called by the component.
      expect(el.querySelector('.ag-tabs-tab')).not.toBeNull();
    });

    it('should not render a close button for non-editable tab types', () => {
      const tabs = new Tabs(el, {
        type: 'card',
        tabs: [{ key: 'a', title: 'A' }],
      });
      expect(el.querySelector('.ag-tabs-tab-close')).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should remove all tab and content elements', () => {
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB' },
        ],
      });

      tabs.destroy();

      expect(el.querySelectorAll('.ag-tabs-tab').length).toBe(0);
      expect(el.querySelectorAll('.ag-tabs-content-item').length).toBe(0);
    });

    it('should remove listeners so clicks no longer trigger onChange', () => {
      const onChange = vi.fn();
      const tabs = new Tabs(el, {
        tabs: [
          { key: 'a', title: 'A', content: 'CA' },
          { key: 'b', title: 'B', content: 'CB' },
        ],
        onChange,
      });

      const tabList = el.querySelector('.ag-tabs-tab-list') as HTMLElement;
      tabs.destroy();
      onChange.mockClear();

      tabList.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('createTabs', () => {
    it('should create a tabs instance with a fresh container element', () => {
      const tabs = createTabs({
        tabs: [{ key: 'a', title: 'A', content: 'CA' }],
      });

      expect(tabs.getElement().className).toContain('ag-tabs');
      expect(tabs.getActiveKey()).toBe('a');
      expect(tabs.getElement().querySelector('.ag-tabs-tab-title')?.textContent).toBe('A');
    });
  });
});
