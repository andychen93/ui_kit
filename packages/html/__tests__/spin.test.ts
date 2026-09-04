import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Spin, createSpin } from '../src/components/spin';

describe('Spin Component', () => {
  let container: HTMLDivElement;
  let spinEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    spinEl = document.createElement('div');
    container.appendChild(spinEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const spin = new Spin(spinEl);
      expect(spin.getElement()).toBe(spinEl);
    });

    it('should initialize with selector', () => {
      spinEl.id = 'test-spin';
      const spin = new Spin('#test-spin');
      expect(spin.getElement()).toBe(spinEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Spin('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should apply default size and variant classes', () => {
      new Spin(spinEl);
      expect(spinEl.className).toContain('ag-spin');
      expect(spinEl.className).toContain('ag-spin--md');
      expect(spinEl.className).toContain('ag-spin--primary');
    });

    it('should apply custom size and variant classes', () => {
      new Spin(spinEl, { size: 'lg', variant: 'danger' });
      expect(spinEl.className).toContain('ag-spin--lg');
      expect(spinEl.className).toContain('ag-spin--danger');
      expect(spinEl.className).not.toContain('ag-spin--md');
    });

    it('should always render a spinner dot structure', () => {
      new Spin(spinEl);
      const dot = spinEl.querySelector('.ag-spin-dot');
      expect(dot).not.toBeNull();
      expect(dot?.querySelector('.ag-spin-dot-inner')).not.toBeNull();
    });

    it('should render tip text when provided', () => {
      new Spin(spinEl, { tip: 'Loading...' });
      const tip = spinEl.querySelector('.ag-spin-text');
      expect(tip?.textContent).toBe('Loading...');
    });

    it('should not render a tip element when omitted', () => {
      new Spin(spinEl);
      expect(spinEl.querySelector('.ag-spin-text')).toBeNull();
    });

    it('should default to spinning (visible) state', () => {
      new Spin(spinEl);
      expect(spinEl.style.display).not.toBe('none');
    });

    it('should hide the element when spinning is false', () => {
      new Spin(spinEl, { spinning: false });
      expect(spinEl.style.display).toBe('none');
    });
  });

  describe('show / hide', () => {
    it('should hide the element via hide()', () => {
      const spin = new Spin(spinEl);
      spin.hide();
      expect(spinEl.style.display).toBe('none');
    });

    it('should show the element via show() after hide()', () => {
      const spin = new Spin(spinEl, { spinning: false });
      expect(spinEl.style.display).toBe('none');
      spin.show();
      expect(spinEl.style.display).toBe('block');
    });
  });

  describe('setSpinning', () => {
    it('should hide the element when set to false', () => {
      const spin = new Spin(spinEl);
      spin.setSpinning(false);
      expect(spinEl.style.display).toBe('none');
    });

    it('should show the element when set to true', () => {
      const spin = new Spin(spinEl, { spinning: false });
      spin.setSpinning(true);
      expect(spinEl.style.display).toBe('block');
    });
  });

  describe('setTip', () => {
    it('should update the existing tip text content', () => {
      const spin = new Spin(spinEl, { tip: 'Loading...' });
      spin.setTip('Please wait');
      expect(spinEl.querySelector('.ag-spin-text')?.textContent).toBe('Please wait');
    });

    it('should not create a tip element if none existed initially', () => {
      const spin = new Spin(spinEl);
      spin.setTip('New tip');
      expect(spinEl.querySelector('.ag-spin-text')).toBeNull();
    });
  });

  describe('setSize', () => {
    it('should update the size class', () => {
      const spin = new Spin(spinEl);
      spin.setSize('sm');
      expect(spinEl.className).toContain('ag-spin--sm');
      expect(spinEl.className).not.toContain('ag-spin--md');
    });
  });

  describe('setVariant', () => {
    it('should update the variant class', () => {
      const spin = new Spin(spinEl);
      spin.setVariant('success');
      expect(spinEl.className).toContain('ag-spin--success');
      expect(spinEl.className).not.toContain('ag-spin--primary');
    });
  });

  describe('destroy', () => {
    it('should remove the spinner dot element from the DOM', () => {
      const spin = new Spin(spinEl);
      expect(spinEl.querySelector('.ag-spin-dot')).not.toBeNull();
      spin.destroy();
      expect(spinEl.querySelector('.ag-spin-dot')).toBeNull();
    });

    it('should remove the tip element from the DOM', () => {
      const spin = new Spin(spinEl, { tip: 'Loading...' });
      expect(spinEl.querySelector('.ag-spin-text')).not.toBeNull();
      spin.destroy();
      expect(spinEl.querySelector('.ag-spin-text')).toBeNull();
    });

    it('should not remove the root element itself', () => {
      const spin = new Spin(spinEl);
      spin.destroy();
      expect(spinEl.parentElement).toBe(container);
    });
  });

  describe('createSpin', () => {
    it('should create a spin element from scratch with options applied', () => {
      const spin = createSpin({ tip: 'Working', size: 'lg' });
      const element = spin.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.className).toContain('ag-spin--lg');
      expect(element.querySelector('.ag-spin-text')?.textContent).toBe('Working');
    });
  });
});
