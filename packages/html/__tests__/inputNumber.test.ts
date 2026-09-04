import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputNumber, createInputNumber } from '../src/components/input-number';

describe('InputNumber Component', () => {
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
      const comp = new InputNumber(el);
      expect(comp.getElement()).toBe(el);
    });

    it('should initialize with selector', () => {
      el.id = 'test-input-number';
      const comp = new InputNumber('#test-input-number');
      expect(comp.getElement()).toBe(el);
    });

    it('should throw error if selector not found', () => {
      expect(() => new InputNumber('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });

    it('should build up input and increment/decrement buttons', () => {
      new InputNumber(el);
      expect(el.querySelector('input.ag-input')).not.toBeNull();
      expect(el.querySelector('.ag-input-number-btn-up')).not.toBeNull();
      expect(el.querySelector('.ag-input-number-btn-down')).not.toBeNull();
    });
  });

  describe('initial render', () => {
    it('should reflect the initial value formatted by precision', () => {
      new InputNumber(el, { value: 5 });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('5');
    });

    it('should apply precision when formatting the initial value', () => {
      new InputNumber(el, { value: 5.678, precision: 1 });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('5.7');
    });

    it('should reflect placeholder', () => {
      new InputNumber(el, { placeholder: 'Enter number' });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('Enter number');
    });

    it('should reflect min/max/step attributes', () => {
      new InputNumber(el, { min: 0, max: 10, step: 2 });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('min')).toBe('0');
      expect(input.getAttribute('max')).toBe('10');
      expect(input.getAttribute('step')).toBe('2');
    });

    it('should reflect disabled state on the input, buttons, and the root class', () => {
      new InputNumber(el, { disabled: true });
      const input = el.querySelector('input') as HTMLInputElement;
      const up = el.querySelector('.ag-input-number-btn-up') as HTMLButtonElement;
      const down = el.querySelector('.ag-input-number-btn-down') as HTMLButtonElement;
      expect(input.disabled).toBe(true);
      expect(up.disabled).toBe(true);
      expect(down.disabled).toBe(true);
      expect(el.className).toContain('ag-input-number--disabled');
    });

    it('should reflect error state via class', () => {
      new InputNumber(el, { error: 'Bad value' });
      expect(el.className).toContain('ag-input-number--error');
    });

    it('should reflect size class', () => {
      new InputNumber(el, { size: 'lg' });
      expect(el.className).toContain('ag-input-number--lg');
    });

    it('should reflect readonly and required attributes', () => {
      new InputNumber(el, { readonly: true, required: true });
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).toBe(true);
      expect(input.required).toBe(true);
    });
  });

  describe('increment / decrement', () => {
    it('should increment value by step', () => {
      const comp = new InputNumber(el, { value: 0, step: 2 });
      comp.increment();
      expect(comp.getValue()).toBe(2);
    });

    it('should decrement value by step', () => {
      const comp = new InputNumber(el, { value: 10, step: 3 });
      comp.decrement();
      expect(comp.getValue()).toBe(7);
    });

    it('should clamp increment to max', () => {
      const comp = new InputNumber(el, { min: 0, max: 10, step: 5, value: 8 });
      comp.increment();
      expect(comp.getValue()).toBe(10);
    });

    it('should clamp decrement to min and stay clamped on repeated calls', () => {
      const comp = new InputNumber(el, { min: 0, max: 10, step: 5, value: 2 });
      comp.decrement();
      expect(comp.getValue()).toBe(0);
      comp.decrement();
      expect(comp.getValue()).toBe(0);
    });

    it('should increment via clicking the increment button', () => {
      const comp = new InputNumber(el, { value: 0, step: 2 });
      const up = el.querySelector('.ag-input-number-btn-up') as HTMLButtonElement;
      up.click();
      expect(comp.getValue()).toBe(2);
    });

    it('should decrement via clicking the decrement button', () => {
      const comp = new InputNumber(el, { value: 10, step: 3 });
      const down = el.querySelector('.ag-input-number-btn-down') as HTMLButtonElement;
      down.click();
      expect(comp.getValue()).toBe(7);
    });

    it('should not increment or decrement when disabled', () => {
      const comp = new InputNumber(el, { value: 5, disabled: true });
      comp.increment();
      expect(comp.getValue()).toBe(5);
      comp.decrement();
      expect(comp.getValue()).toBe(5);
    });
  });

  describe('setDisabled', () => {
    it('should disable the increment/decrement buttons and block further changes', () => {
      const comp = new InputNumber(el, { value: 5 });
      const up = el.querySelector('.ag-input-number-btn-up') as HTMLButtonElement;
      const down = el.querySelector('.ag-input-number-btn-down') as HTMLButtonElement;

      comp.setDisabled(true);

      expect(up.disabled).toBe(true);
      expect(down.disabled).toBe(true);
      expect(comp.isDisabled()).toBe(true);
      expect(el.className).toContain('ag-input-number--disabled');

      comp.increment();
      expect(comp.getValue()).toBe(5);
    });

    it('should re-enable the buttons when set back to false', () => {
      const comp = new InputNumber(el, { value: 5, disabled: true });
      const up = el.querySelector('.ag-input-number-btn-up') as HTMLButtonElement;
      const down = el.querySelector('.ag-input-number-btn-down') as HTMLButtonElement;

      comp.setDisabled(false);

      expect(up.disabled).toBe(false);
      expect(down.disabled).toBe(false);
      expect(el.className).not.toContain('ag-input-number--disabled');

      comp.increment();
      expect(comp.getValue()).toBe(6);
    });
  });

  describe('setValue / getValue', () => {
    it('should set value from a number and clamp it', () => {
      const comp = new InputNumber(el, { min: 0, max: 10 });
      comp.setValue(25);
      expect(comp.getValue()).toBe(10);
    });

    it('should set value from a string', () => {
      const comp = new InputNumber(el);
      comp.setValue('4');
      expect(comp.getValue()).toBe(4);
    });

    it('should ignore invalid string values', () => {
      const comp = new InputNumber(el, { value: 3 });
      comp.setValue('not-a-number');
      expect(comp.getValue()).toBe(3);
    });

    it('should clear the value', () => {
      const comp = new InputNumber(el, { value: 3 });
      comp.clear();
      expect(comp.getValue()).toBe(0);
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  describe('events', () => {
    it('should fire onChange on real input events', () => {
      const onChange = vi.fn();
      new InputNumber(el, { onChange });
      const input = el.querySelector('input') as HTMLInputElement;
      input.value = '7';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe(7);
    });

    it('should fire onFocus/onBlur handlers', () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      new InputNumber(el, { onFocus, onBlur });
      const input = el.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new FocusEvent('focus'));
      expect(onFocus).toHaveBeenCalledTimes(1);
      input.dispatchEvent(new FocusEvent('blur'));
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should clamp and reformat the value on blur, triggering onChange', () => {
      const onChange = vi.fn();
      const comp = new InputNumber(el, { min: 0, max: 10, precision: 0, onChange, onBlur: () => {} });
      const input = el.querySelector('input') as HTMLInputElement;
      input.value = '15';
      input.dispatchEvent(new FocusEvent('blur'));
      expect(input.value).toBe('10');
      expect(comp.getValue()).toBe(10);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('other setters/getters', () => {
    it('should update placeholder', () => {
      const comp = new InputNumber(el);
      comp.setPlaceholder('Amount');
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('Amount');
    });

    it('should set and clear error', () => {
      const comp = new InputNumber(el);
      comp.setError('Invalid');
      expect(comp.getError()).toBe('Invalid');
      expect(el.className).toContain('ag-input-number--error');
      comp.setError(null);
      expect(comp.getError()).toBeUndefined();
      expect(el.className).not.toContain('ag-input-number--error');
    });

    it('should set size', () => {
      const comp = new InputNumber(el);
      comp.setSize('sm');
      expect(comp.getSize()).toBe('sm');
      expect(el.className).toContain('ag-input-number--sm');
    });

    it('should set readonly', () => {
      const comp = new InputNumber(el);
      comp.setReadonly(true);
      const input = el.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).toBe(true);
    });

    it('should focus and blur the input', () => {
      const comp = new InputNumber(el);
      const input = el.querySelector('input') as HTMLInputElement;
      comp.focus();
      expect(document.activeElement).toBe(input);
      comp.blur();
      expect(document.activeElement).not.toBe(input);
    });
  });

  describe('destroy', () => {
    it('should remove the input, buttons, and root element from the DOM', () => {
      const comp = new InputNumber(el);
      comp.destroy();
      expect(container.contains(el)).toBe(false);
    });

    it('should stop firing onChange after destroy', () => {
      const onChange = vi.fn();
      const comp = new InputNumber(el, { onChange });
      const input = el.querySelector('input') as HTMLInputElement;
      comp.destroy();

      input.value = '9';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('createInputNumber', () => {
    it('should create a new input number from scratch', () => {
      const comp = createInputNumber({ value: 3, step: 1 });
      const element = comp.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.getAttribute('role')).toBe('group');
      expect(comp.getValue()).toBe(3);
    });

    it('should support incrementing via the created buttons', () => {
      const comp = createInputNumber({ value: 0, step: 1 });
      const up = comp.getElement().querySelector('.ag-input-number-btn-up') as HTMLButtonElement;
      up.click();
      expect(comp.getValue()).toBe(1);
    });
  });
});
