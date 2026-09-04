import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Avatar, createAvatar } from '../src/components/avatar';

describe('Avatar Component', () => {
  let container: HTMLDivElement;
  let avatarEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    avatarEl = document.createElement('div');
    container.appendChild(avatarEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const avatar = new Avatar(avatarEl);
      expect(avatar.getElement()).toBe(avatarEl);
    });

    it('should initialize with element selector', () => {
      avatarEl.id = 'test-avatar';
      const avatar = new Avatar('#test-avatar');
      expect(avatar.getElement()).toBe(avatarEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Avatar('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should apply default size and circle shape classes', () => {
      new Avatar(avatarEl);
      expect(avatarEl.className).toContain('ag-avatar');
      expect(avatarEl.className).toContain('ag-avatar--md');
      expect(avatarEl.className).toContain('ag-avatar--circle');
    });

    it('should render text content derived from alt when no src/icon given', () => {
      new Avatar(avatarEl, { alt: 'Jane Doe' });
      const text = avatarEl.querySelector('.ag-avatar-text');
      expect(text?.textContent).toBe('JD');
    });

    it('should default to "AU" text when no alt/src/icon given at all', () => {
      const avatar = new Avatar(avatarEl, { alt: '' });
      // alt of '' is falsy so getText() falls back to 'AU'
      expect(avatarEl.querySelector('.ag-avatar-text')?.textContent).toBe('AU');
    });

    it('should render an image element when src is provided', () => {
      new Avatar(avatarEl, { src: 'https://example.com/avatar.png', alt: 'Pic' });
      const img = avatarEl.querySelector('.ag-avatar-image') as HTMLImageElement;
      expect(img).not.toBeNull();
      expect(img.getAttribute('src')).toBe('https://example.com/avatar.png');
      expect(img.getAttribute('alt')).toBe('Pic');
      expect(avatarEl.querySelector('.ag-avatar-text')).toBeNull();
    });

    it('should render an icon element when icon is provided, taking priority over src', () => {
      new Avatar(avatarEl, { icon: 'star', src: 'https://example.com/avatar.png' });
      expect(avatarEl.querySelector('.ag-avatar-icon')?.textContent).toBe('star');
      expect(avatarEl.querySelector('.ag-avatar-image')).toBeNull();
      expect(avatarEl.className).toContain('ag-avatar--icon');
    });

    it('should apply square shape class', () => {
      new Avatar(avatarEl, { shape: 'square' });
      expect(avatarEl.className).toContain('ag-avatar--square');
      expect(avatarEl.className).not.toContain('ag-avatar--circle');
    });

    it('should apply size class', () => {
      new Avatar(avatarEl, { size: 'lg' });
      expect(avatarEl.className).toContain('ag-avatar--lg');
      expect(avatarEl.className).not.toContain('ag-avatar--md');
    });
  });

  describe('image error handling', () => {
    it('should call onError and fall back to text content when the image fails to load', () => {
      const onError = vi.fn();
      new Avatar(avatarEl, { src: 'bad-src.png', alt: 'Jane Doe', onError });

      const img = avatarEl.querySelector('.ag-avatar-image') as HTMLImageElement;
      img.dispatchEvent(new Event('error'));

      expect(onError).toHaveBeenCalledTimes(1);
      expect(avatarEl.querySelector('.ag-avatar-image')).toBeNull();
      expect(avatarEl.querySelector('.ag-avatar-text')?.textContent).toBe('JD');
    });
  });

  describe('setSrc', () => {
    it('should update the image element src when an image is rendered', () => {
      const avatar = new Avatar(avatarEl, { src: 'first.png' });
      avatar.setSrc('second.png');
      const img = avatarEl.querySelector('.ag-avatar-image') as HTMLImageElement;
      expect(img.getAttribute('src')).toBe('second.png');
    });
  });

  describe('setShape', () => {
    it('should update the shape class', () => {
      const avatar = new Avatar(avatarEl, { shape: 'circle' });
      avatar.setShape('square');
      expect(avatarEl.className).toContain('ag-avatar--square');
      expect(avatarEl.className).not.toContain('ag-avatar--circle');
    });
  });

  describe('size management', () => {
    it('should set size and update classes', () => {
      const avatar = new Avatar(avatarEl);
      avatar.setSize('sm');
      expect(avatar.getSize()).toBe('sm');
      expect(avatarEl.className).toContain('ag-avatar--sm');
      expect(avatarEl.className).not.toContain('ag-avatar--md');
    });

    it('should get default size', () => {
      const avatar = new Avatar(avatarEl);
      expect(avatar.getSize()).toBe('md');
    });
  });

  describe('destroy', () => {
    it('should remove the image element created by the component', () => {
      const avatar = new Avatar(avatarEl, { src: 'pic.png' });
      expect(avatarEl.querySelector('.ag-avatar-image')).not.toBeNull();
      avatar.destroy();
      expect(avatarEl.querySelector('.ag-avatar-image')).toBeNull();
    });

    it('should remove the icon element created by the component', () => {
      const avatar = new Avatar(avatarEl, { icon: 'star' });
      expect(avatarEl.querySelector('.ag-avatar-icon')).not.toBeNull();
      avatar.destroy();
      expect(avatarEl.querySelector('.ag-avatar-icon')).toBeNull();
    });

    it('should stop the error listener from firing onError after destroy', () => {
      const onError = vi.fn();
      const avatar = new Avatar(avatarEl, { src: 'bad-src.png', onError });
      const img = avatarEl.querySelector('.ag-avatar-image') as HTMLImageElement;

      avatar.destroy();

      img.dispatchEvent(new Event('error'));
      expect(onError).not.toHaveBeenCalled();
    });

    it('should not remove the avatar root element itself', () => {
      const avatar = new Avatar(avatarEl, { src: 'pic.png' });
      avatar.destroy();
      expect(container.contains(avatarEl)).toBe(true);
    });
  });

  describe('createAvatar', () => {
    it('should create an avatar element from scratch with the given options', () => {
      const avatar = createAvatar({ alt: 'John Smith', size: 'lg' });
      const element = avatar.getElement();
      expect(element.tagName).toBe('DIV');
      expect(element.className).toContain('ag-avatar');
      expect(element.className).toContain('ag-avatar--lg');
      expect(element.querySelector('.ag-avatar-text')?.textContent).toBe('JS');
    });
  });
});
