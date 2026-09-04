import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RowActions, createRowActions, RowAction } from '../src/components/row-actions';

describe('RowActions Component', () => {
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
      const comp = new RowActions(el);
      expect(comp.getElement()).toBe(el);
    });

    it('should initialize with selector', () => {
      el.id = 'test-row-actions';
      const comp = new RowActions('#test-row-actions');
      expect(comp.getElement()).toBe(el);
    });

    it('should throw error if selector not found', () => {
      expect(() => new RowActions('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });

    it('should apply the base class and an optional className', () => {
      new RowActions(el, { className: 'custom-class' });
      expect(el.className).toContain('ag-row-actions');
      expect(el.className).toContain('custom-class');
    });

    it('should render buttons for actions passed in options', () => {
      new RowActions(el, {
        actions: [
          { key: 'edit', text: 'Edit' },
          { key: 'delete', text: 'Delete' },
        ],
      });
      const buttons = el.querySelectorAll('button');
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toBe('Edit');
      expect(buttons[1].textContent).toBe('Delete');
    });
  });

  describe('addAction', () => {
    it('should render a button with the action text', () => {
      const comp = new RowActions(el);
      const btn = comp.addAction({ key: 'view', text: 'View' });
      expect(btn.textContent).toBe('View');
      expect(el.contains(btn)).toBe(true);
    });

    it('should render an icon and text when icon is provided', () => {
      const comp = new RowActions(el);
      const btn = comp.addAction({ key: 'view', text: 'View', icon: '<svg></svg>' });
      expect(btn.querySelector('.ag-btn-icon')).not.toBeNull();
      expect(btn.innerHTML).toContain('<svg></svg>');
      expect(btn.textContent?.trim()).toBe('View');
    });

    it('should apply the danger class when danger is set', () => {
      const comp = new RowActions(el);
      const btn = comp.addAction({ key: 'delete', text: 'Delete', danger: true });
      expect(btn.className).toContain('ag-btn--danger');
    });

    it('should render disabled action buttons as disabled', () => {
      const comp = new RowActions(el);
      const btn = comp.addAction({ key: 'archive', text: 'Archive', disabled: true });
      expect(btn.disabled).toBe(true);
      expect(btn.className).toContain('ag-btn--disabled');
    });
  });

  describe('click wiring', () => {
    it('should call onClick with the current record and index after setRecord/setIndex', () => {
      const onClick = vi.fn();
      const comp = new RowActions(el, {
        actions: [{ key: 'edit', text: 'Edit', onClick }],
      });
      const record = { id: 42, name: 'Row 42' };
      comp.setRecord(record);
      comp.setIndex(3);

      const btn = el.querySelector('button') as HTMLButtonElement;
      btn.click();

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(record, 3);
    });

    it('should not call onClick if record/index have not been set', () => {
      const onClick = vi.fn();
      new RowActions(el, {
        actions: [{ key: 'edit', text: 'Edit', onClick }],
      });
      const btn = el.querySelector('button') as HTMLButtonElement;
      btn.click();
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick for a disabled action even if a click event is dispatched', () => {
      const onClick = vi.fn();
      const comp = new RowActions(el, {
        actions: [{ key: 'edit', text: 'Edit', onClick, disabled: true }],
        record: { id: 1 },
        index: 0,
      });
      const btn = el.querySelector('button') as HTMLButtonElement;
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('setActionDisabled', () => {
    it('should disable a specific action by key', () => {
      const onClick = vi.fn();
      const comp = new RowActions(el, {
        actions: [{ key: 'edit', text: 'Edit', onClick }],
        record: { id: 1 },
        index: 0,
      });
      const btn = el.querySelector('button') as HTMLButtonElement;
      expect(btn.disabled).toBe(false);

      comp.setActionDisabled('edit', true);
      expect(btn.disabled).toBe(true);
      expect(btn.className).toContain('ag-btn--disabled');

      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should re-enable a specific action by key', () => {
      const onClick = vi.fn();
      const comp = new RowActions(el, {
        actions: [{ key: 'edit', text: 'Edit', onClick, disabled: true }],
        record: { id: 1 },
        index: 0,
      });
      const btn = el.querySelector('button') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);

      comp.setActionDisabled('edit', false);
      expect(btn.disabled).toBe(false);
      expect(btn.className).not.toContain('ag-btn--disabled');

      btn.click();
      expect(onClick).toHaveBeenCalledWith({ id: 1 }, 0);
    });

    it('should only affect the targeted action, leaving others untouched', () => {
      const comp = new RowActions(el, {
        actions: [
          { key: 'edit', text: 'Edit' },
          { key: 'delete', text: 'Delete' },
        ],
      });
      comp.setActionDisabled('edit', true);
      const buttons = el.querySelectorAll('button');
      expect((buttons[0] as HTMLButtonElement).disabled).toBe(true);
      expect((buttons[1] as HTMLButtonElement).disabled).toBe(false);
    });
  });

  describe('setRecord / setIndex', () => {
    it('should update which record/index subsequent clicks use', () => {
      const onClick = vi.fn();
      const comp = new RowActions(el, {
        actions: [{ key: 'edit', text: 'Edit', onClick }],
      });
      const btn = el.querySelector('button') as HTMLButtonElement;

      comp.setRecord({ id: 1 });
      comp.setIndex(0);
      btn.click();
      expect(onClick).toHaveBeenLastCalledWith({ id: 1 }, 0);

      comp.setRecord({ id: 2 });
      comp.setIndex(1);
      btn.click();
      expect(onClick).toHaveBeenLastCalledWith({ id: 2 }, 1);
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('destroy', () => {
    it('should remove all action buttons from the DOM', () => {
      new RowActions(el, {
        actions: [
          { key: 'edit', text: 'Edit' },
          { key: 'delete', text: 'Delete' },
        ],
      }).destroy();

      expect(el.querySelectorAll('button').length).toBe(0);
    });

    it('should stop firing onClick after destroy', () => {
      const onClick = vi.fn();
      const comp = new RowActions(el, {
        actions: [{ key: 'edit', text: 'Edit', onClick }],
        record: { id: 1 },
        index: 0,
      });
      const btn = el.querySelector('button') as HTMLButtonElement;
      comp.destroy();

      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('createRowActions', () => {
    it('should create a new row actions container from scratch', () => {
      const onClick = vi.fn();
      const actions: RowAction[] = [{ key: 'edit', text: 'Edit', onClick }];
      const comp = createRowActions({ actions, record: { id: 9 }, index: 2 });
      const element = comp.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(element.className).toContain('ag-row-actions');

      const btn = element.querySelector('button') as HTMLButtonElement;
      btn.click();
      expect(onClick).toHaveBeenCalledWith({ id: 9 }, 2);
    });
  });
});
