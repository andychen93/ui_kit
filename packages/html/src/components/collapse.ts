/**
 * Collapse component
 */

import * as dom from '../utils/dom';
import { collapseClasses, collapsePanelClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface CollapseOptions {
  accordion?: boolean;
  bordered?: boolean;
  className?: string;
}

export class Collapse {
  private element: HTMLDivElement;
  private options: CollapseOptions;
  private panels: HTMLDivElement[] = [];
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: CollapseOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      bordered: true,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.processPanels();
    this.bindEvents();
  }

  private processPanels(): void {
    this.panels = Array.from(this.element.children).filter(
      (el): el is HTMLDivElement =>
        el instanceof HTMLElement && el.classList.contains('ag-collapse-panel')
    );
  }

  private bindEvents(): void {
    this.panels.forEach(panel => {
      const header = panel.querySelector('.ag-collapse-header');
      if (header instanceof HTMLElement) {
        this.eventManager.on(header, 'click', () => {
          this.togglePanel(panel);
        });
      }
    });
  }

  private togglePanel(panel: HTMLDivElement): void {
    const isActive = panel.classList.contains('ag-collapse-panel--active');

    if (this.options.accordion) {
      // Close all other panels first
      this.panels.forEach(p => {
        if (p !== panel) {
          p.classList.remove('ag-collapse-panel--active');
          const content = p.querySelector('.ag-collapse-content');
          if (content instanceof HTMLElement) {
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
          }
        }
      });
    }

    if (isActive) {
      // Close this panel
      panel.classList.remove('ag-collapse-panel--active');
      const content = panel.querySelector('.ag-collapse-content');
      if (content instanceof HTMLElement) {
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
      }
    } else {
      // Open this panel
      panel.classList.add('ag-collapse-panel--active');
      const content = panel.querySelector('.ag-collapse-content');
      if (content instanceof HTMLElement) {
        content.style.maxHeight = `${content.scrollHeight}px`;
        content.style.overflow = 'visible';
      }
    }
  }

  private updateClasses(): void {
    const classes = collapseClasses({
      accordion: this.options.accordion,
      bordered: this.options.bordered,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Add collapse panel
   */
  addPanel(title: string, content: string): HTMLDivElement {
    const panel = dom.createElement('div', {
      className: 'ag-collapse-panel',
    });

    const header = dom.createElement('div', {
      className: 'ag-collapse-header',
      textContent: title,
    });

    const contentDiv = dom.createElement('div', {
      className: 'ag-collapse-content',
    });
    contentDiv.textContent = content;
    if (contentDiv instanceof HTMLElement) {
      contentDiv.style.maxHeight = '0';
      contentDiv.style.overflow = 'hidden';
    }

    panel.appendChild(header);
    panel.appendChild(contentDiv);
    this.element.appendChild(panel);
    this.panels.push(panel);

    this.eventManager.on(header, 'click', () => {
      this.togglePanel(panel);
    });

    return panel;
  }

  /**
   * Remove panel
   */
  removePanel(index: number): void {
    if (index >= 0 && index < this.panels.length) {
      const panel = this.panels[index];
      panel.remove();
      this.panels.splice(index, 1);
    }
  }

  /**
   * Open panel
   */
  openPanel(index: number): void {
    if (index >= 0 && index < this.panels.length) {
      this.togglePanel(this.panels[index]);
    }
  }

  /**
   * Close panel
   */
  closePanel(index: number): void {
    if (index >= 0 && index < this.panels.length) {
      const panel = this.panels[index];
      if (panel.classList.contains('ag-collapse-panel--active')) {
        this.togglePanel(panel);
      }
    }
  }

  /**
   * Get panels
   */
  getPanels(): HTMLDivElement[] {
    return this.panels;
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
    this.eventManager.removeAll();
    this.panels.forEach(panel => {
      panel.remove();
    });
    this.panels = [];
  }
}

/**
 * Create collapse from scratch
 */
export function createCollapse(options: CollapseOptions = {}): Collapse {
  const container = dom.createElement('div', {
    className: 'ag-collapse',
  });

  const instance = new Collapse(container, options);
  return instance;
}
