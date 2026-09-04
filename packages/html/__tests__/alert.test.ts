import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Alert, createAlert } from '../src/components/alert';

describe('Alert Component', () => {
  let container: HTMLDivElement;
  let alertEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    alertEl = document.createElement('div');
    container.appendChild(alertEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const alert = new Alert(alertEl);
      expect(alert.getElement()).toBe(alertEl);
    });

    it('should initialize with element selector', () => {
      alertEl.id = 'test-alert';
      const alert = new Alert('#test-alert');
      expect(alert.getElement()).toBe(alertEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Alert('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should apply default variant and non-closeable classes', () => {
      new Alert(alertEl);
      expect(alertEl.className).toContain('ag-alert');
      expect(alertEl.className).toContain('ag-alert--info');
      expect(alertEl.className).not.toContain('ag-alert--closeable');
      expect(alertEl.querySelector('.ag-alert-close')).toBeNull();
    });

    it('should render title and description when provided', () => {
      new Alert(alertEl, { title: 'Heads up', description: 'Something happened' });
      expect(alertEl.querySelector('.ag-alert-title')?.textContent).toBe('Heads up');
      expect(alertEl.querySelector('.ag-alert-description')?.textContent).toBe(
        'Something happened'
      );
    });

    it('should not render title/description elements when omitted', () => {
      new Alert(alertEl);
      expect(alertEl.querySelector('.ag-alert-title')).toBeNull();
      expect(alertEl.querySelector('.ag-alert-description')).toBeNull();
    });

    it('should apply variant class', () => {
      new Alert(alertEl, { variant: 'danger' });
      expect(alertEl.className).toContain('ag-alert--danger');
      expect(alertEl.className).not.toContain('ag-alert--info');
    });

    it('should render a close button when closeable', () => {
      new Alert(alertEl, { closeable: true });
      expect(alertEl.querySelector('.ag-alert-close')).not.toBeNull();
      expect(alertEl.className).toContain('ag-alert--closeable');
    });
  });

  describe('setTitle / setDescription', () => {
    it('should update the existing title element text', () => {
      const alert = new Alert(alertEl, { title: 'Original' });
      alert.setTitle('Updated');
      expect(alertEl.querySelector('.ag-alert-title')?.textContent).toBe('Updated');
    });

    it('should update the existing description element text', () => {
      const alert = new Alert(alertEl, { description: 'Original desc' });
      alert.setDescription('Updated desc');
      expect(alertEl.querySelector('.ag-alert-description')?.textContent).toBe(
        'Updated desc'
      );
    });
  });

  describe('variant management', () => {
    it('should set variant and update classes', () => {
      const alert = new Alert(alertEl);
      alert.setVariant('success');
      expect(alert.getVariant()).toBe('success');
      expect(alertEl.className).toContain('ag-alert--success');
      expect(alertEl.className).not.toContain('ag-alert--info');
    });

    it('should get default variant', () => {
      const alert = new Alert(alertEl);
      expect(alert.getVariant()).toBe('info');
    });
  });

  describe('close', () => {
    it('should remove the element from the DOM and call onClose after the delay when close button is clicked', () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      new Alert(alertEl, { closeable: true, onClose });

      const closeBtn = alertEl.querySelector('.ag-alert-close') as HTMLButtonElement;
      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      // Not removed synchronously - opacity transition is scheduled.
      expect(container.contains(alertEl)).toBe(true);
      expect(onClose).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(container.contains(alertEl)).toBe(false);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should set opacity to 0 immediately when close() is called directly', () => {
      const alert = new Alert(alertEl, { closeable: true });
      alert.close();
      expect(alertEl.style.opacity).toBe('0');
    });
  });

  describe('destroy', () => {
    it('should remove the close button and listeners', () => {
      const onClose = vi.fn();
      const alert = new Alert(alertEl, { closeable: true, onClose });
      const closeBtn = alertEl.querySelector('.ag-alert-close') as HTMLButtonElement;

      alert.destroy();

      expect(alertEl.querySelector('.ag-alert-close')).toBeNull();

      // The button is detached but the click listener should no longer fire onClose.
      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not remove the alert root element itself', () => {
      const alert = new Alert(alertEl, { closeable: true });
      alert.destroy();
      expect(container.contains(alertEl)).toBe(true);
    });
  });

  describe('createAlert', () => {
    it('should create an alert element from scratch with the given options', () => {
      const alert = createAlert({ title: 'Created', variant: 'warning' });
      const element = alert.getElement();
      expect(element.tagName).toBe('DIV');
      expect(element.className).toContain('ag-alert');
      expect(element.className).toContain('ag-alert--warning');
      expect(element.querySelector('.ag-alert-title')?.textContent).toBe('Created');
    });

    it('should wire up onClose for the created alert', () => {
      vi.useFakeTimers();
      const onClose = vi.fn();
      const alert = createAlert({ closeable: true, onClose });
      const closeBtn = alert.getElement().querySelector('.ag-alert-close') as HTMLButtonElement;

      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      vi.advanceTimersByTime(300);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
