/**
 * AvatarGroup component
 */

import { ComponentSize } from '../types/index';
import * as dom from '../utils/dom';
import { avatarGroupClasses } from '../utils/css-classes';

export interface AvatarGroupOptions {
  size?: ComponentSize;
  max?: number;
  overlap?: boolean;
  className?: string;
}

export class AvatarGroup {
  private element: HTMLDivElement;
  private options: AvatarGroupOptions;
  private avatars: HTMLDivElement[] = [];

  constructor(
    element: HTMLDivElement | string,
    options: AvatarGroupOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      overlap: true,
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.updateClasses();
    this.processAvatars();
  }

  private processAvatars(): void {
    const avatarElements = Array.from(this.element.children).filter(
      el => el.classList.contains('ag-avatar') || el.classList.contains('ag-avatar-group-avatar')
    );

    let visibleCount = 0;
    const max = this.options.max || 3;

    avatarElements.forEach((el, index) => {
      const avatar = el as HTMLDivElement;
      
      if (index < max) {
        avatar.classList.add('ag-avatar-group-avatar');
        this.avatars.push(avatar);
        visibleCount++;
      } else {
        // Move hidden avatars to a separate container
        avatar.style.display = 'none';
      }
    });

    // Add overflow avatar if needed
    if (avatarElements.length > max) {
      this.createOverflowAvatar(avatarElements.length - max);
    }
  }

  private createOverflowAvatar(count: number): void {
    const overflow = dom.createElement('div', {
      className: 'ag-avatar-group-overflow',
    });

    const text = dom.createElement('span', {
      className: 'ag-avatar-group-count',
      textContent: `+${count}`,
    });
    overflow.appendChild(text);

    this.element.appendChild(overflow);
  }

  private updateClasses(): void {
    const classes = avatarGroupClasses({
      size: this.options.size,
      max: this.options.max,
      overlap: this.options.overlap,
      className: this.options.className,
    });
    this.element.className = classes;
  }

  /**
   * Add avatar to group
   */
  addAvatar(element: HTMLDivElement | string): void {
    const avatar = dom.getElement<HTMLDivElement>(element);
    avatar.classList.add('ag-avatar-group-avatar');
    this.avatars.push(avatar);
    this.processAvatars();
  }

  /**
   * Remove avatar from group
   */
  removeAvatar(element: HTMLDivElement | string): void {
    const avatar = dom.getElement<HTMLDivElement>(element);
    const index = this.avatars.indexOf(avatar);
    
    if (index > -1) {
      this.avatars.splice(index, 1);
      avatar.classList.remove('ag-avatar-group-avatar');
      avatar.style.display = '';
      this.processAvatars();
    }
  }

  /**
   * Set max count
   */
  setMax(max: number): void {
    this.options.max = max;
    this.processAvatars();
  }

  /**
   * Set overlap
   */
  setOverlap(overlap: boolean): void {
    this.options.overlap = overlap;
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
    this.avatars.forEach(avatar => {
      avatar.classList.remove('ag-avatar-group-avatar');
      avatar.style.display = '';
    });
    
    const overflow = this.element.querySelector('.ag-avatar-group-overflow');
    if (overflow) {
      overflow.remove();
    }
  }
}

/**
 * Create avatar group from scratch
 */
export function createAvatarGroup(options: AvatarGroupOptions = {}): AvatarGroup {
  const container = dom.createElement('div', {
    className: 'ag-avatar-group',
  });

  const instance = new AvatarGroup(container, options);
  return instance;
}
