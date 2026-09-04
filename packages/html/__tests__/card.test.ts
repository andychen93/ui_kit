import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Card, createCard } from '../src/components/card';

describe('Card Component', () => {
  let container: HTMLDivElement;
  let cardEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    cardEl = document.createElement('div');
    container.appendChild(cardEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with an element reference', () => {
      const card = new Card(cardEl);
      expect(card.getElement()).toBe(cardEl);
    });

    it('should initialize with a CSS selector string', () => {
      cardEl.id = 'test-card';
      const card = new Card('#test-card');
      expect(card.getElement()).toBe(cardEl);
    });

    it('should throw when the selector does not match any element', () => {
      expect(() => new Card('#does-not-exist')).toThrow(
        'Element not found for selector: #does-not-exist'
      );
    });
  });

  describe('initial render', () => {
    it('should render header with title and extra when provided', () => {
      const card = new Card(cardEl, { title: 'My Card', extra: 'More' });

      const header = cardEl.querySelector('.ag-card-header');
      expect(header).not.toBeNull();
      expect(header?.querySelector('.ag-card-title')?.textContent).toBe('My Card');
      expect(header?.querySelector('.ag-card-extra')?.textContent).toBe('More');
    });

    it('should not render title/extra elements when omitted', () => {
      const card = new Card(cardEl);
      const header = cardEl.querySelector('.ag-card-header');
      expect(header?.querySelector('.ag-card-title')).toBeNull();
      expect(header?.querySelector('.ag-card-extra')).toBeNull();
    });

    it('should render a content body element', () => {
      const card = new Card(cardEl);
      const body = cardEl.querySelector('.ag-card-body');
      expect(body).not.toBeNull();
    });

    it('should apply bordered class by default', () => {
      const card = new Card(cardEl);
      expect(cardEl.className).toContain('ag-card--bordered');
    });

    it('should omit bordered class when bordered is false', () => {
      const card = new Card(cardEl, { bordered: false });
      expect(cardEl.className).not.toContain('ag-card--bordered');
    });

    it('should render a loading element when loading option is true', () => {
      const card = new Card(cardEl, { loading: true });
      expect(cardEl.className).toContain('ag-card--loading');
      expect(cardEl.querySelector('.ag-card-loading')).not.toBeNull();
      expect(cardEl.querySelector('.ag-spin-dot')).not.toBeNull();
    });

    it('should not render a loading element when loading option is omitted', () => {
      const card = new Card(cardEl);
      expect(cardEl.querySelector('.ag-card-loading')).toBeNull();
    });
  });

  describe('setTitle', () => {
    it('should update the existing title element text content', () => {
      const card = new Card(cardEl, { title: 'Old' });
      card.setTitle('New');
      expect(cardEl.querySelector('.ag-card-title')?.textContent).toBe('New');
    });
  });

  describe('setExtra', () => {
    it('should create an extra element if one does not exist', () => {
      const card = new Card(cardEl, { title: 'T' });
      expect(cardEl.querySelector('.ag-card-extra')).toBeNull();
      card.setExtra('New Extra');
      expect(cardEl.querySelector('.ag-card-extra')?.textContent).toBe('New Extra');
    });

    it('should update an existing extra element text content', () => {
      const card = new Card(cardEl, { extra: 'Old Extra' });
      card.setExtra('Updated Extra');
      expect(cardEl.querySelector('.ag-card-extra')?.textContent).toBe('Updated Extra');
    });

    it('should remove the extra element when set to an empty string', () => {
      const card = new Card(cardEl, { extra: 'Extra' });
      card.setExtra('');
      expect(cardEl.querySelector('.ag-card-extra')).toBeNull();
    });
  });

  describe('setBordered', () => {
    it('should toggle the bordered class', () => {
      const card = new Card(cardEl, { bordered: true });
      card.setBordered(false);
      expect(cardEl.className).not.toContain('ag-card--bordered');
      card.setBordered(true);
      expect(cardEl.className).toContain('ag-card--bordered');
    });
  });

  describe('showLoading / hideLoading', () => {
    it('should create and show the loading element, dimming content opacity', () => {
      const card = new Card(cardEl);
      expect(cardEl.querySelector('.ag-card-loading')).toBeNull();

      card.showLoading();

      expect(cardEl.className).toContain('ag-card--loading');
      const loadingEl = cardEl.querySelector('.ag-card-loading') as HTMLElement;
      expect(loadingEl).not.toBeNull();

      const body = cardEl.querySelector('.ag-card-body') as HTMLElement;
      expect(body.style.opacity).toBe('0.5');
    });

    it('should set the existing loading element display back to block when re-shown', () => {
      const card = new Card(cardEl, { loading: true });
      card.hideLoading();
      const loadingEl = cardEl.querySelector('.ag-card-loading') as HTMLElement;
      expect(loadingEl.style.display).toBe('none');

      card.showLoading();

      expect(loadingEl.style.display).toBe('block');
    });

    it('should reuse existing loading element on subsequent showLoading calls', () => {
      const card = new Card(cardEl, { loading: true });
      const loadingEl = cardEl.querySelector('.ag-card-loading');
      card.hideLoading();
      card.showLoading();
      // Only one loading element should exist, reused rather than duplicated
      expect(cardEl.querySelectorAll('.ag-card-loading').length).toBe(1);
      expect(cardEl.querySelector('.ag-card-loading')).toBe(loadingEl);
    });

    it('should hide the loading element and restore content opacity', () => {
      const card = new Card(cardEl, { loading: true });
      card.hideLoading();

      expect(cardEl.className).not.toContain('ag-card--loading');
      const loadingEl = cardEl.querySelector('.ag-card-loading') as HTMLElement;
      expect(loadingEl.style.display).toBe('none');

      const body = cardEl.querySelector('.ag-card-body') as HTMLElement;
      expect(body.style.opacity).toBe('1');
    });
  });

  describe('destroy', () => {
    it('should remove header, body and loading elements from the DOM', () => {
      const card = new Card(cardEl, { title: 'T', loading: true });
      const header = cardEl.querySelector('.ag-card-header');
      const body = cardEl.querySelector('.ag-card-body');
      const loading = cardEl.querySelector('.ag-card-loading');
      expect(header).not.toBeNull();
      expect(body).not.toBeNull();
      expect(loading).not.toBeNull();

      card.destroy();

      expect(cardEl.querySelector('.ag-card-header')).toBeNull();
      expect(cardEl.querySelector('.ag-card-body')).toBeNull();
      expect(cardEl.querySelector('.ag-card-loading')).toBeNull();
    });
  });

  describe('createCard', () => {
    it('should create a card element from scratch reflecting given options', () => {
      const card = createCard({ title: 'Fresh Card', bordered: true });
      const element = card.getElement();
      expect(element.className).toContain('ag-card');
      expect(element.className).toContain('ag-card--bordered');
      expect(element.querySelector('.ag-card-title')?.textContent).toBe('Fresh Card');
    });
  });
});
