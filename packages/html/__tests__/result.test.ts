import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Result, createResult } from '../src/components/result';

describe('Result Component', () => {
  let container: HTMLDivElement;
  let resultEl: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    resultEl = document.createElement('div');
    container.appendChild(resultEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const result = new Result(resultEl);
      expect(result.getElement()).toBe(resultEl);
    });

    it('should initialize with selector', () => {
      resultEl.id = 'test-result';
      const result = new Result('#test-result');
      expect(result.getElement()).toBe(resultEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Result('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should default to success icon when no icon option is given', () => {
      new Result(resultEl);
      const icon = resultEl.querySelector('.ag-result-icon');
      expect(icon?.innerHTML).toContain('<svg');
      // success icon path fragment
      expect(icon?.innerHTML).toContain('9 16.17L4.83 12');
    });

    it('should render error icon svg when icon is error', () => {
      new Result(resultEl, { icon: 'error' });
      const icon = resultEl.querySelector('.ag-result-icon');
      expect(icon?.innerHTML).toContain('<svg');
      expect(icon?.innerHTML).not.toContain('9 16.17L4.83 12');
    });

    it('should render custom icon html when icon is custom', () => {
      new Result(resultEl, { icon: 'custom', customIcon: '<span class="my-icon">X</span>' });
      const icon = resultEl.querySelector('.ag-result-icon');
      expect(icon?.querySelector('.my-icon')?.textContent).toBe('X');
    });

    it('should render title, description and extra when provided', () => {
      new Result(resultEl, { title: 'Success!', description: 'Operation complete', extra: 'Extra info' });
      expect(resultEl.querySelector('.ag-result-title')?.textContent).toBe('Success!');
      expect(resultEl.querySelector('.ag-result-description')?.textContent).toBe('Operation complete');
      expect(resultEl.querySelector('.ag-result-extra')?.textContent).toBe('Extra info');
    });

    it('should not render title/description/extra when omitted', () => {
      new Result(resultEl);
      expect(resultEl.querySelector('.ag-result-title')).toBeNull();
      expect(resultEl.querySelector('.ag-result-description')).toBeNull();
      expect(resultEl.querySelector('.ag-result-extra')).toBeNull();
    });
  });

  describe('setIcon', () => {
    it('should update the icon svg content', () => {
      const result = new Result(resultEl, { icon: 'success' });
      result.setIcon('warning');
      const icon = resultEl.querySelector('.ag-result-icon');
      expect(icon?.innerHTML).toContain('1 21h22L12 2 1 21z');
    });

    it('should restore the previously set custom icon when switching back to custom', () => {
      const result = new Result(resultEl, { icon: 'custom', customIcon: '<span class="my-icon">X</span>' });
      result.setIcon('warning');
      expect(resultEl.querySelector('.ag-result-icon .my-icon')).toBeNull();

      result.setIcon('custom');
      expect(resultEl.querySelector('.ag-result-icon .my-icon')?.textContent).toBe('X');
    });
  });

  describe('setCustomIcon', () => {
    it('should switch icon mode to custom and render provided html', () => {
      const result = new Result(resultEl, { icon: 'success' });
      result.setCustomIcon('<b>custom!</b>');
      const icon = resultEl.querySelector('.ag-result-icon');
      expect(icon?.innerHTML).toBe('<b>custom!</b>');
    });
  });

  describe('setTitle', () => {
    it('should update title text when title was initially provided', () => {
      const result = new Result(resultEl, { title: 'Initial' });
      result.setTitle('Updated');
      expect(resultEl.querySelector('.ag-result-title')?.textContent).toBe('Updated');
    });

    it('should not create a title element if none existed initially', () => {
      const result = new Result(resultEl);
      result.setTitle('Too Late');
      expect(resultEl.querySelector('.ag-result-title')).toBeNull();
    });
  });

  describe('setDescription', () => {
    it('should update description text when description was initially provided', () => {
      const result = new Result(resultEl, { description: 'Initial' });
      result.setDescription('Updated');
      expect(resultEl.querySelector('.ag-result-description')?.textContent).toBe('Updated');
    });

    it('should not create a description element if none existed initially', () => {
      const result = new Result(resultEl);
      result.setDescription('Too Late');
      expect(resultEl.querySelector('.ag-result-description')).toBeNull();
    });
  });

  describe('createResult', () => {
    it('should create a result component from scratch with rendered options', () => {
      const result = createResult({ title: 'Done', icon: 'success' });
      const el = result.getElement();
      expect(el.className).toContain('ag-result');
      expect(el.querySelector('.ag-result-title')?.textContent).toBe('Done');
      expect(el.querySelector('.ag-result-icon')?.innerHTML).toContain('<svg');
    });
  });

  describe('destroy', () => {
    it('should remove the icon element from the DOM', () => {
      const result = new Result(resultEl);
      expect(resultEl.querySelector('.ag-result-icon')).not.toBeNull();
      result.destroy();
      expect(resultEl.querySelector('.ag-result-icon')).toBeNull();
    });

    it('should not throw when destroy is called', () => {
      const result = new Result(resultEl);
      expect(() => result.destroy()).not.toThrow();
    });
  });
});
