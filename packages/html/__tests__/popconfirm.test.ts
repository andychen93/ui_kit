import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Popconfirm, createPopconfirm } from '../src/components/popconfirm';

describe('Popconfirm Component', () => {
  let container: HTMLDivElement;
  let target: HTMLButtonElement;
  let instances: Popconfirm[];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    target = document.createElement('button');
    target.textContent = 'Target';
    container.appendChild(target);
    instances = [];
  });

  afterEach(() => {
    instances.forEach((p) => p.destroy());
    document.body.removeChild(container);
  });

  function make(options?: ConstructorParameters<typeof Popconfirm>[1]) {
    const popconfirm = new Popconfirm(target, options);
    instances.push(popconfirm);
    return popconfirm;
  }

  function getButtons(popconfirm: Popconfirm) {
    const el = popconfirm.getPopconfirmElement();
    const buttons = el.querySelectorAll('button');
    // cancel button is appended before the confirm/ok button
    return {
      cancelBtn: buttons[0] as HTMLButtonElement,
      okBtn: buttons[1] as HTMLButtonElement,
    };
  }

  describe('constructor', () => {
    it('should initialize with an element reference', () => {
      const popconfirm = make({ title: 'Sure?' });
      expect(popconfirm.getTarget()).toBe(target);
    });

    it('should initialize with a CSS selector', () => {
      target.id = 'popconfirm-target';
      const popconfirm = new Popconfirm('#popconfirm-target', { title: 'Sure?' });
      instances.push(popconfirm);
      expect(popconfirm.getTarget()).toBe(target);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Popconfirm('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should append a portal element reflecting title, description and button text', () => {
      const popconfirm = make({
        title: 'Delete item?',
        description: 'This cannot be undone.',
        okText: 'Yes',
        cancelText: 'No',
      });
      const el = popconfirm.getPopconfirmElement();

      expect(el.parentNode).toBe(document.body);
      expect(el.querySelector('.ag-popconfirm-header')?.textContent).toBe('Delete item?');
      expect(el.querySelector('.ag-popconfirm-body')?.textContent).toBe(
        'This cannot be undone.'
      );

      const { cancelBtn, okBtn } = getButtons(popconfirm);
      expect(cancelBtn.textContent).toBe('No');
      expect(okBtn.textContent).toBe('Yes');
    });

    it('should default to OK/Cancel button text', () => {
      const popconfirm = make({ title: 'Sure?' });
      const { cancelBtn, okBtn } = getButtons(popconfirm);
      expect(cancelBtn.textContent).toBe('Cancel');
      expect(okBtn.textContent).toBe('OK');
    });

    it('should reflect variant option in classes', () => {
      const popconfirm = make({ variant: 'danger' });
      expect(popconfirm.getPopconfirmElement().className).toContain('ag-popconfirm--danger');
    });
  });

  describe('show / hide / toggle', () => {
    it('should default to a click trigger toggling visibility', () => {
      const popconfirm = make({ title: 'Sure?' });

      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(popconfirm.isVisible()).toBe(true);

      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(popconfirm.isVisible()).toBe(false);
    });

    it('show()/hide() should directly control visibility', () => {
      const popconfirm = make({ title: 'Sure?' });
      popconfirm.show();
      expect(popconfirm.isVisible()).toBe(true);
      expect(popconfirm.getPopconfirmElement().style.display).toBe('block');

      popconfirm.hide();
      expect(popconfirm.isVisible()).toBe(false);
      expect(popconfirm.getPopconfirmElement().style.display).toBe('none');
    });

    it('toggle() should flip visibility', () => {
      const popconfirm = make({ title: 'Sure?' });
      popconfirm.toggle();
      expect(popconfirm.isVisible()).toBe(true);
      popconfirm.toggle();
      expect(popconfirm.isVisible()).toBe(false);
    });

    it('should call onVisibleChange on show and hide', () => {
      const onVisibleChange = vi.fn();
      const popconfirm = make({ title: 'Sure?', onVisibleChange });

      popconfirm.show();
      expect(onVisibleChange).toHaveBeenCalledWith(true);
      popconfirm.hide();
      expect(onVisibleChange).toHaveBeenCalledWith(false);
    });
  });

  describe('onConfirm / onCancel', () => {
    it('clicking the OK button should call onConfirm and hide the popconfirm', () => {
      const onConfirm = vi.fn();
      const popconfirm = make({ title: 'Sure?', onConfirm });
      popconfirm.show();

      const { okBtn } = getButtons(popconfirm);
      okBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(popconfirm.isVisible()).toBe(false);
    });

    it('clicking the Cancel button should call onCancel and hide the popconfirm', () => {
      const onCancel = vi.fn();
      const popconfirm = make({ title: 'Sure?', onCancel });
      popconfirm.show();

      const { cancelBtn } = getButtons(popconfirm);
      cancelBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(popconfirm.isVisible()).toBe(false);
    });

    it('clicking the OK button should not trigger onCancel', () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();
      const popconfirm = make({ title: 'Sure?', onConfirm, onCancel });
      popconfirm.show();

      const { okBtn } = getButtons(popconfirm);
      okBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('disabled', () => {
    it('should block show() when disabled', () => {
      const popconfirm = make({ title: 'Sure?', disabled: true });
      popconfirm.show();
      expect(popconfirm.isVisible()).toBe(false);
    });

    it('setDisabled(true) should hide a currently visible popconfirm', () => {
      const popconfirm = make({ title: 'Sure?' });
      popconfirm.show();
      popconfirm.setDisabled(true);
      expect(popconfirm.isVisible()).toBe(false);
      expect(popconfirm.isDisabled()).toBe(true);
    });
  });

  describe('setters', () => {
    it('setTitle should update the header text', () => {
      const popconfirm = make({ title: 'Old' });
      popconfirm.setTitle('New');
      expect(
        popconfirm.getPopconfirmElement().querySelector('.ag-popconfirm-header')?.textContent
      ).toBe('New');
    });

    it('setDescription should update the body text', () => {
      const popconfirm = make({ title: 'T', description: 'Old desc' });
      popconfirm.setDescription('New desc');
      expect(
        popconfirm.getPopconfirmElement().querySelector('.ag-popconfirm-body')?.textContent
      ).toBe('New desc');
    });

    it('setOkText should update the confirm button text', () => {
      const popconfirm = make({ title: 'T' });
      popconfirm.setOkText('Confirm');
      const { okBtn } = getButtons(popconfirm);
      expect(okBtn.textContent).toBe('Confirm');
    });

    it('setCancelText should update the cancel button text', () => {
      const popconfirm = make({ title: 'T' });
      popconfirm.setCancelText('Nope');
      const { cancelBtn } = getButtons(popconfirm);
      expect(cancelBtn.textContent).toBe('Nope');
    });
  });

  describe('destroy', () => {
    it('should remove the portal element from document.body', () => {
      const popconfirm = make({ title: 'Sure?' });
      const el = popconfirm.getPopconfirmElement();
      expect(document.body.contains(el)).toBe(true);

      popconfirm.destroy();
      expect(document.body.contains(el)).toBe(false);
    });

    it('should remove listeners so clicking the target no longer shows it', () => {
      const popconfirm = make({ title: 'Sure?' });
      popconfirm.destroy();

      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(popconfirm.isVisible()).toBe(false);
    });
  });

  describe('createPopconfirm factory', () => {
    it('should attach a popconfirm to the given target element', () => {
      const popconfirm = createPopconfirm(target, { title: 'Sure?' });
      expect(popconfirm).toBeInstanceOf(Popconfirm);
      expect(popconfirm.getTarget()).toBe(target);
      popconfirm.destroy();
    });

    it('should accept a selector string as the target', () => {
      target.id = 'popconfirm-factory-target';
      const popconfirm = createPopconfirm('#popconfirm-factory-target', { title: 'Sure?' });
      expect(popconfirm.getTarget()).toBe(target);
      popconfirm.destroy();
    });

    it('should throw when the selector does not resolve to an element', () => {
      expect(() => createPopconfirm('#missing-popconfirm-target', { title: 'Sure?' })).toThrow(
        'Element not found for selector: #missing-popconfirm-target'
      );
    });
  });
});
