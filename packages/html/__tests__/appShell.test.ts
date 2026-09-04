import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AppShell, createAppShell } from '../src/components/app-shell';

describe('AppShell Component', () => {
  let container: HTMLDivElement;
  let shellEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    shellEl = document.createElement('div');
    container.appendChild(shellEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const shell = new AppShell(shellEl);
      expect(shell.getElement()).toBe(shellEl);
    });

    it('should initialize with selector', () => {
      shellEl.id = 'test-shell';
      const shell = new AppShell('#test-shell');
      expect(shell.getElement()).toBe(shellEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new AppShell('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should render header, sidebar, content and footer when provided', () => {
      new AppShell(shellEl, { header: 'My Header', sidebar: 'My Sidebar', footer: 'My Footer' });

      const header = shellEl.querySelector('.ag-app-header');
      const sidebar = shellEl.querySelector('.ag-app-sidebar');
      const content = shellEl.querySelector('.ag-app-content');
      const footer = shellEl.querySelector('.ag-app-footer');

      expect(header?.textContent).toBe('My Header');
      expect(sidebar?.textContent).toBe('My Sidebar');
      expect(content).not.toBeNull();
      expect(footer?.textContent).toBe('My Footer');

      // sidebar must live inside the main area, alongside content
      const main = shellEl.querySelector('.ag-app-main');
      expect(main?.contains(sidebar!)).toBe(true);
      expect(main?.contains(content!)).toBe(true);
    });

    it('should not render header/sidebar/footer when omitted, but always render content', () => {
      new AppShell(shellEl);

      expect(shellEl.querySelector('.ag-app-header')).toBeNull();
      expect(shellEl.querySelector('.ag-app-sidebar')).toBeNull();
      expect(shellEl.querySelector('.ag-app-footer')).toBeNull();
      expect(shellEl.querySelector('.ag-app-content')).not.toBeNull();
    });
  });

  describe('setHeader', () => {
    it('should update header text when header was initially provided', () => {
      const shell = new AppShell(shellEl, { header: 'Initial' });
      shell.setHeader('Updated');
      expect(shellEl.querySelector('.ag-app-header')?.textContent).toBe('Updated');
    });

    it('should not create a header element if none existed initially', () => {
      const shell = new AppShell(shellEl);
      shell.setHeader('Too Late');
      expect(shellEl.querySelector('.ag-app-header')).toBeNull();
    });
  });

  describe('setSidebar', () => {
    it('should update sidebar text when sidebar was initially provided', () => {
      const shell = new AppShell(shellEl, { sidebar: 'Initial' });
      shell.setSidebar('Updated Sidebar');
      expect(shellEl.querySelector('.ag-app-sidebar')?.textContent).toBe('Updated Sidebar');
    });

    it('should not create a sidebar element if none existed initially', () => {
      const shell = new AppShell(shellEl);
      shell.setSidebar('Too Late');
      expect(shellEl.querySelector('.ag-app-sidebar')).toBeNull();
    });
  });

  describe('setFooter', () => {
    it('should update footer text when footer was initially provided', () => {
      const shell = new AppShell(shellEl, { footer: 'Initial' });
      shell.setFooter('Updated Footer');
      expect(shellEl.querySelector('.ag-app-footer')?.textContent).toBe('Updated Footer');
    });

    it('should not create a footer element if none existed initially', () => {
      const shell = new AppShell(shellEl);
      shell.setFooter('Too Late');
      expect(shellEl.querySelector('.ag-app-footer')).toBeNull();
    });
  });

  describe('setContent', () => {
    it('should always be able to set content text, since content is always rendered', () => {
      const shell = new AppShell(shellEl);
      shell.setContent('Hello World');
      expect(shellEl.querySelector('.ag-app-content')?.textContent).toBe('Hello World');
    });
  });

  describe('createAppShell', () => {
    it('should create an app shell from scratch with rendered options', () => {
      const shell = createAppShell({ header: 'H', sidebar: 'S', footer: 'F' });
      const el = shell.getElement();
      expect(el.className).toContain('ag-app-shell');
      expect(el.querySelector('.ag-app-header')?.textContent).toBe('H');
      expect(el.querySelector('.ag-app-sidebar')?.textContent).toBe('S');
      expect(el.querySelector('.ag-app-footer')?.textContent).toBe('F');
    });
  });

  describe('destroy', () => {
    it('should remove header, sidebar, content and footer elements from the DOM', () => {
      const shell = new AppShell(shellEl, { header: 'H', sidebar: 'S', footer: 'F' });
      expect(shellEl.querySelector('.ag-app-header')).not.toBeNull();
      expect(shellEl.querySelector('.ag-app-content')).not.toBeNull();

      shell.destroy();

      expect(shellEl.querySelector('.ag-app-header')).toBeNull();
      expect(shellEl.querySelector('.ag-app-sidebar')).toBeNull();
      expect(shellEl.querySelector('.ag-app-content')).toBeNull();
      expect(shellEl.querySelector('.ag-app-footer')).toBeNull();
    });

    it('should not throw when destroying an instance with no optional sections', () => {
      const shell = new AppShell(shellEl);
      expect(() => shell.destroy()).not.toThrow();
      expect(shellEl.querySelector('.ag-app-content')).toBeNull();
    });
  });
});
