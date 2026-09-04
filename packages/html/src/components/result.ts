/**
 * Result component
 */

import * as dom from '../utils/dom';

export interface ResultOptions {
  title?: string;
  description?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'custom';
  /**
   * Custom icon markup, used when `icon: 'custom'`. Written via
   * `innerHTML` — NOT sanitized. Only pass trusted, developer-authored
   * markup; sanitize any user/external content first if it must be used.
   */
  customIcon?: string;
  extra?: string;
  className?: string;
}

export class Result {
  private element: HTMLDivElement;
  private options: ResultOptions;
  private iconElement: HTMLDivElement | null = null;

  constructor(
    element: HTMLDivElement | string,
    options: ResultOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      icon: 'success',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createIcon();
    this.createTitle();
    this.createDescription();
    this.createExtra();
  }

  private createIcon(): void {
    const icon = dom.createElement('div', {
      className: 'ag-result-icon',
    });

    if (this.options.icon === 'custom' && this.options.customIcon) {
      icon.innerHTML = this.options.customIcon;
    } else {
      icon.innerHTML = this.getIconHTML();
    }

    this.element.appendChild(icon);
    this.iconElement = icon;
  }

  private getIconHTML(): string {
    switch (this.options.icon) {
      case 'success':
        return '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
      case 'error':
        return '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
      case 'warning':
        return '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
      case 'info':
        return '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
      default:
        return '';
    }
  }

  private createTitle(): void {
    if (this.options.title) {
      const title = dom.createElement('div', {
        className: 'ag-result-title',
        textContent: this.options.title,
      });
      this.element.appendChild(title);
    }
  }

  private createDescription(): void {
    if (this.options.description) {
      const description = dom.createElement('div', {
        className: 'ag-result-description',
        textContent: this.options.description,
      });
      this.element.appendChild(description);
    }
  }

  private createExtra(): void {
    if (this.options.extra) {
      const extra = dom.createElement('div', {
        className: 'ag-result-extra',
        textContent: this.options.extra,
      });
      this.element.appendChild(extra);
    }
  }

  /**
   * Set icon. When switching to 'custom', the last HTML passed to
   * `setCustomIcon()` (or the constructor's `customIcon` option) is
   * reused. Prefer `setCustomIcon(html)` when you have new HTML to show.
   */
  setIcon(icon: 'success' | 'error' | 'warning' | 'info' | 'custom'): void {
    this.options.icon = icon;
    if (this.iconElement) {
      this.iconElement.innerHTML =
        icon === 'custom' && this.options.customIcon
          ? this.options.customIcon
          : this.getIconHTML();
    }
  }

  /**
   * Set custom icon. `html` is written via `innerHTML` and is NOT
   * sanitized — only pass trusted markup (see `customIcon` option above).
   */
  setCustomIcon(html: string): void {
    this.options.icon = 'custom';
    this.options.customIcon = html;
    if (this.iconElement) {
      this.iconElement.innerHTML = html;
    }
  }

  /**
   * Set title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const titleEl = this.element.querySelector('.ag-result-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * Set description
   */
  setDescription(description: string): void {
    this.options.description = description;
    const descEl = this.element.querySelector('.ag-result-description');
    if (descEl) {
      descEl.textContent = description;
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
    if (this.iconElement) {
      this.iconElement.remove();
    }
  }
}

/**
 * Create result from scratch
 */
export function createResult(options: ResultOptions = {}): Result {
  const container = dom.createElement('div', {
    className: 'ag-result',
  });

  const instance = new Result(container, options);
  return instance;
}
