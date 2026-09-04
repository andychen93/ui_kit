import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Textarea, createTextarea } from '../src/components/textarea';

describe('Textarea Component', () => {
  let container: HTMLDivElement;
  let el: HTMLTextAreaElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    el = document.createElement('textarea');
    container.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const comp = new Textarea(el);
      expect(comp.getElement()).toBe(el);
    });

    it('should initialize with selector', () => {
      el.id = 'test-textarea';
      const comp = new Textarea('#test-textarea');
      expect(comp.getElement()).toBe(el);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Textarea('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should reflect the initial value', () => {
      new Textarea(el, { value: 'hello world' });
      expect(el.value).toBe('hello world');
    });

    it('should reflect placeholder', () => {
      new Textarea(el, { placeholder: 'Type here' });
      expect(el.placeholder).toBe('Type here');
    });

    it('should reflect rows attribute, defaulting to 3', () => {
      new Textarea(el);
      expect(el.getAttribute('rows')).toBe('3');
      const container2 = document.createElement('textarea');
      new Textarea(container2, { rows: 6 });
      expect(container2.getAttribute('rows')).toBe('6');
    });

    it('should reflect maxLength/minLength attributes', () => {
      new Textarea(el, { maxLength: 100, minLength: 5 });
      expect(el.getAttribute('maxlength')).toBe('100');
      expect(el.getAttribute('minlength')).toBe('5');
    });

    it('should reflect disabled state', () => {
      new Textarea(el, { disabled: true });
      expect(el.disabled).toBe(true);
      expect(el.className).toContain('ag-textarea--disabled');
    });

    it('should reflect error state', () => {
      new Textarea(el, { error: 'Required' });
      expect(el.className).toContain('ag-textarea--error');
    });

    it('should reflect size class', () => {
      new Textarea(el, { size: 'sm' });
      expect(el.className).toContain('ag-textarea--sm');
    });

    it('should reflect readonly and required attributes', () => {
      new Textarea(el, { readonly: true, required: true });
      expect(el.readOnly).toBe(true);
      expect(el.required).toBe(true);
    });
  });

  describe('setValue / getValue', () => {
    it('should set and get the value', () => {
      const comp = new Textarea(el);
      comp.setValue('new content');
      expect(comp.getValue()).toBe('new content');
      expect(el.value).toBe('new content');
    });

    it('should clear the value', () => {
      const comp = new Textarea(el, { value: 'to be cleared' });
      comp.clear();
      expect(comp.getValue()).toBe('');
    });
  });

  describe('events', () => {
    it('should fire onChange on real input events', () => {
      const onChange = vi.fn();
      new Textarea(el, { onChange });
      el.value = 'typed text';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe('typed text');
    });

    it('should fire onChange when setValue is called programmatically', () => {
      const onChange = vi.fn();
      const comp = new Textarea(el, { onChange });
      comp.setValue('programmatic');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe('programmatic');
    });

    it('should fire onFocus/onBlur handlers', () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      new Textarea(el, { onFocus, onBlur });
      el.dispatchEvent(new FocusEvent('focus'));
      expect(onFocus).toHaveBeenCalledTimes(1);
      el.dispatchEvent(new FocusEvent('blur'));
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('autoSize', () => {
    it('should mark the dataset with autoSize=true when enabled as boolean', () => {
      new Textarea(el, { autoSize: true });
      expect(el.dataset.autoSize).toBe('true');
    });

    it('should store minRows/maxRows in dataset when autoSize is an object', () => {
      new Textarea(el, { autoSize: { minRows: 2, maxRows: 5 } });
      expect(el.dataset.minRows).toBe('2');
      expect(el.dataset.maxRows).toBe('5');
    });

    it('should adjust the element height on setValue when autoSize is true', () => {
      const comp = new Textarea(el, { autoSize: true });
      comp.setValue('some text');
      // jsdom reports scrollHeight as 0, so height resolves to minRows(1) * 20px
      expect(el.style.height).toBe('20px');
    });

    it('should respect minRows when computing the auto-sized height', () => {
      const comp = new Textarea(el, { autoSize: { minRows: 2, maxRows: 5 } });
      comp.setValue('some text');
      expect(el.style.height).toBe('40px');
    });

    it('should adjust height on real input events when autoSize is enabled', () => {
      new Textarea(el, { autoSize: true });
      el.value = 'abc';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      expect(el.style.height).toBe('20px');
    });

    it('should not set a height style when autoSize is not enabled', () => {
      const comp = new Textarea(el);
      comp.setValue('plain text');
      expect(el.style.height).toBe('');
    });
  });

  describe('disabled state', () => {
    it('should set disabled state via setDisabled', () => {
      const comp = new Textarea(el);
      comp.setDisabled(true);
      expect(comp.isDisabled()).toBe(true);
      expect(el.disabled).toBe(true);
      expect(el.className).toContain('ag-textarea--disabled');
    });

    it('should unset disabled state', () => {
      const comp = new Textarea(el, { disabled: true });
      comp.setDisabled(false);
      expect(comp.isDisabled()).toBe(false);
      expect(el.disabled).toBe(false);
      expect(el.className).not.toContain('ag-textarea--disabled');
    });
  });

  describe('other setters/getters', () => {
    it('should update placeholder', () => {
      const comp = new Textarea(el);
      comp.setPlaceholder('Updated');
      expect(el.placeholder).toBe('Updated');
    });

    it('should set readonly', () => {
      const comp = new Textarea(el);
      comp.setReadonly(true);
      expect(el.readOnly).toBe(true);
    });

    it('should set and clear error', () => {
      const comp = new Textarea(el);
      comp.setError('Bad input');
      expect(comp.getError()).toBe('Bad input');
      expect(el.className).toContain('ag-textarea--error');
      comp.setError(null);
      expect(comp.getError()).toBeUndefined();
      expect(el.className).not.toContain('ag-textarea--error');
    });

    it('should set size', () => {
      const comp = new Textarea(el);
      comp.setSize('lg');
      expect(comp.getSize()).toBe('lg');
      expect(el.className).toContain('ag-textarea--lg');
    });

    it('should focus and blur the element', () => {
      const comp = new Textarea(el);
      comp.focus();
      expect(document.activeElement).toBe(el);
      comp.blur();
      expect(document.activeElement).not.toBe(el);
    });

    it('should validate required content', () => {
      const comp = new Textarea(el, { required: true });
      el.value = '';
      expect(comp.validate()).toBe(false);
      el.value = 'filled';
      expect(comp.validate()).toBe(true);
    });
  });

  describe('destroy', () => {
    it('should stop firing onChange after destroy without removing the element', () => {
      const onChange = vi.fn();
      const comp = new Textarea(el, { onChange });
      comp.destroy();

      expect(container.contains(el)).toBe(true);

      el.value = 'ignored';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('createTextarea', () => {
    it('should create a new textarea from scratch', () => {
      const comp = createTextarea({ value: 'from factory', placeholder: 'Type' });
      const element = comp.getElement();
      expect(element.tagName).toBe('TEXTAREA');
      expect(element.value).toBe('from factory');
      expect(element.placeholder).toBe('Type');
      expect(element.className).toContain('ag-textarea');
    });
  });
});
