import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Tooltip, createTooltip } from '../src/components/tooltip';

describe('Tooltip Component', () => {
  let container: HTMLDivElement;
  let target: HTMLButtonElement;
  let instances: Tooltip[];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    target = document.createElement('button');
    target.textContent = 'Hover me';
    container.appendChild(target);
    instances = [];
  });

  afterEach(() => {
    instances.forEach((t) => t.destroy());
    document.body.removeChild(container);
  });

  function make(options?: Parameters<typeof createTooltip>[1]) {
    const tooltip = createTooltip(target, options);
    instances.push(tooltip);
    return tooltip;
  }

  describe('constructor', () => {
    it('should initialize with an element reference', () => {
      const tooltip = make({ title: 'Hi' });
      expect(tooltip.getTarget()).toBe(target);
    });

    it('should initialize with a CSS selector', () => {
      target.id = 'tooltip-target';
      const tooltip = new Tooltip('#tooltip-target', { title: 'Hi' });
      instances.push(tooltip);
      expect(tooltip.getTarget()).toBe(target);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Tooltip('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should append a portal element to document.body with the given title', () => {
      const tooltip = make({ title: 'Hello world' });
      const portal = tooltip.getTooltipElement();

      expect(portal.parentNode).toBe(document.body);
      expect(portal.querySelector('.ag-tooltip-inner')?.textContent).toBe('Hello world');
      expect(portal.className).toContain('ag-tooltip');
      expect(portal.style.display).toBe('none');
    });

    it('should reflect variant and position options in classes', () => {
      const tooltip = make({ variant: 'success', position: 'bottom' });
      const portal = tooltip.getTooltipElement();
      expect(portal.className).toContain('ag-tooltip--success');
      expect(portal.className).toContain('ag-tooltip--bottom');
    });
  });

  describe('show / hide / toggle', () => {
    it('show() should set the portal element display to block', () => {
      const tooltip = make({ title: 'Hi' });
      tooltip.show();
      expect(tooltip.getTooltipElement().style.display).toBe('block');
      expect(tooltip.isVisible()).toBe(true);
    });

    it('hide() should set the portal element display back to none', () => {
      const tooltip = make({ title: 'Hi' });
      tooltip.show();
      tooltip.hide();
      expect(tooltip.getTooltipElement().style.display).toBe('none');
      expect(tooltip.isVisible()).toBe(false);
    });

    it('toggle() should flip visibility each call', () => {
      const tooltip = make({ title: 'Hi' });
      tooltip.toggle();
      expect(tooltip.isVisible()).toBe(true);
      expect(tooltip.getTooltipElement().style.display).toBe('block');

      tooltip.toggle();
      expect(tooltip.isVisible()).toBe(false);
      expect(tooltip.getTooltipElement().style.display).toBe('none');
    });

    it('should call onVisibleChange when shown and hidden', () => {
      const onVisibleChange = vi.fn();
      const tooltip = make({ title: 'Hi', onVisibleChange });

      tooltip.show();
      expect(onVisibleChange).toHaveBeenCalledWith(true);

      tooltip.hide();
      expect(onVisibleChange).toHaveBeenCalledWith(false);
    });
  });

  describe('trigger modes', () => {
    it('hover trigger should show on mouseenter and hide on mouseleave', () => {
      const tooltip = make({ title: 'Hi', trigger: 'hover' });

      target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(true);

      target.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(false);
    });

    it('click trigger should toggle visibility on click', () => {
      const tooltip = make({ title: 'Hi', trigger: 'click' });

      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(true);

      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(false);
    });

    it('focus trigger should show on focus and hide on blur', () => {
      const tooltip = make({ title: 'Hi', trigger: 'focus' });

      target.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(true);

      target.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(false);
    });

    it('should hide when clicking outside the target and tooltip', () => {
      const tooltip = make({ title: 'Hi', trigger: 'click' });
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(true);

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(false);
    });
  });

  describe('disabled', () => {
    it('should block showing via show() when disabled', () => {
      const tooltip = make({ title: 'Hi', disabled: true });
      tooltip.show();
      expect(tooltip.isVisible()).toBe(false);
      expect(tooltip.getTooltipElement().style.display).toBe('none');
    });

    it('should not bind trigger events when disabled at construction', () => {
      const tooltip = make({ title: 'Hi', trigger: 'hover', disabled: true });
      target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(false);
    });

    it('setDisabled(true) should hide a visible tooltip', () => {
      const tooltip = make({ title: 'Hi' });
      tooltip.show();
      expect(tooltip.isVisible()).toBe(true);

      tooltip.setDisabled(true);
      expect(tooltip.isVisible()).toBe(false);
      expect(tooltip.isDisabled()).toBe(true);
    });
  });

  describe('setTitle', () => {
    it('should update the tooltip inner text content', () => {
      const tooltip = make({ title: 'Old' });
      tooltip.setTitle('New');
      expect(tooltip.getTooltipElement().querySelector('.ag-tooltip-inner')?.textContent).toBe(
        'New'
      );
    });
  });

  describe('destroy', () => {
    it('should remove the portal element from document.body', () => {
      const tooltip = make({ title: 'Hi' });
      const portal = tooltip.getTooltipElement();
      expect(document.body.contains(portal)).toBe(true);

      tooltip.destroy();
      expect(document.body.contains(portal)).toBe(false);
    });

    it('should remove listeners so events after destroy no longer show it', () => {
      const tooltip = make({ title: 'Hi', trigger: 'hover' });
      tooltip.destroy();

      target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(tooltip.isVisible()).toBe(false);
    });
  });

  describe('createTooltip', () => {
    it('should return a working Tooltip instance attached to document.body', () => {
      const tooltip = make({ title: 'Factory made' });
      expect(tooltip).toBeInstanceOf(Tooltip);
      expect(document.body.contains(tooltip.getTooltipElement())).toBe(true);
    });
  });
});
