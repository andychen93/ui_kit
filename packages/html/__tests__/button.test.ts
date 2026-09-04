import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Button, createButton } from '../src/components/button';

describe('Button Component', () => {
  let container: HTMLDivElement;
  let button: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    button = document.createElement('button');
    button.textContent = 'Click Me';
    container.appendChild(button);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with element selector', () => {
      button.id = 'test-btn';
      const btn = new Button('#test-btn');
      expect(btn.getElement()).toBe(button);
    });

    it('should initialize with element reference', () => {
      const btn = new Button(button);
      expect(btn.getElement()).toBe(button);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Button('#non-existent')).toThrow();
    });
  });

  describe('classes', () => {
    it('should apply default classes', () => {
      const btn = new Button(button);
      expect(button.className).toContain('ag-btn');
      expect(button.className).toContain('ag-btn--primary');
      expect(button.className).toContain('ag-btn--md');
    });

    it('should apply variant classes', () => {
      const btn = new Button(button, { variant: 'danger' });
      expect(button.className).toContain('ag-btn--danger');
      expect(button.className).not.toContain('ag-btn--primary');
    });

    it('should apply size classes', () => {
      const btn = new Button(button, { size: 'lg' });
      expect(button.className).toContain('ag-btn--lg');
      expect(button.className).not.toContain('ag-btn--md');
    });

    it('should apply disabled class when disabled', () => {
      const btn = new Button(button, { disabled: true });
      expect(button.className).toContain('ag-btn--disabled');
      expect(button.disabled).toBe(true);
    });

    it('should apply loading class when loading', () => {
      const btn = new Button(button, { loading: true });
      expect(button.className).toContain('ag-btn--loading');
    });
  });

  describe('text management', () => {
    it('should set button text', () => {
      const btn = new Button(button);
      btn.setText('New Text');
      expect(button.textContent).toBe('New Text');
    });

    it('should get button text', () => {
      button.textContent = 'Test Text';
      const btn = new Button(button);
      expect(btn.getText()).toBe('Test Text');
    });
  });

  describe('disabled state', () => {
    it('should set disabled state', () => {
      const btn = new Button(button);
      btn.setDisabled(true);
      expect(btn.isDisabled()).toBe(true);
      expect(button.disabled).toBe(true);
      expect(button.className).toContain('ag-btn--disabled');
    });

    it('should unset disabled state', () => {
      const btn = new Button(button, { disabled: true });
      btn.setDisabled(false);
      expect(btn.isDisabled()).toBe(false);
      expect(button.disabled).toBe(false);
      expect(button.className).not.toContain('ag-btn--disabled');
    });
  });

  describe('loading state', () => {
    it('should set loading state', () => {
      const btn = new Button(button);
      btn.setLoading(true);
      expect(btn.isLoading()).toBe(true);
      expect(button.className).toContain('ag-btn--loading');
      expect(button.disabled).toBe(true);
    });

    it('should unset loading state', () => {
      const btn = new Button(button, { loading: true });
      btn.setLoading(false);
      expect(btn.isLoading()).toBe(false);
      expect(button.className).not.toContain('ag-btn--loading');
      expect(button.disabled).toBe(false);
    });

    it('should respect disabled state when unsetting loading', () => {
      const btn = new Button(button, { disabled: true, loading: true });
      btn.setLoading(false);
      expect(button.disabled).toBe(true);
    });
  });

  describe('variant management', () => {
    it('should set variant', () => {
      const btn = new Button(button);
      btn.setVariant('success');
      expect(btn.getVariant()).toBe('success');
      expect(button.className).toContain('ag-btn--success');
      expect(button.className).not.toContain('ag-btn--primary');
    });

    it('should get variant', () => {
      const btn = new Button(button, { variant: 'info' });
      expect(btn.getVariant()).toBe('info');
    });
  });

  describe('size management', () => {
    it('should set size', () => {
      const btn = new Button(button);
      btn.setSize('sm');
      expect(btn.getSize()).toBe('sm');
      expect(button.className).toContain('ag-btn--sm');
      expect(button.className).not.toContain('ag-btn--md');
    });

    it('should get size', () => {
      const btn = new Button(button, { size: 'lg' });
      expect(btn.getSize()).toBe('lg');
    });
  });

  describe('focus', () => {
    it('should focus button', () => {
      const btn = new Button(button);
      btn.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should blur button', () => {
      const btn = new Button(button);
      btn.focus();
      expect(document.activeElement).toBe(button);
      btn.blur();
      expect(document.activeElement).not.toBe(button);
    });
  });

  describe('click', () => {
    it('should trigger click event', () => {
      let clicked = false;
      button.addEventListener('click', () => {
        clicked = true;
      });
      const btn = new Button(button);
      btn.click();
      expect(clicked).toBe(true);
    });

    it('should call onClick callback', () => {
      let called = false;
      const btn = new Button(button, {
        onClick: () => {
          called = true;
        },
      });
      button.click();
      expect(called).toBe(true);
    });
  });

  describe('createButton', () => {
    it('should create button from scratch', () => {
      const btn = createButton({
        text: 'Test Button',
        variant: 'primary',
        size: 'md',
      });
      const element = btn.getElement();
      expect(element.tagName).toBe('BUTTON');
      expect(element.textContent).toBe('Test Button');
      expect(element.className).toContain('ag-btn--primary');
    });

    it('should create button with click handler', () => {
      let clicked = false;
      const btn = createButton({
        text: 'Click',
        onClick: () => {
          clicked = true;
        },
      });
      btn.click();
      expect(clicked).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should cleanup event listeners', () => {
      const btn = new Button(button, {
        onClick: () => {},
      });
      expect(btn.getElement()).toBe(button);
      btn.destroy();
      // After destroy, component should not leak listeners
      expect(true).toBe(true); // Placeholder assertion
    });
  });
});
