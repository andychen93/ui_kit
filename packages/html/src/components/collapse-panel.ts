/**
 * CollapsePanel component
 * This component is used internally by Collapse
 */

import * as dom from '../utils/dom';
import { collapsePanelClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface CollapsePanelOptions {
  title?: string;
  disabled?: boolean;
  extra?: string;
  className?: string;
}

export class CollapsePanel {
  private element: HTMLDivElement;
  private options: CollapsePanelOptions;
  private eventManager = new EventManager();
  private headerElement: HTMLDivElement | null = null;

  constructor(
    element: HTMLDivElement | string,
    options: CollapsePanelOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createHeader();
  }

  private createHeader(): void {
    const header = dom.createElement('div', {
      className: 'ag-collapse-header',
    });

    if (this.options.title) {
      const title = dom.createElement('div', {
        className: 'ag-collapse-header-title',
        textContent: this.options.title,
      });
      header.appendChild(title);
    }

    if (this.options.extra) {
      const extra = dom.createElement('div', {
        className: 'ag-collapse-header-extra',
        textContent: this.options.extra,
      });
      header.appendChild(extra);
    }

    this.element.appendChild(header);
    this.headerElement = header;
  }

  private updateClasses(): void {
    const classes = collapsePanelClasses({
      title: this.options.title || '',
      disabled: this.options.disabled,
      extra: !!this.options.extra,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Set title
   */
  setTitle(title: string): void {
    this.options.title = title;
    if (this.headerElement) {
      const titleEl = this.headerElement.querySelector('.ag-collapse-header-title');
      if (titleEl) {
        titleEl.textContent = title;
      } else if (title) {
        const newTitle = dom.createElement('div', {
          className: 'ag-collapse-header-title',
          textContent: title,
        });
        this.headerElement.appendChild(newTitle);
      }
    }
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.options.disabled = disabled;
    this.updateClasses();
  }

  /**
   * Set extra content
   */
  setExtra(extra: string): void {
    this.options.extra = extra;
    if (this.headerElement) {
      const extraEl = this.headerElement.querySelector('.ag-collapse-header-extra');

      if (extra) {
        if (!extraEl) {
          const newExtra = dom.createElement('div', {
            className: 'ag-collapse-header-extra',
            textContent: extra,
          });
          this.headerElement.appendChild(newExtra);
        } else {
          extraEl.textContent = extra;
        }
      } else if (extraEl) {
        extraEl.remove();
      }
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
    this.eventManager.removeAll();
    if (this.headerElement) {
      this.headerElement.remove();
    }
  }
}

/**
 * Create collapse panel from scratch
 */
export function createCollapsePanel(options: CollapsePanelOptions = {}): CollapsePanel {
  const container = dom.createElement('div', {
    className: 'ag-collapse-panel',
  });

  const instance = new CollapsePanel(container, options);
  return instance;
}
