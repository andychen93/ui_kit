import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SweetAlert, createSweetAlert, fireSweetAlert } from '../src/components/sweet-alert';

describe('SweetAlert Component', () => {
  let container: HTMLDivElement;
  let el: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    el = document.createElement('div');
    container.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(container);
    // Clean up any stray masks left by fireSweetAlert tests that didn't
    // resolve (defensive; each test settles its own promise).
    document.querySelectorAll('.ag-sweet-alert-mask').forEach((m) => m.remove());
  });

  describe('constructor', () => {
    it('should initialize with an element reference', () => {
      const alert = new SweetAlert(el, { title: 'Hi' });
      expect(alert.getElement()).toBe(el);
    });

    it('should initialize with a CSS selector', () => {
      el.id = 'sweet-alert-target';
      const alert = new SweetAlert('#sweet-alert-target', { title: 'Hi' });
      expect(alert.getElement()).toBe(el);
    });

    it('should throw error if selector not found', () => {
      expect(() => new SweetAlert('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should reflect title and description in the DOM', () => {
      const alert = new SweetAlert(el, {
        title: 'Are you sure?',
        description: 'This will do a thing.',
      });

      expect(el.querySelector('.ag-sweet-alert-title')?.textContent).toBe('Are you sure?');
      expect(el.querySelector('.ag-sweet-alert-description')?.textContent).toBe(
        'This will do a thing.'
      );
      expect(el.className).toContain('ag-sweet-alert');
    });

    it('should render only a confirm button by default', () => {
      const alert = new SweetAlert(el, { title: 'T' });
      const buttons = el.querySelectorAll('button');
      expect(buttons.length).toBe(1);
      expect(buttons[0].textContent).toBe('OK');
      expect(buttons[0].className).toContain('ag-btn--primary');
    });

    it('should render a cancel button when showCancel is true', () => {
      const alert = new SweetAlert(el, {
        title: 'T',
        showCancel: true,
        confirmText: 'Yes',
        cancelText: 'No',
      });
      const buttons = el.querySelectorAll('button');
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toBe('No');
      expect(buttons[1].textContent).toBe('Yes');
    });

    it('should render no buttons when showConfirm is false and showCancel is false', () => {
      const alert = new SweetAlert(el, { title: 'T', showConfirm: false });
      expect(el.querySelectorAll('button').length).toBe(0);
    });

    it('should reflect the type option in an icon and class', () => {
      const alert = new SweetAlert(el, { title: 'T', type: 'success' });
      expect(el.className).toContain('ag-sweet-alert--info'); // variant defaults to info
      expect(el.querySelector('.ag-sweet-alert-icon svg')).not.toBeNull();
    });
  });

  describe('show', () => {
    it('should set the element display to block', () => {
      const alert = new SweetAlert(el, { title: 'T' });
      alert.show();
      expect(el.style.display).toBe('block');
    });
  });

  describe('onConfirm / onCancel', () => {
    it('clicking the confirm button should call onConfirm and close the alert', () => {
      const onConfirm = vi.fn();
      const alert = new SweetAlert(el, { title: 'T', onConfirm });

      const confirmBtn = el.querySelector('button') as HTMLButtonElement;
      confirmBtn.click();

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(alert.isClosed()).toBe(true);
    });

    it('clicking the cancel button should call onCancel and close the alert', () => {
      const onCancel = vi.fn();
      const alert = new SweetAlert(el, { title: 'T', showCancel: true, onCancel });

      const cancelBtn = el.querySelectorAll('button')[0] as HTMLButtonElement;
      cancelBtn.click();

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(alert.isClosed()).toBe(true);
    });
  });

  describe('setTitle / setDescription / setType', () => {
    it('setTitle should update the title text', () => {
      const alert = new SweetAlert(el, { title: 'Old' });
      alert.setTitle('New');
      expect(el.querySelector('.ag-sweet-alert-title')?.textContent).toBe('New');
    });

    it('setDescription should update the description text', () => {
      const alert = new SweetAlert(el, { title: 'T', description: 'Old' });
      alert.setDescription('New');
      expect(el.querySelector('.ag-sweet-alert-description')?.textContent).toBe('New');
    });

    it('setType should update the icon markup', () => {
      const alert = new SweetAlert(el, { title: 'T', type: 'info' });
      const before = el.querySelector('.ag-sweet-alert-icon')?.innerHTML;

      alert.setType('error');
      const after = el.querySelector('.ag-sweet-alert-icon')?.innerHTML;

      expect(after).not.toBe(before);
      expect(el.className).toContain('ag-sweet-alert--info'); // variant unaffected by type
    });
  });

  describe('close', () => {
    it('should remove the element from the DOM', () => {
      const alert = new SweetAlert(el, { title: 'T' });
      alert.close();
      expect(el.parentNode).toBeNull();
    });

    it('should be idempotent: calling twice does not throw or double-fire', () => {
      const onConfirm = vi.fn();
      const alert = new SweetAlert(el, { title: 'T', onConfirm });

      expect(() => {
        alert.close();
        alert.close();
      }).not.toThrow();
      expect(alert.isClosed()).toBe(true);
      // close() itself never calls onConfirm; only button clicks do.
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('clicking confirm twice (e.g. double click) should only fire onConfirm once', () => {
      const onConfirm = vi.fn();
      const alert = new SweetAlert(el, { title: 'T', onConfirm });
      const confirmBtn = el.querySelector('button') as HTMLButtonElement;

      confirmBtn.click();
      // Button has been removed from the DOM by destroy(); clicking the
      // detached reference again should not resurrect behavior since
      // listeners were cleaned up and close() is idempotent.
      confirmBtn.click();

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    it('should remove confirm and cancel buttons from the DOM', () => {
      const alert = new SweetAlert(el, { title: 'T', showCancel: true });
      expect(el.querySelectorAll('button').length).toBe(2);

      alert.destroy();
      expect(el.querySelectorAll('button').length).toBe(0);
    });

    it('should remove listeners so a stale button reference no longer fires callbacks', () => {
      const onConfirm = vi.fn();
      const alert = new SweetAlert(el, { title: 'T', onConfirm });
      const confirmBtn = el.querySelector('button') as HTMLButtonElement;

      alert.destroy();
      confirmBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('createSweetAlert', () => {
    it('should build a standalone sweet-alert element with the given options', () => {
      const alert = createSweetAlert({ title: 'Standalone', showCancel: true });
      const built = alert.getElement();

      expect(built.className).toContain('ag-sweet-alert');
      expect(built.querySelector('.ag-sweet-alert-title')?.textContent).toBe('Standalone');
      expect(built.querySelectorAll('button').length).toBe(2);
    });
  });

  describe('fireSweetAlert', () => {
    it('should append a mask + alert to document.body and resolve { confirmed: true } on confirm click', async () => {
      const promise = fireSweetAlert({ title: 'Fire confirm' });

      const mask = document.body.querySelector('.ag-sweet-alert-mask');
      expect(mask).not.toBeNull();

      const confirmBtn = mask!.querySelector('button') as HTMLButtonElement;
      expect(confirmBtn).not.toBeNull();
      confirmBtn.click();

      const result = await promise;
      expect(result).toEqual({ confirmed: true });
      expect(document.body.querySelector('.ag-sweet-alert-mask')).toBeNull();
    });

    it('should resolve { confirmed: false } on cancel click', async () => {
      const promise = fireSweetAlert({ title: 'Fire cancel', showCancel: true });

      const mask = document.body.querySelector('.ag-sweet-alert-mask');
      expect(mask).not.toBeNull();

      const buttons = mask!.querySelectorAll('button');
      const cancelBtn = buttons[0] as HTMLButtonElement;
      cancelBtn.click();

      const result = await promise;
      expect(result).toEqual({ confirmed: false });
      expect(document.body.querySelector('.ag-sweet-alert-mask')).toBeNull();
    });

    it('should call the user-provided onConfirm callback in addition to resolving', async () => {
      const onConfirm = vi.fn();
      const promise = fireSweetAlert({ title: 'T', onConfirm });

      const mask = document.body.querySelector('.ag-sweet-alert-mask') as HTMLElement;
      const confirmBtn = mask.querySelector('button') as HTMLButtonElement;
      confirmBtn.click();

      await promise;
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });
});
