/**
 * Empty component
 */

import { ComponentVariant } from '../types/index';
import * as dom from '../utils/dom';
import { emptyClasses } from '../utils/css-classes';

export interface EmptyOptions {
  image?: 'empty' | 'error' | 'network' | 'noData';
  description?: string;
  className?: string;
}

export class Empty {
  private element: HTMLDivElement;
  private options: EmptyOptions;
  private imageElement: HTMLDivElement | null = null;

  constructor(
    element: HTMLDivElement | string,
    options: EmptyOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      image: 'empty',
      description: 'No Data',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createImage();
    this.createDescription();
  }

  private createImage(): void {
    const image = dom.createElement('div', {
      className: 'ag-empty-image',
    });

    const svg = this.getEmptySVG(this.options.image || "empty");
    image.innerHTML = svg;

    this.element.appendChild(image);
    this.imageElement = image;
  }

  private getEmptySVG(type: string): string {
    const colors = ['#f5f5f5', '#e0e0e0'];
    
    switch (type) {
      case 'error':
        return `<svg viewBox="0 0 24 24" width="64" height="64"><path fill="${colors[0]}" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
      case 'network':
        return `<svg viewBox="0 0 24 24" width="64" height="64"><path fill="${colors[0]}" d="M12 4C7.31 4 3.07 5.9 0 8.98V16c6.63 0 12 5.37 12 12h2c0-7.73 5.01-14 12-14v-3.02c-3.5-2.89-8.04-4.98-14-4.98zM4.59 11.59C6.53 10.23 8.92 9.5 12 9.5c5.52 0 10 4.48 10 10s-4.48 10-10 10c-3.08 0-5.47-.73-7.41-2.02l-1.41 1.41C4.53 22.26 4.5 22.13 4.5 22c0-5.52 4.48-10 10-10 3.31 0 6.25 1.97 7.81 4.94l-1.41-1.41C15.25 15.97 12.31 14 9 14c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.97 0 5.5-1.67 6.94-4h-2.35c-1.1 0-2-.89-2-2s.9-2 2-2h6c2.21 0 4-1.79 4-4s-1.79-4-4-4h-6c0-3.31-2.69-6-6-6s-6 2.69-6 6 2.69 6 6 6c2.13 0 3.96-1.24 4.88-3.06l-1.41-1.41C13.1 10.77 10.87 9.5 8 9.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5c2.03 0 3.74-1.34 4.32-3.22l-1.41-1.41C10.18 16.34 8.94 16 8 16c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-1.06-.34-2.02-.9-2.88l-1.41 1.41z"/></svg>`;
      case 'noData':
        return `<svg viewBox="0 0 24 24" width="64" height="64"><path fill="${colors[0]}" d="M19 13H5v-2h14v2zm-5-9h-2v12h-2V4H8v2h2v12h2V4h2v2h2V4z"/></svg>`;
      case 'empty':
      default:
        return `<svg viewBox="0 0 24 24" width="64" height="64"><path fill="${colors[0]}" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>`;
    }
  }

  private createDescription(): void {
    const description = dom.createElement('div', {
      className: 'ag-empty-description',
      textContent: this.options.description,
    });
    this.element.appendChild(description);
  }

  private updateClasses(): void {
    const classes = emptyClasses({
      image: this.options.image,
      description: this.options.description,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Set image type
   */
  setImage(image: 'empty' | 'error' | 'network' | 'noData'): void {
    this.options.image = image;
    
    if (this.imageElement) {
      const svg = this.getEmptySVG(image);
      this.imageElement.innerHTML = svg;
    }
  }

  /**
   * Set description
   */
  setDescription(description: string): void {
    this.options.description = description;
    const descEl = this.element.querySelector('.ag-empty-description');
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
    if (this.imageElement) {
      this.imageElement.remove();
    }
  }
}

/**
 * Create empty from scratch
 */
export function createEmpty(options: EmptyOptions = {}): Empty {
  const container = dom.createElement('div', {
    className: 'ag-empty',
  });

  const instance = new Empty(container, options);
  return instance;
}
