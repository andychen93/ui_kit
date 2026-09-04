import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CollapsePanel, createCollapsePanel } from '../src/components/collapse-panel';

describe('CollapsePanel Component', () => {
  let container: HTMLDivElement;
  let panelEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    panelEl = document.createElement('div');
    container.appendChild(panelEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with an element reference', () => {
      const panel = new CollapsePanel(panelEl);
      expect(panel.getElement()).toBe(panelEl);
    });

    it('should initialize with a CSS selector string', () => {
      panelEl.id = 'test-panel';
      const panel = new CollapsePanel('#test-panel');
      expect(panel.getElement()).toBe(panelEl);
    });

    it('should throw when the selector does not match any element', () => {
      expect(() => new CollapsePanel('#does-not-exist')).toThrow(
        'Element not found for selector: #does-not-exist'
      );
    });
  });

  describe('initial render', () => {
    it('should render a header with title and extra when provided', () => {
      const panel = new CollapsePanel(panelEl, { title: 'Section', extra: 'Info' });

      const header = panelEl.querySelector('.ag-collapse-header');
      expect(header).not.toBeNull();
      expect(header?.querySelector('.ag-collapse-header-title')?.textContent).toBe('Section');
      expect(header?.querySelector('.ag-collapse-header-extra')?.textContent).toBe('Info');
    });

    it('should not render title/extra sub-elements when omitted', () => {
      const panel = new CollapsePanel(panelEl);
      const header = panelEl.querySelector('.ag-collapse-header');
      expect(header).not.toBeNull();
      expect(header?.querySelector('.ag-collapse-header-title')).toBeNull();
      expect(header?.querySelector('.ag-collapse-header-extra')).toBeNull();
    });

    it('should apply the disabled class when disabled option is true', () => {
      const panel = new CollapsePanel(panelEl, { disabled: true });
      expect(panelEl.className).toContain('ag-collapse-panel--disabled');
    });

    it('should not apply the disabled class by default', () => {
      const panel = new CollapsePanel(panelEl);
      expect(panelEl.className).not.toContain('ag-collapse-panel--disabled');
    });

    it('should apply the extra class when extra content is provided', () => {
      const panel = new CollapsePanel(panelEl, { extra: 'x' });
      expect(panelEl.className).toContain('ag-collapse-panel--extra');
    });

    it('should always include the base ag-collapse-panel class plus a custom className', () => {
      const panel = new CollapsePanel(panelEl, { className: 'my-custom' });
      expect(panelEl.className).toContain('ag-collapse-panel');
      expect(panelEl.className).toContain('my-custom');
    });
  });

  describe('setTitle', () => {
    it('should update an existing title element text content', () => {
      const panel = new CollapsePanel(panelEl, { title: 'Old' });
      panel.setTitle('New');
      expect(panelEl.querySelector('.ag-collapse-header-title')?.textContent).toBe('New');
    });

    it('should create a title element if one does not already exist', () => {
      const panel = new CollapsePanel(panelEl);
      expect(panelEl.querySelector('.ag-collapse-header-title')).toBeNull();
      panel.setTitle('Fresh Title');
      expect(panelEl.querySelector('.ag-collapse-header-title')?.textContent).toBe('Fresh Title');
    });
  });

  describe('setDisabled', () => {
    it('should add the disabled class when set to true', () => {
      const panel = new CollapsePanel(panelEl);
      panel.setDisabled(true);
      expect(panelEl.className).toContain('ag-collapse-panel--disabled');
    });

    it('should remove the disabled class when set back to false', () => {
      const panel = new CollapsePanel(panelEl, { disabled: true });
      panel.setDisabled(false);
      expect(panelEl.className).not.toContain('ag-collapse-panel--disabled');
    });
  });

  describe('setExtra', () => {
    it('should create an extra element if one does not exist', () => {
      const panel = new CollapsePanel(panelEl, { title: 'T' });
      expect(panelEl.querySelector('.ag-collapse-header-extra')).toBeNull();
      panel.setExtra('New Extra');
      expect(panelEl.querySelector('.ag-collapse-header-extra')?.textContent).toBe('New Extra');
    });

    it('should update an existing extra element text content', () => {
      const panel = new CollapsePanel(panelEl, { extra: 'Old Extra' });
      panel.setExtra('Updated Extra');
      expect(panelEl.querySelector('.ag-collapse-header-extra')?.textContent).toBe('Updated Extra');
    });

    it('should remove the extra element when set to an empty string', () => {
      const panel = new CollapsePanel(panelEl, { extra: 'Extra' });
      panel.setExtra('');
      expect(panelEl.querySelector('.ag-collapse-header-extra')).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should remove the header element from the DOM', () => {
      const panel = new CollapsePanel(panelEl, { title: 'T' });
      const header = panelEl.querySelector('.ag-collapse-header');
      expect(header).not.toBeNull();

      panel.destroy();

      expect(panelEl.querySelector('.ag-collapse-header')).toBeNull();
      expect(header && panelEl.contains(header)).toBe(false);
    });

    it('should not throw when called on a panel with no extra header content', () => {
      const panel = new CollapsePanel(panelEl);
      expect(() => panel.destroy()).not.toThrow();
    });
  });

  describe('createCollapsePanel', () => {
    it('should create a collapse-panel element from scratch reflecting given options', () => {
      const panel = createCollapsePanel({ title: 'Fresh Panel', disabled: true });
      const element = panel.getElement();
      expect(element.className).toContain('ag-collapse-panel');
      expect(element.className).toContain('ag-collapse-panel--disabled');
      expect(element.querySelector('.ag-collapse-header-title')?.textContent).toBe('Fresh Panel');
    });
  });
});
