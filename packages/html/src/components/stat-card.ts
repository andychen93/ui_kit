/**
 * StatCard component
 */

import * as dom from '../utils/dom';

export interface StatCardOptions {
  title?: string;
  value?: string | number;
  description?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  className?: string;
}

export class StatCard {
  private element: HTMLDivElement;
  private options: StatCardOptions;
  private trendElement: HTMLDivElement | null;

  constructor(
    element: HTMLDivElement | string,
    options: StatCardOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createContent();
  }

  private createContent(): void {
    // Header with icon and title
    const header = dom.createElement('div', {
      className: 'ag-stat-card-header',
    });

    if (this.options.icon) {
      const icon = dom.createElement('div', {
        className: 'ag-stat-card-icon',
        textContent: this.options.icon,
      });
      header.appendChild(icon);
    }

    if (this.options.title) {
      const title = dom.createElement('div', {
        className: 'ag-stat-card-title',
        textContent: this.options.title,
      });
      header.appendChild(title);
    }

    this.element.appendChild(header);

    // Body with value and description
    const body = dom.createElement('div', {
      className: 'ag-stat-card-body',
    });

    if (this.options.value !== undefined) {
      const value = dom.createElement('div', {
        className: 'ag-stat-card-value',
        textContent: String(this.options.value),
      });
      body.appendChild(value);
    }

    if (this.options.description) {
      const description = dom.createElement('div', {
        className: 'ag-stat-card-description',
        textContent: this.options.description,
      });
      body.appendChild(description);
    }

    this.element.appendChild(body);

    // Footer with trend
    if (this.options.trend || this.options.trendText) {
      const footer = dom.createElement('div', {
        className: 'ag-stat-card-footer',
      });

      if (this.options.trend) {
        const trend = dom.createElement('div', {
          className: `ag-stat-card-trend ag-stat-card-trend--${this.options.trend}`,
          textContent: this.options.trend === 'up' ? '↑' : this.options.trend === 'down' ? '↓' : '→',
        });
        footer.appendChild(trend);
        this.trendElement = trend;
      }

      if (this.options.trendText) {
        const trendText = dom.createElement('div', {
          className: 'ag-stat-card-trend-text',
          textContent: this.options.trendText,
        });
        footer.appendChild(trendText);
      }

      this.element.appendChild(footer);
    }
  }

  /**
   * Set value
   */
  setValue(value: string | number): void {
    this.options.value = value;
    const valueEl = this.element.querySelector('.ag-stat-card-value');
    if (valueEl) {
      valueEl.textContent = String(value);
    }
  }

  /**
   * Set trend
   */
  setTrend(trend: 'up' | 'down' | 'neutral'): void {
    this.options.trend = trend;
    if (this.trendElement) {
      this.trendElement.className = `ag-stat-card-trend ag-stat-card-trend--${trend}`;
      this.trendElement.textContent = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    }
  }

  /**
   * Set title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const titleEl = this.element.querySelector('.ag-stat-card-title');
    if (titleEl) {
      titleEl.textContent = title;
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
    if (this.trendElement) {
      this.trendElement.remove();
    }
  }
}

/**
 * Create stat card from scratch
 */
export function createStatCard(options: StatCardOptions = {}): StatCard {
  const container = dom.createElement('div', {
    className: 'ag-stat-card',
  });

  const instance = new StatCard(container, options);
  return instance;
}
