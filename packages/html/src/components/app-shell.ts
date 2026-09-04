/**
 * AppShell component
 */

import * as dom from '../utils/dom';

export interface AppShellOptions {
  header?: string;
  sidebar?: string;
  footer?: string;
  className?: string;
}

export class AppShell {
  private element: HTMLDivElement;
  private options: AppShellOptions;
  private headerElement: HTMLDivElement | null = null;
  private sidebarElement: HTMLDivElement | null = null;
  private contentElement: HTMLDivElement | null = null;
  private footerElement: HTMLDivElement | null = null;

  constructor(
    element: HTMLDivElement | string,
    options: AppShellOptions = {}
  ) {
    this.element = dom.getElement(element);
    this.options = {
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createLayout();
  }

  private createLayout(): void {
    // Header
    if (this.options.header) {
      const header = dom.createElement('div', {
        className: 'ag-app-header',
        textContent: this.options.header,
      });
      this.element.appendChild(header);
      this.headerElement = header;
    }

    // Main content area
    const main = dom.createElement('div', {
      className: 'ag-app-main',
    });

    // Sidebar
    if (this.options.sidebar) {
      const sidebar = dom.createElement('div', {
        className: 'ag-app-sidebar',
        textContent: this.options.sidebar,
      });
      main.appendChild(sidebar);
      this.sidebarElement = sidebar;
    }

    // Content
    const content = dom.createElement('div', {
      className: 'ag-app-content',
    });
    main.appendChild(content);
    this.contentElement = content;

    this.element.appendChild(main);

    // Footer
    if (this.options.footer) {
      const footer = dom.createElement('div', {
        className: 'ag-app-footer',
        textContent: this.options.footer,
      });
      this.element.appendChild(footer);
      this.footerElement = footer;
    }
  }

  /**
   * Set header
   */
  setHeader(header: string): void {
    this.options.header = header;
    if (this.headerElement) {
      this.headerElement.textContent = header;
    }
  }

  /**
   * Set sidebar
   */
  setSidebar(sidebar: string): void {
    this.options.sidebar = sidebar;
    if (this.sidebarElement) {
      this.sidebarElement.textContent = sidebar;
    }
  }

  /**
   * Set content
   */
  setContent(content: string): void {
    if (this.contentElement) {
      this.contentElement.textContent = content;
    }
  }

  /**
   * Set footer
   */
  setFooter(footer: string): void {
    this.options.footer = footer;
    if (this.footerElement) {
      this.footerElement.textContent = footer;
    }
  }

  /**
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy component
   */
  destroy(): void {
    if (this.headerElement) {
      this.headerElement.remove();
    }
    if (this.sidebarElement) {
      this.sidebarElement.remove();
    }
    if (this.contentElement) {
      this.contentElement.remove();
    }
    if (this.footerElement) {
      this.footerElement.remove();
    }
  }
}

/**
 * Create app shell from scratch
 */
export function createAppShell(options: AppShellOptions = {}): AppShell {
  const container = dom.createElement('div', {
    className: 'ag-app-shell',
  });

  const instance = new AppShell(container, options);
  return instance;
}
