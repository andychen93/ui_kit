/**
 * Card component
 */

import { EventHandler } from '../types/index';
import * as dom from '../utils/dom';
import { cardClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface CardOptions {
  title?: string;
  bordered?: boolean;
  loading?: boolean;
  extra?: string;
  className?: string;
}

export class Card {
  private element: HTMLDivElement;
  private options: CardOptions;
  private contentElement: HTMLDivElement | null = null;
  private loadingElement: HTMLDivElement | null = null;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: CardOptions = {}
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
    this.createHeader();
    this.createContent();
    if (this.options.loading) {
      this.createLoading();
    }
  }

  private createHeader(): void {
    const header = dom.createElement('div', {
      className: 'ag-card-header',
    });

    if (this.options.title) {
      const title = dom.createElement('div', {
        className: 'ag-card-title',
        textContent: this.options.title,
      });
      header.appendChild(title);
    }

    if (this.options.extra) {
      const extra = dom.createElement('div', {
        className: 'ag-card-extra',
        textContent: this.options.extra,
      });
      header.appendChild(extra);
    }

    this.element.appendChild(header);
  }

  private createContent(): void {
    const content = dom.createElement('div', {
      className: 'ag-card-body',
    });
    this.element.appendChild(content);
    this.contentElement = content;
  }

  private createLoading(): void {
    const loading = dom.createElement('div', {
      className: 'ag-card-loading',
    });

    const spinner = dom.createElement('div', {
      className: 'ag-spin',
    });

    const dot = dom.createElement('div', {
      className: 'ag-spin-dot',
    });
    spinner.appendChild(dot);

    loading.appendChild(spinner);
    this.element.appendChild(loading);
    this.loadingElement = loading;
  }

  private updateClasses(): void {
    const classes = cardClasses({
      title: !!this.options.title,
      bordered: this.options.bordered,
      loading: this.options.loading,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Set title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const titleEl = this.element.querySelector('.ag-card-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * Set extra content
   */
  setExtra(extra: string): void {
    this.options.extra = extra;
    const extraEl = this.element.querySelector('.ag-card-extra');
    
    if (extra) {
      if (!extraEl) {
        const header = this.element.querySelector('.ag-card-header');
        if (header) {
          const extraDiv = dom.createElement('div', {
            className: 'ag-card-extra',
            textContent: extra,
          });
          header.appendChild(extraDiv);
        }
      } else {
        extraEl.textContent = extra;
      }
    } else if (extraEl) {
      extraEl.remove();
    }
  }

  /**
   * Set bordered state
   */
  setBordered(bordered: boolean): void {
    this.options.bordered = bordered;
    this.updateClasses();
  }

  /**
   * Show loading
   */
  showLoading(): void {
    this.options.loading = true;
    this.updateClasses();
    
    if (!this.loadingElement) {
      this.createLoading();
    } else {
      this.loadingElement.style.display = 'block';
    }
    
    if (this.contentElement) {
      this.contentElement.style.opacity = '0.5';
    }
  }

  /**
   * Hide loading
   */
  hideLoading(): void {
    this.options.loading = false;
    this.updateClasses();
    
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
    
    if (this.contentElement) {
      this.contentElement.style.opacity = '1';
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
    
    const header = this.element.querySelector('.ag-card-header');
    if (header) {
      header.remove();
    }
    
    if (this.contentElement) {
      this.contentElement.remove();
    }
    
    if (this.loadingElement) {
      this.loadingElement.remove();
    }
  }
}

/**
 * Create card from scratch
 */
export function createCard(options: CardOptions = {}): Card {
  const container = dom.createElement('div', {
    className: 'ag-card',
  });

  const instance = new Card(container, options);
  return instance;
}
