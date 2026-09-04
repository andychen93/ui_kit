import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Popover, createPopover } from '../src/components/popover';

describe('Popover Component', () => {
  let container: HTMLDivElement;
  let target: HTMLButtonElement;
  let instances: Popover[];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    target = document.createElement('button');
    target.textContent = 'Target';
    container.appendChild(target);
    instances = [];
  });

  afterEach(() => {
    instances.forEach((p) => p.destroy());
    document.body.removeChild(container);
  });

  function make(options?: ConstructorParameters<typeof Popover>[1]) {
    const popover = new Popover(target, options);
    instances.push(popover);
    return popover;
  }

  describe('constructor', () => {
    it('should initialize with an element reference', () => {
      const popover = make({ content: 'Hi' });
      expect(popover.getTarget()).toBe(target);
    });

    it('should initialize with a CSS selector', () => {
      target.id = 'popover-target';
      const popover = new Popover('#popover-target', { content: 'Hi' });
      instances.push(popover);
      expect(popover.getTarget()).toBe(target);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Popover('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should append a portal element to document.body reflecting title and content', () => {
      const popover = make({ title: 'Title text', content: 'Body text' });
      const el = popover.getPopoverElement();

      expect(el.parentNode).toBe(document.body);
      expect(el.querySelector('.ag-popover-header')?.textContent).toBe('Title text');
      expect(el.querySelector('.ag-popover-body')?.textContent).toBe('Body text');
      expect(el.style.display).not.toBe('block');
    });

    it('should not render a header when no title is given', () => {
      const popover = make({ content: 'Body only' });
      expect(popover.getPopoverElement().querySelector('.ag-popover-header')).toBeNull();
    });

    it('should reflect variant option in classes', () => {
      const popover = make({ variant: 'success' });
      expect(popover.getPopoverElement().className).toContain('ag-popover--success');
    });
  });

  describe('show / hide / toggle', () => {
    it('show() should make the popover visible', () => {
      const popover = make();
      popover.show();
      expect(popover.isVisible()).toBe(true);
      expect(popover.getPopoverElement().style.display).toBe('block');
    });

    it('hide() should make the popover hidden', () => {
      const popover = make();
      popover.show();
      popover.hide();
      expect(popover.isVisible()).toBe(false);
      expect(popover.getPopoverElement().style.display).toBe('none');
    });

    it('toggle() should flip visibility', () => {
      const popover = make();
      popover.toggle();
      expect(popover.isVisible()).toBe(true);
      popover.toggle();
      expect(popover.isVisible()).toBe(false);
    });

    it('should call onVisibleChange on show and hide', () => {
      const onVisibleChange = vi.fn();
      const popover = make({ onVisibleChange });

      popover.show();
      expect(onVisibleChange).toHaveBeenCalledWith(true);

      popover.hide();
      expect(onVisibleChange).toHaveBeenCalledWith(false);
    });
  });

  describe('trigger modes', () => {
    it('default hover trigger should show/hide on mouseenter/mouseleave', () => {
      const popover = make();

      target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(popover.isVisible()).toBe(true);

      target.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      expect(popover.isVisible()).toBe(false);
    });

    it('click trigger should toggle visibility on click', () => {
      const popover = make({ trigger: 'click' });

      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(popover.isVisible()).toBe(true);

      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(popover.isVisible()).toBe(false);
    });

    it('focus trigger should show/hide on focus/blur', () => {
      const popover = make({ trigger: 'focus' });

      target.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      expect(popover.isVisible()).toBe(true);

      target.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      expect(popover.isVisible()).toBe(false);
    });

    it('should hide when clicking outside target and popover', () => {
      const popover = make({ trigger: 'click' });
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(popover.isVisible()).toBe(true);

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(popover.isVisible()).toBe(false);
    });
  });

  describe('disabled', () => {
    it('should block show() when disabled', () => {
      const popover = make({ disabled: true });
      popover.show();
      expect(popover.isVisible()).toBe(false);
    });

    it('setDisabled(true) should hide a currently visible popover', () => {
      const popover = make();
      popover.show();
      popover.setDisabled(true);
      expect(popover.isVisible()).toBe(false);
      expect(popover.isDisabled()).toBe(true);
    });
  });

  describe('setContent / setTitle', () => {
    it('setContent should update the body text', () => {
      const popover = make({ content: 'Old' });
      popover.setContent('New content');
      expect(popover.getPopoverElement().querySelector('.ag-popover-body')?.textContent).toBe(
        'New content'
      );
    });

    it('setTitle should create a header when none existed', () => {
      const popover = make({ content: 'Body' });
      expect(popover.getPopoverElement().querySelector('.ag-popover-header')).toBeNull();

      popover.setTitle('New title');
      expect(popover.getPopoverElement().querySelector('.ag-popover-header')?.textContent).toBe(
        'New title'
      );
    });

    it('setTitle with empty string should remove an existing header', () => {
      const popover = make({ title: 'Has title' });
      expect(popover.getPopoverElement().querySelector('.ag-popover-header')).not.toBeNull();

      popover.setTitle('');
      expect(popover.getPopoverElement().querySelector('.ag-popover-header')).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should remove the portal element from document.body', () => {
      const popover = make();
      const el = popover.getPopoverElement();
      expect(document.body.contains(el)).toBe(true);

      popover.destroy();
      expect(document.body.contains(el)).toBe(false);
    });

    it('should remove listeners so events after destroy no longer show it', () => {
      const popover = make({ trigger: 'hover' });
      popover.destroy();

      target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(popover.isVisible()).toBe(false);
    });
  });

  describe('createPopover factory', () => {
    it('should attach a popover to the given target element', () => {
      const popover = createPopover(target, { content: 'Hi' });
      expect(popover).toBeInstanceOf(Popover);
      expect(popover.getTarget()).toBe(target);
      popover.destroy();
    });

    it('should accept a selector string as the target', () => {
      target.id = 'popover-factory-target';
      const popover = createPopover('#popover-factory-target', { content: 'Hi' });
      expect(popover.getTarget()).toBe(target);
      popover.destroy();
    });

    it('should throw when the selector does not resolve to an element', () => {
      expect(() => createPopover('#missing-popover-target', { content: 'Hi' })).toThrow(
        'Element not found for selector: #missing-popover-target'
      );
    });
  });
});
