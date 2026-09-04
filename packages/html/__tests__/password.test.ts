import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Password, createPassword } from '../src/components/password';

describe('Password Component', () => {
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
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const comp = new Password(el);
      expect(comp.getElement()).toBe(el);
    });

    it('should initialize with selector', () => {
      el.id = 'test-password';
      const comp = new Password('#test-password');
      expect(comp.getElement()).toBe(el);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Password('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });

    it('should build an input of type password and a toggle button by default', () => {
      new Password(el);
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('password');
      expect(el.querySelector('.ag-password-toggle')).not.toBeNull();
    });

    it('should not build a toggle button when toggleVisible is false', () => {
      new Password(el, { toggleVisible: false });
      expect(el.querySelector('.ag-password-toggle')).toBeNull();
    });
  });

  describe('initial render', () => {
    it('should reflect the initial value', () => {
      new Password(el, { value: 'secret123' });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('secret123');
    });

    it('should reflect placeholder', () => {
      new Password(el, { placeholder: 'Password' });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('Password');
    });

    it('should reflect maxLength/minLength/pattern attributes', () => {
      new Password(el, { maxLength: 20, minLength: 6, pattern: '.*' });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('maxlength')).toBe('20');
      expect(input.getAttribute('minlength')).toBe('6');
      expect(input.getAttribute('pattern')).toBe('.*');
    });

    it('should reflect disabled state', () => {
      new Password(el, { disabled: true });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
      expect(el.className).toContain('ag-input--disabled');
    });

    it('should reflect error state', () => {
      new Password(el, { error: 'Too short' });
      expect(el.className).toContain('ag-input--error');
    });

    it('should reflect readonly and required attributes', () => {
      new Password(el, { readonly: true, required: true });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).toBe(true);
      expect(input.required).toBe(true);
    });
  });

  describe('toggleVisibility', () => {
    it('should switch the input type between password and text', () => {
      const comp = new Password(el);
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('password');

      comp.toggleVisibility();
      expect(input.type).toBe('text');
      expect(comp.isVisible()).toBe(true);

      comp.toggleVisibility();
      expect(input.type).toBe('password');
      expect(comp.isVisible()).toBe(false);
    });

    it('should switch the type when clicking the toggle button', () => {
      new Password(el);
      const input = el.querySelector('input') as HTMLInputElement;
      const toggle = el.querySelector('.ag-password-toggle') as HTMLButtonElement;

      toggle.click();
      expect(input.type).toBe('text');

      toggle.click();
      expect(input.type).toBe('password');
    });

    it('should set visibility directly via setVisible', () => {
      const comp = new Password(el);
      const input = el.querySelector('input') as HTMLInputElement;

      comp.setVisible(true);
      expect(input.type).toBe('text');
      expect(comp.isVisible()).toBe(true);

      comp.setVisible(false);
      expect(input.type).toBe('password');
      expect(comp.isVisible()).toBe(false);
    });

    it('should be a no-op when setVisible is called with the current state', () => {
      const comp = new Password(el);
      const input = el.querySelector('input') as HTMLInputElement;
      comp.setVisible(false);
      expect(input.type).toBe('password');
    });
  });

  describe('setValue / getValue', () => {
    it('should set and get the value', () => {
      const comp = new Password(el);
      comp.setValue('mypassword');
      expect(comp.getValue()).toBe('mypassword');
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('mypassword');
    });

    it('should clear the value', () => {
      const comp = new Password(el, { value: 'abc' });
      comp.clear();
      expect(comp.getValue()).toBe('');
    });
  });

  describe('events', () => {
    it('should fire onChange on real input events', () => {
      const onChange = vi.fn();
      new Password(el, { onChange });
      const input = el.querySelector('input') as HTMLInputElement;
      input.value = 'typed-value';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe('typed-value');
    });

    it('should fire onFocus/onBlur handlers', () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      new Password(el, { onFocus, onBlur });
      const input = el.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new FocusEvent('focus'));
      expect(onFocus).toHaveBeenCalledTimes(1);
      input.dispatchEvent(new FocusEvent('blur'));
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should fire onChange when setValue is called programmatically', () => {
      const onChange = vi.fn();
      const comp = new Password(el, { onChange });
      comp.setValue('new-secret');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe('new-secret');
    });
  });

  describe('disabled state', () => {
    it('should set disabled state via setDisabled', () => {
      const comp = new Password(el);
      const input = el.querySelector('input') as HTMLInputElement;
      comp.setDisabled(true);
      expect(comp.isDisabled()).toBe(true);
      expect(input.disabled).toBe(true);
      expect(el.className).toContain('ag-input--disabled');
    });

    it('should unset disabled state', () => {
      const comp = new Password(el, { disabled: true });
      const input = el.querySelector('input') as HTMLInputElement;
      comp.setDisabled(false);
      expect(comp.isDisabled()).toBe(false);
      expect(input.disabled).toBe(false);
      expect(el.className).not.toContain('ag-input--disabled');
    });
  });

  describe('other setters/getters', () => {
    it('should update placeholder', () => {
      const comp = new Password(el);
      comp.setPlaceholder('New placeholder');
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('New placeholder');
    });

    it('should set readonly', () => {
      const comp = new Password(el);
      comp.setReadonly(true);
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).toBe(true);
    });

    it('should set and clear error', () => {
      const comp = new Password(el);
      comp.setError('Weak password');
      expect(comp.getError()).toBe('Weak password');
      expect(el.className).toContain('ag-input--error');
      comp.setError(null);
      expect(comp.getError()).toBeUndefined();
      expect(el.className).not.toContain('ag-input--error');
    });

    it('should set size', () => {
      const comp = new Password(el);
      comp.setSize('lg');
      expect(comp.getSize()).toBe('lg');
      expect(el.className).toContain('ag-input--lg');
    });

    it('should focus and blur the input', () => {
      const comp = new Password(el);
      const input = el.querySelector('input') as HTMLInputElement;
      comp.focus();
      expect(document.activeElement).toBe(input);
      comp.blur();
      expect(document.activeElement).not.toBe(input);
    });
  });

  describe('destroy', () => {
    it('should remove the input, toggle button, and root element from the DOM', () => {
      const comp = new Password(el);
      comp.destroy();
      expect(container.contains(el)).toBe(false);
    });

    it('should stop firing onChange after destroy', () => {
      const onChange = vi.fn();
      const comp = new Password(el, { onChange });
      const input = el.querySelector('input') as HTMLInputElement;
      comp.destroy();

      input.value = 'ignored';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('createPassword', () => {
    it('should create a new password field from scratch', () => {
      const comp = createPassword({ value: 'abc123' });
      const element = comp.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.getAttribute('role')).toBe('group');
      expect(comp.getValue()).toBe('abc123');
    });

    it('should toggle visibility on the created toggle button', () => {
      const comp = createPassword();
      const input = comp.getElement().querySelector('input') as HTMLInputElement;
      const toggle = comp.getElement().querySelector('.ag-password-toggle') as HTMLButtonElement;
      toggle.click();
      expect(input.type).toBe('text');
    });
  });
});
