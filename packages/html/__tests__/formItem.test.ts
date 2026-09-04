import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FormItem, createFormItem } from '../src/components/form-item';
import { Form } from '../src/components/form';

describe('FormItem Component', () => {
  let container: HTMLDivElement;
  let itemEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    itemEl = document.createElement('div');
    container.appendChild(itemEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const item = new FormItem(itemEl);
      expect(item.getElement()).toBe(itemEl);
    });

    it('should initialize with selector', () => {
      itemEl.id = 'test-item';
      const item = new FormItem('#test-item');
      expect(item.getElement()).toBe(itemEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new FormItem('#non-existent')).toThrow();
    });
  });

  describe('label', () => {
    it('should render label when provided', () => {
      const item = new FormItem(itemEl, { label: 'Username' });
      const label = itemEl.querySelector('.ag-form-item__label');
      expect(label?.textContent).toBe('Username');
    });

    it('should not render label when omitted', () => {
      const item = new FormItem(itemEl);
      expect(itemEl.querySelector('.ag-form-item__label')).toBeNull();
    });

    it('should update label via setLabel, creating it if missing', () => {
      const item = new FormItem(itemEl);
      item.setLabel('Email');
      expect(itemEl.querySelector('.ag-form-item__label')?.textContent).toBe('Email');
    });
  });

  describe('required', () => {
    it('should apply required class', () => {
      const item = new FormItem(itemEl, { required: true });
      expect(itemEl.className).toContain('ag-form-item--required');
    });

    it('should toggle required via setRequired', () => {
      const item = new FormItem(itemEl);
      expect(itemEl.className).not.toContain('ag-form-item--required');
      item.setRequired(true);
      expect(itemEl.className).toContain('ag-form-item--required');
    });
  });

  describe('control container', () => {
    it('should expose a control container element', () => {
      const item = new FormItem(itemEl);
      const control = item.getControlElement();
      expect(control.className).toContain('ag-form-item__control');
      expect(itemEl.contains(control)).toBe(true);
    });

    it('should append controls into the control container', () => {
      const item = new FormItem(itemEl);
      const input = document.createElement('input');
      item.appendControl(input);
      expect(item.getControlElement().contains(input)).toBe(true);
    });
  });

  describe('static error / help', () => {
    it('should render a static error message', () => {
      const item = new FormItem(itemEl, { error: 'Required field' });
      expect(itemEl.className).toContain('ag-form-item--error');
      const errorEl = itemEl.querySelector('.ag-form-item__error');
      expect(errorEl?.textContent).toBe('Required field');
    });

    it('should render help text when there is no error', () => {
      const item = new FormItem(itemEl, { help: 'Enter your name' });
      const hint = itemEl.querySelector('.ag-form-item__hint');
      expect(hint?.textContent).toBe('Enter your name');
    });

    it('should prefer error over help', () => {
      const item = new FormItem(itemEl, { error: 'Bad value', help: 'Some hint' });
      expect(itemEl.querySelector('.ag-form-item__error')?.textContent).toBe('Bad value');
    });

    it('should support description as an alias for help', () => {
      const item = new FormItem(itemEl, { description: 'Alias hint' });
      expect(itemEl.querySelector('.ag-form-item__hint')?.textContent).toBe('Alias hint');
    });

    it('should update error via setError', () => {
      const item = new FormItem(itemEl);
      item.setError('Oops');
      expect(item.getError()).toBe('Oops');
      expect(itemEl.querySelector('.ag-form-item__error')?.textContent).toBe('Oops');

      item.setError(null);
      expect(item.getError()).toBeNull();
      const errorAfterClear = itemEl.querySelector('.ag-form-item__error') as HTMLElement | null;
      expect(errorAfterClear === null || errorAfterClear.style.display === 'none').toBe(true);
    });
  });

  describe('Form integration', () => {
    let form: Form;
    let formEl: HTMLFormElement;
    let input: HTMLInputElement;

    beforeEach(() => {
      formEl = document.createElement('form');
      container.appendChild(formEl);
      input = document.createElement('input');
      input.name = 'username';
      formEl.appendChild(input);
      form = new Form(formEl);
    });

    it('should register the field with the form using required option', () => {
      const registerSpy = vi.spyOn(form, 'registerField');
      new FormItem(itemEl, { form, name: 'username', required: true });
      expect(registerSpy).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'username', required: true })
      );
    });

    it('should reflect form validation errors automatically', () => {
      const item = new FormItem(itemEl, { form, name: 'username', required: true });

      expect(form.validate()).toBe(false);
      expect(item.getError()).toContain('required');
      expect(itemEl.className).toContain('ag-form-item--error');

      input.value = 'john';
      expect(form.validate()).toBe(true);
      expect(item.getError()).toBeNull();
      expect(itemEl.className).not.toContain('ag-form-item--error');
    });

    it('should stop reflecting form errors after destroy', () => {
      const item = new FormItem(itemEl, { form, name: 'username', required: true });
      form.validate();
      expect(item.getError()).toContain('required');

      item.destroy();
      // Field removed from form; subsequent validate() should not resurrect
      // the error through this (destroyed) FormItem.
      form.setError('username', 'manually set after destroy');
      expect(item.getError()).toContain('required'); // unchanged, no longer subscribed
    });

    it('should unregister the field from the form on destroy', () => {
      const item = new FormItem(itemEl, { form, name: 'username', required: true });
      item.destroy();
      expect(form.getError('username')).toBeUndefined();
      // Field no longer required after unregister: validate() should pass
      // even with an empty value.
      input.value = '';
      expect(form.validate()).toBe(true);
    });
  });

  describe('createFormItem', () => {
    it('should create a new form item element', () => {
      const item = createFormItem({ label: 'Name' });
      expect(item.getElement()).toBeInstanceOf(HTMLDivElement);
      expect(item.getElement().className).toContain('ag-form-item');
      expect(item.getElement().querySelector('.ag-form-item__label')?.textContent).toBe('Name');
    });
  });

  describe('destroy', () => {
    it('should not throw when destroy is called without a bound form', () => {
      const item = new FormItem(itemEl, { label: 'X' });
      expect(() => item.destroy()).not.toThrow();
    });
  });
});
