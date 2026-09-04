import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Collapse, createCollapse } from '../src/components/collapse';

/**
 * Builds a collapse panel DOM structure matching what Collapse.addPanel()
 * produces, so we can test panels that are already present in the markup
 * when the Collapse is constructed (mirrors real usage where panels are
 * authored in HTML and Collapse progressively enhances them).
 */
function buildPanel(title: string, content: string): HTMLDivElement {
  const panel = document.createElement('div');
  panel.className = 'ag-collapse-panel';

  const header = document.createElement('div');
  header.className = 'ag-collapse-header';
  header.textContent = title;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'ag-collapse-content';
  contentDiv.textContent = content;
  contentDiv.style.maxHeight = '0';
  contentDiv.style.overflow = 'hidden';

  panel.appendChild(header);
  panel.appendChild(contentDiv);
  return panel;
}

describe('Collapse Component', () => {
  let container: HTMLDivElement;
  let collapseEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    collapseEl = document.createElement('div');
    container.appendChild(collapseEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with an element reference', () => {
      const collapse = new Collapse(collapseEl);
      expect(collapse.getElement()).toBe(collapseEl);
    });

    it('should initialize with a CSS selector string', () => {
      collapseEl.id = 'test-collapse';
      const collapse = new Collapse('#test-collapse');
      expect(collapse.getElement()).toBe(collapseEl);
    });

    it('should throw when the selector does not match any element', () => {
      expect(() => new Collapse('#does-not-exist')).toThrow(
        'Element not found for selector: #does-not-exist'
      );
    });
  });

  describe('initial render', () => {
    it('should apply bordered class by default', () => {
      const collapse = new Collapse(collapseEl);
      expect(collapseEl.className).toContain('ag-collapse--bordered');
      expect(collapseEl.className).not.toContain('ag-collapse--accordion');
    });

    it('should omit bordered class when bordered is false', () => {
      const collapse = new Collapse(collapseEl, { bordered: false });
      expect(collapseEl.className).not.toContain('ag-collapse--bordered');
    });

    it('should apply accordion class when accordion option is true', () => {
      const collapse = new Collapse(collapseEl, { accordion: true });
      expect(collapseEl.className).toContain('ag-collapse--accordion');
    });

    it('should pick up pre-existing panel markup and expose it via getPanels', () => {
      collapseEl.appendChild(buildPanel('Panel 1', 'Content 1'));
      collapseEl.appendChild(buildPanel('Panel 2', 'Content 2'));

      const collapse = new Collapse(collapseEl);
      const panels = collapse.getPanels();
      expect(panels.length).toBe(2);
      expect(panels[0].querySelector('.ag-collapse-header')?.textContent).toBe('Panel 1');
      expect(panels[1].querySelector('.ag-collapse-header')?.textContent).toBe('Panel 2');
    });
  });

  describe('addPanel', () => {
    it('should append a new panel with header and content reflecting arguments', () => {
      const collapse = new Collapse(collapseEl);
      const panel = collapse.addPanel('Title', 'Body');

      expect(collapseEl.contains(panel)).toBe(true);
      expect(panel.querySelector('.ag-collapse-header')?.textContent).toBe('Title');
      expect(panel.querySelector('.ag-collapse-content')?.textContent).toBe('Body');
      expect(collapse.getPanels().length).toBe(1);
    });

    it('should start the new panel collapsed (maxHeight 0)', () => {
      const collapse = new Collapse(collapseEl);
      const panel = collapse.addPanel('Title', 'Body');
      const content = panel.querySelector('.ag-collapse-content') as HTMLElement;
      expect(content.style.maxHeight).toBe('0');
      expect(content.style.overflow).toBe('hidden');
      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(false);
    });
  });

  describe('removePanel', () => {
    it('should remove the panel from the DOM and from getPanels', () => {
      const collapse = new Collapse(collapseEl);
      const panel0 = collapse.addPanel('A', 'a');
      const panel1 = collapse.addPanel('B', 'b');

      collapse.removePanel(0);

      expect(collapseEl.contains(panel0)).toBe(false);
      expect(collapse.getPanels()).toEqual([panel1]);
    });

    it('should do nothing for an out-of-range index', () => {
      const collapse = new Collapse(collapseEl);
      collapse.addPanel('A', 'a');
      collapse.removePanel(10);
      expect(collapse.getPanels().length).toBe(1);
    });
  });

  describe('openPanel / closePanel', () => {
    it('openPanel should mark the panel active and expand its content', () => {
      const collapse = new Collapse(collapseEl);
      const panel = collapse.addPanel('A', 'a');

      collapse.openPanel(0);

      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(true);
      const content = panel.querySelector('.ag-collapse-content') as HTMLElement;
      expect(content.style.overflow).toBe('visible');
    });

    it('openPanel should toggle an already-open panel closed (it delegates to toggle)', () => {
      const collapse = new Collapse(collapseEl);
      const panel = collapse.addPanel('A', 'a');

      collapse.openPanel(0);
      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(true);

      collapse.openPanel(0);
      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(false);
    });

    it('closePanel should collapse an active panel', () => {
      const collapse = new Collapse(collapseEl);
      const panel = collapse.addPanel('A', 'a');
      collapse.openPanel(0);

      collapse.closePanel(0);

      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(false);
      const content = panel.querySelector('.ag-collapse-content') as HTMLElement;
      expect(content.style.maxHeight).toBe('0');
    });

    it('closePanel should be a no-op on an already-closed panel', () => {
      const collapse = new Collapse(collapseEl);
      const panel = collapse.addPanel('A', 'a');

      collapse.closePanel(0);

      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(false);
    });
  });

  describe('accordion vs multi-open behavior', () => {
    it('in multi mode (default), opening a second panel keeps the first one open', () => {
      const collapse = new Collapse(collapseEl);
      const panelA = collapse.addPanel('A', 'a');
      const panelB = collapse.addPanel('B', 'b');

      collapse.openPanel(0);
      collapse.openPanel(1);

      expect(panelA.classList.contains('ag-collapse-panel--active')).toBe(true);
      expect(panelB.classList.contains('ag-collapse-panel--active')).toBe(true);
    });

    it('in accordion mode, opening a second panel closes the first one', () => {
      const collapse = new Collapse(collapseEl, { accordion: true });
      const panelA = collapse.addPanel('A', 'a');
      const panelB = collapse.addPanel('B', 'b');

      collapse.openPanel(0);
      expect(panelA.classList.contains('ag-collapse-panel--active')).toBe(true);

      collapse.openPanel(1);

      expect(panelB.classList.contains('ag-collapse-panel--active')).toBe(true);
      expect(panelA.classList.contains('ag-collapse-panel--active')).toBe(false);
    });
  });

  describe('header click toggling', () => {
    it('should toggle a pre-existing panel active state when its header is clicked', () => {
      collapseEl.appendChild(buildPanel('Panel 1', 'Content 1'));
      const collapse = new Collapse(collapseEl);
      const panel = collapse.getPanels()[0];
      const header = panel.querySelector('.ag-collapse-header') as HTMLElement;

      header.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(true);

      header.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(false);
    });

    it('should toggle a dynamically added panel active state when its header is clicked', () => {
      const collapse = new Collapse(collapseEl);
      const panel = collapse.addPanel('A', 'a');
      const header = panel.querySelector('.ag-collapse-header') as HTMLElement;

      header.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(true);
    });
  });

  describe('destroy', () => {
    it('should remove all panels from the DOM and clear getPanels', () => {
      const collapse = new Collapse(collapseEl);
      const panel = collapse.addPanel('A', 'a');

      collapse.destroy();

      expect(collapseEl.contains(panel)).toBe(false);
      expect(collapse.getPanels()).toEqual([]);
    });

    it('should stop toggling panels on header click after destroy', () => {
      const collapse = new Collapse(collapseEl);
      const panel = collapse.addPanel('A', 'a');
      const header = panel.querySelector('.ag-collapse-header') as HTMLElement;

      collapse.destroy();

      // panel was removed from DOM, but dispatch directly on the detached
      // header to confirm the click listener was actually torn down
      header.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(panel.classList.contains('ag-collapse-panel--active')).toBe(false);
    });
  });

  describe('createCollapse', () => {
    it('should create a collapse element from scratch reflecting given options', () => {
      const collapse = createCollapse({ accordion: true });
      const element = collapse.getElement();
      expect(element.className).toContain('ag-collapse');
      expect(element.className).toContain('ag-collapse--accordion');
    });
  });
});
