import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Switch, createSwitch } from '../src/components/switch';

describe('Switch Component', () => {
  let container: HTMLDivElement;
  let rootEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    rootEl = document.createElement('div');
    container.appendChild(rootEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function getButton(sw: Switch): HTMLElement {
    return sw.getElement().querySelector('.ag-switch-button') as HTMLElement;
  }

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const sw = new Switch(rootEl);
      expect(sw.getElement()).toBe(rootEl);
    });

    it('should initialize with selector string', () => {
      rootEl.id = 'test-switch';
      const sw = new Switch('#test-switch');
      expect(sw.getElement()).toBe(rootEl);
    });

    it('should throw for a selector that does not exist', () => {
      expect(() => new Switch('#missing-switch')).toThrow(
        'Element not found for selector: #missing-switch'
      );
    });
  });

  describe('initial render', () => {
    it('should build a hidden input and a switch button reflecting checked=false by default', () => {
      const sw = new Switch(rootEl);
      const input = rootEl.querySelector('.ag-switch-input') as HTMLInputElement;
      const button = getButton(sw);

      expect(input.value).toBe('false');
      expect(button.getAttribute('role')).toBe('switch');
      expect(button.getAttribute('aria-checked')).toBe('false');
      expect(button.classList.contains('ag-switch-button--checked')).toBe(false);
      expect(rootEl.className).toContain('ag-switch');
      expect(rootEl.className).toContain('ag-switch--md');
    });

    it('should reflect checked: true in aria-checked, input value and class', () => {
      const sw = new Switch(rootEl, { checked: true });
      const input = rootEl.querySelector('.ag-switch-input') as HTMLInputElement;
      const button = getButton(sw);

      expect(sw.getValue()).toBe(true);
      expect(input.value).toBe('true');
      expect(button.getAttribute('aria-checked')).toBe('true');
      expect(button.classList.contains('ag-switch-button--checked')).toBe(true);
    });

    it('should reflect size/disabled/loading options in classes', () => {
      const sw = new Switch(rootEl, { size: 'lg', disabled: true, loading: true });
      expect(rootEl.className).toContain('ag-switch--lg');
      expect(rootEl.className).toContain('ag-switch--disabled');
      expect(rootEl.className).toContain('ag-switch--loading');
    });
  });

  describe('toggle', () => {
    it('should flip the value from false to true', () => {
      const sw = new Switch(rootEl);
      sw.toggle();
      expect(sw.getValue()).toBe(true);
      expect(getButton(sw).getAttribute('aria-checked')).toBe('true');
    });

    it('should flip the value from true to false', () => {
      const sw = new Switch(rootEl, { checked: true });
      sw.toggle();
      expect(sw.getValue()).toBe(false);
    });

    it('should do nothing when disabled', () => {
      const sw = new Switch(rootEl, { disabled: true });
      sw.toggle();
      expect(sw.getValue()).toBe(false);
    });

    it('should do nothing when loading', () => {
      const sw = new Switch(rootEl, { loading: true });
      sw.toggle();
      expect(sw.getValue()).toBe(false);
    });
  });

  describe('setValue', () => {
    it('should set checked state, updating input, aria attribute and class', () => {
      const sw = new Switch(rootEl);
      sw.setValue(true);
      const input = rootEl.querySelector('.ag-switch-input') as HTMLInputElement;
      expect(sw.getValue()).toBe(true);
      expect(input.value).toBe('true');
      expect(getButton(sw).getAttribute('aria-checked')).toBe('true');
      expect(getButton(sw).classList.contains('ag-switch-button--checked')).toBe(true);
    });

    it('should be a no-op when disabled', () => {
      const sw = new Switch(rootEl, { disabled: true });
      sw.setValue(true);
      expect(sw.getValue()).toBe(false);
    });

    it('should be a no-op when loading', () => {
      const sw = new Switch(rootEl, { loading: true });
      sw.setValue(true);
      expect(sw.getValue()).toBe(false);
    });
  });

  describe('onChange callback', () => {
    it('should call onChange with (checked, event) when toggled via setValue', () => {
      const onChange = vi.fn();
      const sw = new Switch(rootEl, { onChange });
      sw.setValue(true);

      expect(onChange).toHaveBeenCalledTimes(1);
      const [value, event] = onChange.mock.calls[0];
      expect(value).toBe(true);
      expect(event).toBeInstanceOf(Event);
      expect(event.type).toBe('change');
    });

    it('should call onChange when toggled via click on the switch button', () => {
      const onChange = vi.fn();
      const sw = new Switch(rootEl, { onChange });
      getButton(sw).click();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe(true);
    });

    it('should not call onChange when disabled and clicked', () => {
      const onChange = vi.fn();
      const sw = new Switch(rootEl, { disabled: true, onChange });
      getButton(sw).click();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when loading and clicked', () => {
      const onChange = vi.fn();
      const sw = new Switch(rootEl, { loading: true, onChange });
      getButton(sw).click();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should dispatch a native "change" event on the hidden input', () => {
      const handler = vi.fn();
      const sw = new Switch(rootEl);
      const input = rootEl.querySelector('.ag-switch-input') as HTMLInputElement;
      input.addEventListener('change', handler);
      sw.toggle();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('setDisabled / isDisabled', () => {
    it('should update disabled state and class', () => {
      const sw = new Switch(rootEl);
      expect(sw.isDisabled()).toBe(false);
      sw.setDisabled(true);
      expect(sw.isDisabled()).toBe(true);
      expect(rootEl.className).toContain('ag-switch--disabled');
    });

    it('should block subsequent toggles once disabled', () => {
      const sw = new Switch(rootEl);
      sw.setDisabled(true);
      sw.toggle();
      expect(sw.getValue()).toBe(false);
    });
  });

  describe('setLoading / isLoading', () => {
    it('should update loading state and class', () => {
      const sw = new Switch(rootEl);
      expect(sw.isLoading()).toBe(false);
      sw.setLoading(true);
      expect(sw.isLoading()).toBe(true);
      expect(rootEl.className).toContain('ag-switch--loading');
    });
  });

  describe('setSize / getSize', () => {
    it('should update size and reflect it in classes', () => {
      const sw = new Switch(rootEl);
      expect(sw.getSize()).toBe('md');
      sw.setSize('sm');
      expect(sw.getSize()).toBe('sm');
      expect(rootEl.className).toContain('ag-switch--sm');
      expect(rootEl.className).not.toContain('ag-switch--md');
    });
  });

  describe('destroy', () => {
    it('should remove the input and switch button elements', () => {
      const sw = new Switch(rootEl);
      const input = rootEl.querySelector('.ag-switch-input');
      const button = rootEl.querySelector('.ag-switch-button');
      expect(input).not.toBeNull();
      expect(button).not.toBeNull();

      sw.destroy();

      expect(rootEl.querySelector('.ag-switch-input')).toBeNull();
      expect(rootEl.querySelector('.ag-switch-button')).toBeNull();
    });

    it('should stop firing onChange after destroy even if the button element still exists elsewhere', () => {
      const onChange = vi.fn();
      const sw = new Switch(rootEl, { onChange });
      const button = getButton(sw);
      // Detach it from the removed root and re-append so click events can still be dispatched
      document.body.appendChild(button);

      sw.destroy();
      button.click();

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('createSwitch', () => {
    it('should create a switch element from scratch with role=group and reflect options', () => {
      const sw = createSwitch({ checked: true, size: 'sm' });
      expect(sw.getElement().getAttribute('role')).toBe('group');
      expect(sw.getElement().className).toContain('ag-switch--sm');
      expect(sw.getValue()).toBe(true);
    });
  });
});
