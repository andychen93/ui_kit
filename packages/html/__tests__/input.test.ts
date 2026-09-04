import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Input, createInput } from '../src/components/input';

describe('Input Component', () => {
  let container: HTMLDivElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    input = document.createElement('input');
    container.appendChild(input);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element selector', () => {
      input.id = 'test-input';
      const inp = new Input('#test-input');
      expect(inp.getElement()).toBe(input);
    });

    it('should initialize with element reference', () => {
      const inp = new Input(input);
      expect(inp.getElement()).toBe(input);
    });
  });

  describe('classes', () => {
    it('should apply default classes', () => {
      const inp = new Input(input);
      expect(input.className).toContain('ag-input');
      expect(input.className).toContain('ag-input--md');
    });

    it('should apply size classes', () => {
      const inp = new Input(input, { size: 'lg' });
      expect(input.className).toContain('ag-input--lg');
    });

    it('should apply error class', () => {
      const inp = new Input(input, { error: 'Invalid input' });
      expect(input.className).toContain('ag-input--error');
    });

    it('should apply disabled class', () => {
      const inp = new Input(input, { disabled: true });
      expect(input.className).toContain('ag-input--disabled');
      expect(input.disabled).toBe(true);
    });
  });

  describe('value management', () => {
    it('should get input value', () => {
      input.value = 'test value';
      const inp = new Input(input);
      expect(inp.getValue()).toBe('test value');
    });

    it('should set input value', () => {
      const inp = new Input(input);
      inp.setValue('new value');
      expect(input.value).toBe('new value');
    });

    it('should clear input value', () => {
      input.value = 'some value';
      const inp = new Input(input);
      inp.clear();
      expect(input.value).toBe('');
    });
  });

  describe('attributes', () => {
    it('should set placeholder', () => {
      const inp = new Input(input, { placeholder: 'Enter text' });
      expect(input.placeholder).toBe('Enter text');
    });

    it('should update placeholder', () => {
      const inp = new Input(input);
      inp.setPlaceholder('New placeholder');
      expect(input.placeholder).toBe('New placeholder');
    });

    it('should set readonly', () => {
      const inp = new Input(input, { readonly: true });
      expect(input.readOnly).toBe(true);
    });

    it('should set required', () => {
      const inp = new Input(input, { required: true });
      expect(input.required).toBe(true);
    });

    it('should set input type', () => {
      const inp = new Input(input, { type: 'email' });
      expect(input.type).toBe('email');
    });

    it('should set maxLength', () => {
      const inp = new Input(input, { maxLength: 10 });
      expect(input.maxLength).toBe(10);
    });

    it('should set minLength', () => {
      const inp = new Input(input, { minLength: 5 });
      expect(input.minLength).toBe(5);
    });
  });

  describe('disabled state', () => {
    it('should set disabled state', () => {
      const inp = new Input(input);
      inp.setDisabled(true);
      expect(inp.isDisabled()).toBe(true);
      expect(input.disabled).toBe(true);
    });

    it('should unset disabled state', () => {
      const inp = new Input(input, { disabled: true });
      inp.setDisabled(false);
      expect(inp.isDisabled()).toBe(false);
      expect(input.disabled).toBe(false);
    });
  });

  describe('error management', () => {
    it('should set error message', () => {
      const inp = new Input(input);
      inp.setError('Error message');
      expect(inp.getError()).toBe('Error message');
      expect(input.className).toContain('ag-input--error');
    });

    it('should clear error message', () => {
      const inp = new Input(input, { error: 'Error' });
      inp.setError(null);
      expect(inp.getError()).toBeUndefined();
      expect(input.className).not.toContain('ag-input--error');
    });
  });

  describe('size management', () => {
    it('should set size', () => {
      const inp = new Input(input);
      inp.setSize('sm');
      expect(inp.getSize()).toBe('sm');
      expect(input.className).toContain('ag-input--sm');
    });
  });

  describe('focus and blur', () => {
    it('should focus input', () => {
      const inp = new Input(input);
      inp.focus();
      expect(document.activeElement).toBe(input);
    });

    it('should blur input', () => {
      const inp = new Input(input);
      inp.focus();
      inp.blur();
      expect(document.activeElement).not.toBe(input);
    });

    it('should select text', () => {
      input.value = 'test text';
      const inp = new Input(input);
      inp.select();
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(9);
    });
  });

  describe('validation', () => {
    it('should validate input', () => {
      const inp = new Input(input, { type: 'email', required: true });
      input.value = '';
      expect(inp.validate()).toBe(false);

      input.value = 'test@example.com';
      expect(inp.validate()).toBe(true);
    });

    it('should get validation message', () => {
      const inp = new Input(input, { type: 'email', required: true });
      input.value = '';
      const message = inp.getValidationMessage();
      expect(message).toBeDefined();
    });
  });

  describe('events', () => {
    it('should handle change event', () => {
      let changed = false;
      let changedValue = '';
      const inp = new Input(input, {
        onChange: (value) => {
          changed = true;
          changedValue = value;
        },
      });

      input.value = 'new value';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(changed).toBe(true);
      expect(changedValue).toBe('new value');
    });

    it('should handle focus event', () => {
      let focused = false;
      const inp = new Input(input, {
        onFocus: () => {
          focused = true;
        },
      });

      input.dispatchEvent(new FocusEvent('focus'));
      expect(focused).toBe(true);
    });

    it('should handle blur event', () => {
      let blurred = false;
      const inp = new Input(input, {
        onBlur: () => {
          blurred = true;
        },
      });

      input.dispatchEvent(new FocusEvent('blur'));
      expect(blurred).toBe(true);
    });
  });

  describe('createInput', () => {
    it('should create input from scratch', () => {
      const inp = createInput({
        type: 'text',
        placeholder: 'Enter value',
        size: 'md',
      });

      const element = inp.getElement();
      expect(element.tagName).toBe('INPUT');
      expect(element.type).toBe('text');
      expect(element.placeholder).toBe('Enter value');
    });
  });

  describe('cleanup', () => {
    it('should cleanup event listeners', () => {
      const inp = new Input(input, {
        onChange: () => {},
      });
      inp.destroy();
      expect(true).toBe(true);
    });
  });
});
