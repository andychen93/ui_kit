import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StatusSwitch, createStatusSwitch } from '../src/components/status-switch';

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('StatusSwitch Component', () => {
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

  function getButton(sw: StatusSwitch): HTMLElement {
    return sw.getElement().querySelector('.ag-status-switch-button') as HTMLElement;
  }

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const sw = new StatusSwitch(rootEl);
      expect(sw.getElement()).toBe(rootEl);
    });

    it('should initialize with selector string', () => {
      rootEl.id = 'test-status-switch';
      const sw = new StatusSwitch('#test-status-switch');
      expect(sw.getElement()).toBe(rootEl);
    });

    it('should throw for a selector that does not exist', () => {
      expect(() => new StatusSwitch('#missing-status-switch')).toThrow(
        'Element not found for selector: #missing-status-switch'
      );
    });
  });

  describe('initial render', () => {
    it('should build a hidden input and switch button reflecting checked=false by default', () => {
      const sw = new StatusSwitch(rootEl);
      const input = rootEl.querySelector('.ag-status-switch-input') as HTMLInputElement;
      const button = getButton(sw);

      expect(input.value).toBe('false');
      expect(button.getAttribute('role')).toBe('switch');
      expect(button.getAttribute('aria-checked')).toBe('false');
      expect(rootEl.className).toContain('ag-status-switch');
      expect(rootEl.className).toContain('ag-status-switch--md');
    });

    it('should reflect checked: true in aria-checked, input value and class', () => {
      const sw = new StatusSwitch(rootEl, { checked: true });
      const input = rootEl.querySelector('.ag-status-switch-input') as HTMLInputElement;
      expect(sw.getValue()).toBe(true);
      expect(input.value).toBe('true');
      expect(getButton(sw).getAttribute('aria-checked')).toBe('true');
    });

    it('should render a status-specific knob class when status is provided', () => {
      const sw = new StatusSwitch(rootEl, { status: 'warning' });
      const knob = rootEl.querySelector('.ag-status-switch-knob');
      expect(knob?.className).toContain('ag-status-switch-knob--warning');
    });

    it('should render a plain knob class when no status is provided', () => {
      const sw = new StatusSwitch(rootEl);
      const knob = rootEl.querySelector('.ag-status-switch-knob');
      expect(knob?.className).toBe('ag-status-switch-knob');
    });
  });

  describe('setValue (bypasses confirm/onChange)', () => {
    it('should directly set the value without invoking confirm or onChange', async () => {
      const confirm = vi.fn().mockReturnValue(true);
      const onChange = vi.fn();
      const sw = new StatusSwitch(rootEl, { confirm, onChange });

      sw.setValue(true);

      expect(sw.getValue()).toBe(true);
      expect(confirm).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      const input = rootEl.querySelector('.ag-status-switch-input') as HTMLInputElement;
      expect(input.value).toBe('true');
      expect(getButton(sw).getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('requestToggle with confirm', () => {
    it('should allow the toggle when confirm returns true', async () => {
      const confirm = vi.fn().mockReturnValue(true);
      const sw = new StatusSwitch(rootEl, { confirm });

      await sw.requestToggle();

      expect(confirm).toHaveBeenCalledWith(true);
      expect(sw.getValue()).toBe(true);
    });

    it('should allow the toggle when confirm resolves true asynchronously', async () => {
      const confirm = vi.fn().mockResolvedValue(true);
      const sw = new StatusSwitch(rootEl, { confirm });

      await sw.requestToggle();

      expect(sw.getValue()).toBe(true);
    });

    it('should abort the toggle when confirm returns false, leaving value unchanged', async () => {
      const confirm = vi.fn().mockReturnValue(false);
      const sw = new StatusSwitch(rootEl, { confirm, checked: false });

      await sw.requestToggle();

      expect(sw.getValue()).toBe(false);
      const input = rootEl.querySelector('.ag-status-switch-input') as HTMLInputElement;
      expect(input.value).toBe('false');
    });

    it('should abort the toggle when confirm resolves false asynchronously', async () => {
      const confirm = vi.fn().mockResolvedValue(false);
      const sw = new StatusSwitch(rootEl, { confirm, checked: true });

      await sw.requestToggle();

      expect(sw.getValue()).toBe(true); // unchanged
    });
  });

  describe('requestToggle with async onChange - success', () => {
    it('should set pending true while onChange resolves and false afterwards, keeping the new value', async () => {
      let resolveFn: () => void;
      const onChange = vi.fn(() => new Promise<void>((resolve) => {
        resolveFn = resolve;
      }));
      const sw = new StatusSwitch(rootEl, { onChange });

      const promise = sw.requestToggle();
      await flush();

      // Value already applied optimistically, pending is true while awaiting.
      expect(sw.getValue()).toBe(true);
      expect(sw.isPending()).toBe(true);
      expect(sw.getElement().classList.contains('ag-status-switch--pending')).toBe(true);

      resolveFn!();
      await promise;

      expect(sw.isPending()).toBe(false);
      expect(sw.getValue()).toBe(true);
      expect(sw.getElement().classList.contains('ag-status-switch--pending')).toBe(false);
    });

    it('should clear any previous error as soon as a new toggle attempt begins', async () => {
      const onChange = vi.fn().mockRejectedValueOnce(new Error('first fail')).mockResolvedValueOnce(undefined);
      const sw = new StatusSwitch(rootEl, { onChange });

      await sw.requestToggle();
      expect(sw.getError()).toBe('first fail');

      await sw.requestToggle();
      expect(sw.getError()).toBeNull();
    });
  });

  describe('requestToggle with async onChange - failure', () => {
    it('should roll back to the previous value when the returned promise rejects', async () => {
      const onChange = vi.fn().mockRejectedValue(new Error('network error'));
      const sw = new StatusSwitch(rootEl, { checked: false, onChange });

      await sw.requestToggle();

      expect(sw.getValue()).toBe(false); // rolled back to previous value
      expect(sw.getError()).toBe('network error');
      expect(sw.isPending()).toBe(false);
    });

    it('should set status to error on rollback', async () => {
      const onChange = vi.fn().mockRejectedValue(new Error('boom'));
      const sw = new StatusSwitch(rootEl, { onChange });

      await sw.requestToggle();

      const knob = sw.getElement().querySelector('.ag-status-switch-knob');
      expect(knob?.className).toContain('ag-status-switch-knob--error');
    });

    it('should roll back when the onChange function throws synchronously', async () => {
      const onChange = vi.fn(() => {
        throw new Error('sync failure');
      });
      const sw = new StatusSwitch(rootEl, { checked: true, onChange });

      await sw.requestToggle();

      expect(sw.getValue()).toBe(true); // rolled back to previous value (true)
      expect(sw.getError()).toBe('sync failure');
      expect(sw.isPending()).toBe(false);
    });

    it('should stringify non-Error rejection reasons for getError', async () => {
      const onChange = vi.fn().mockRejectedValue('plain string reason');
      const sw = new StatusSwitch(rootEl, { onChange });

      await sw.requestToggle();

      expect(sw.getError()).toBe('plain string reason');
    });
  });

  describe('requestToggle with sync (non-promise) onChange', () => {
    it('should apply the new value and never enter pending state', async () => {
      const onChange = vi.fn();
      const sw = new StatusSwitch(rootEl, { onChange });

      await sw.requestToggle();

      expect(sw.getValue()).toBe(true);
      expect(sw.isPending()).toBe(false);
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('disabled blocks interaction', () => {
    it('should make requestToggle a no-op when disabled', async () => {
      const onChange = vi.fn();
      const sw = new StatusSwitch(rootEl, { disabled: true, onChange });

      await sw.requestToggle();

      expect(sw.getValue()).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should ignore clicks on the switch button when disabled', async () => {
      const onChange = vi.fn();
      const sw = new StatusSwitch(rootEl, { disabled: true, onChange });

      getButton(sw).click();
      await flush();

      expect(sw.getValue()).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should ignore clicks while pending', async () => {
      let resolveFn: () => void;
      const onChange = vi.fn(() => new Promise<void>((resolve) => {
        resolveFn = resolve;
      }));
      const sw = new StatusSwitch(rootEl, { onChange });

      getButton(sw).click();
      await flush();
      expect(sw.isPending()).toBe(true);

      // Second click while pending should be ignored
      getButton(sw).click();
      await flush();
      expect(onChange).toHaveBeenCalledTimes(1);

      resolveFn!();
      await flush();
    });
  });

  describe('setStatus / setDisabled / setSize', () => {
    it('should update the knob status class via setStatus', () => {
      const sw = new StatusSwitch(rootEl);
      sw.setStatus('success');
      const knob = rootEl.querySelector('.ag-status-switch-knob');
      expect(knob?.className).toContain('ag-status-switch-knob--success');
    });

    it('should update disabled state and class via setDisabled', () => {
      const sw = new StatusSwitch(rootEl);
      expect(sw.isDisabled()).toBe(false);
      sw.setDisabled(true);
      expect(sw.isDisabled()).toBe(true);
      expect(rootEl.className).toContain('ag-status-switch--disabled');
    });

    it('should update size via setSize/getSize and reflect it in classes', () => {
      const sw = new StatusSwitch(rootEl);
      expect(sw.getSize()).toBe('md');
      sw.setSize('lg');
      expect(sw.getSize()).toBe('lg');
      expect(rootEl.className).toContain('ag-status-switch--lg');
      expect(rootEl.className).not.toContain('ag-status-switch--md');
    });
  });

  describe('destroy', () => {
    it('should remove the input, switch button, and root element', () => {
      const sw = new StatusSwitch(rootEl);
      expect(container.contains(rootEl)).toBe(true);

      sw.destroy();

      expect(container.contains(rootEl)).toBe(false);
      expect(rootEl.querySelector('.ag-status-switch-input')).toBeNull();
      expect(rootEl.querySelector('.ag-status-switch-button')).toBeNull();
    });

    it('should stop firing onChange after destroy', async () => {
      const onChange = vi.fn();
      const sw = new StatusSwitch(rootEl, { onChange });
      const button = getButton(sw);
      // Keep the button reachable in the DOM after destroy removes rootEl
      document.body.appendChild(button);

      sw.destroy();
      button.click();
      await flush();

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('createStatusSwitch', () => {
    it('should create a status-switch element from scratch reflecting options', () => {
      const sw = createStatusSwitch({ checked: true, size: 'sm', status: 'processing' });
      expect(sw.getElement().className).toContain('ag-status-switch');
      expect(sw.getElement().className).toContain('ag-status-switch--sm');
      expect(sw.getValue()).toBe(true);
      const knob = sw.getElement().querySelector('.ag-status-switch-knob');
      expect(knob?.className).toContain('ag-status-switch-knob--processing');
    });
  });
});
