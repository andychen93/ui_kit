/**
 * Avatar component
 */

import { ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { avatarClasses } from '../utils/css-classes';
import { EventManager } from '../utils/event';

export interface AvatarOptions {
  src?: string;
  shape?: 'circle' | 'square';
  size?: ComponentSize;
  icon?: string;
  alt?: string;
  onError?: () => void;
  className?: string;
}

export class Avatar {
  private element: HTMLDivElement;
  private options: AvatarOptions;
  private imgElement: HTMLImageElement | null = null;
  private iconElement: HTMLDivElement | null = null;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: AvatarOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      shape: 'circle',
      size: 'md',
      alt: 'Avatar',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.createContent();
  }

  private createContent(): void {
    if (this.options.icon) {
      this.createIconElement();
    } else if (this.options.src) {
      this.createImageElement();
    } else {
      this.createTextElement();
    }
  }

  private createImageElement(): void {
    const img = dom.createElement('img', {
      className: 'ag-avatar-image',
      src: this.options.src || '',
      attributes: {
        alt: this.options.alt || '',
      },
    });
    this.element.appendChild(img);
    this.imgElement = img;

    this.eventManager.on(img, 'error', () => {
      if (this.options.onError) {
        this.options.onError();
      }
      this.replaceWithText();
    });
  }

  private createIconElement(): void {
    const icon = dom.createElement('div', {
      className: 'ag-avatar-icon',
      textContent: this.options.icon,
    });
    this.element.appendChild(icon);
    this.iconElement = icon;
  }

  private createTextElement(): void {
    const text = dom.createElement('div', {
      className: 'ag-avatar-text',
      textContent: this.getText(),
    });
    this.element.appendChild(text);
  }

  private getText(): string {
    if (this.options.alt) {
      const words = this.options.alt.split(' ');
      if (words.length > 1) {
        return (words[0][0] + words[1][0]).toUpperCase();
      }
      return this.options.alt.slice(0, 2).toUpperCase();
    }
    return 'AU';
  }

  private replaceWithText(): void {
    if (this.imgElement) {
      this.imgElement.remove();
      this.imgElement = null;
    }
    this.createTextElement();
  }

  private updateClasses(): void {
    const classes = avatarClasses({
      size: this.options.size,
      shape: this.options.shape,
      src: this.options.src || undefined,
      icon: !!this.options.icon,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Set avatar image source
   */
  setSrc(src: string): void {
    this.options.src = src;
    if (this.imgElement) {
      this.imgElement.src = src;
    }
  }

  /**
   * Set shape
   */
  setShape(shape: 'circle' | 'square'): void {
    this.options.shape = shape;
    this.updateClasses();
  }

  /**
   * Set size
   */
  setSize(size: ComponentSize): void {
    this.options.size = size;
    this.updateClasses();
  }

  /**
   * Get size
   */
  getSize(): ComponentSize {
    return this.options.size || 'md';
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
    if (this.imgElement) {
      this.imgElement.remove();
    }
    if (this.iconElement) {
      this.iconElement.remove();
    }
  }
}

/**
 * Create avatar from scratch
 */
export function createAvatar(options: AvatarOptions = {}): Avatar {
  const container = dom.createElement('div', {
    className: 'ag-avatar',
  });

  const instance = new Avatar(container, options);
  return instance;
}
