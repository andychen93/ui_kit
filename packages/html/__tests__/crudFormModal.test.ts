import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CrudFormModal, createCrudFormModal } from '../src/components/crud-form-modal';

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('CrudFormModal Component', () => {
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

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
  ];

  function getInput(modal: CrudFormModal, name: string): HTMLInputElement {
    return modal.getElement().querySelector(`[name="${name}"]`) as HTMLInputElement;
  }

  function getOkButton(modal: CrudFormModal): HTMLButtonElement {
    return modal.getElement().querySelector('.ag-modal-footer .ag-btn--primary') as HTMLButtonElement;
  }

  function getCancelButton(modal: CrudFormModal): HTMLButtonElement {
    return modal.getElement().querySelector('.ag-modal-footer .ag-btn--default') as HTMLButtonElement;
  }

  function getFieldError(modal: CrudFormModal, name: string): HTMLElement | null {
    const input = getInput(modal, name);
    return input.closest('.ag-form-item')?.querySelector('.ag-form-item-error') as HTMLElement | null;
  }

  // The component listens for the form's native 'submit' event (bound in
  // bindEvents()). Dispatching that event is the same trigger a real Enter
  // keypress produces. See the dedicated bug-report test below for why
  // clicking the rendered OK button does NOT reach this path.
  function submit(modal: CrudFormModal): void {
    const form = modal.getElement().querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const modal = new CrudFormModal(rootEl, { fields });
      expect(modal.getElement()).toBe(rootEl);
    });

    it('should throw for a selector that does not exist', () => {
      expect(() => new CrudFormModal('#missing-crud-modal', { fields })).toThrow(
        'Element not found for selector: #missing-crud-modal'
      );
    });

    it('should default the title to "Create" in create mode', () => {
      const modal = new CrudFormModal(rootEl, { fields, mode: 'create' });
      expect(modal.getElement().querySelector('.ag-modal-title')?.textContent).toBe('Create');
      expect(modal.getMode()).toBe('create');
    });

    it('should default the title to "Edit" in edit mode', () => {
      const modal = new CrudFormModal(rootEl, { fields, mode: 'edit' });
      expect(modal.getElement().querySelector('.ag-modal-title')?.textContent).toBe('Edit');
      expect(modal.getMode()).toBe('edit');
    });

    it('should use an explicit title over the mode-derived default', () => {
      const modal = new CrudFormModal(rootEl, { fields, mode: 'edit', title: 'Edit User #42' });
      expect(modal.getElement().querySelector('.ag-modal-title')?.textContent).toBe('Edit User #42');
    });
  });

  describe('initialValues', () => {
    it('should pre-fill form fields from initialValues', () => {
      const modal = new CrudFormModal(rootEl, {
        fields,
        mode: 'edit',
        initialValues: { name: 'Ada', email: 'ada@example.com' },
      });

      expect(getInput(modal, 'name').value).toBe('Ada');
      expect(getInput(modal, 'email').value).toBe('ada@example.com');
    });
  });

  describe('validation', () => {
    it('should block submit and show a field-level error when a required field is empty', () => {
      const onOk = vi.fn();
      const modal = new CrudFormModal(rootEl, { fields, onOk });

      submit(modal);

      expect(onOk).not.toHaveBeenCalled();
      expect(getFieldError(modal, 'name')?.textContent).toBe('Name is required');
      expect(getFieldError(modal, 'name')?.style.display).toBe('block');
    });

    it('should proceed with submit once the required field is fixed', () => {
      const onOk = vi.fn();
      const modal = new CrudFormModal(rootEl, { fields, onOk });

      submit(modal);
      expect(onOk).not.toHaveBeenCalled();

      getInput(modal, 'name').value = 'Grace';
      submit(modal);

      expect(onOk).toHaveBeenCalledTimes(1);
      expect(onOk).toHaveBeenCalledWith(expect.objectContaining({ name: 'Grace' }));
      expect(getFieldError(modal, 'name')?.style.display).toBe('none');
    });

    it('should fire onOk when the rendered OK button is clicked, even though it lives outside the <form> element', () => {
      const onOk = vi.fn();
      const modal = new CrudFormModal(rootEl, { fields, onOk });
      const form = modal.getElement().querySelector('form') as HTMLFormElement;
      const okBtn = getOkButton(modal);

      // The button is a sibling of the form, not a descendant - it relies
      // on the `form="<id>"` attribute to associate back to it.
      expect(form.contains(okBtn)).toBe(false);
      expect(okBtn.getAttribute('form')).toBe(form.id);

      getInput(modal, 'name').value = 'Grace';
      okBtn.click();

      expect(onOk).toHaveBeenCalledTimes(1);
      expect(onOk).toHaveBeenCalledWith(expect.objectContaining({ name: 'Grace' }));
    });
  });

  describe('onOk sync return', () => {
    it('should close the modal immediately when onOk returns a plain value', () => {
      const onOk = vi.fn().mockReturnValue(undefined);
      const modal = new CrudFormModal(rootEl, { fields, onOk, visible: true });

      getInput(modal, 'name').value = 'Sync User';
      expect(modal.isVisible()).toBe(true);

      submit(modal);

      expect(modal.isVisible()).toBe(false);
    });

    it('should close the modal immediately when no onOk handler is configured', () => {
      const modal = new CrudFormModal(rootEl, { fields, visible: true });
      getInput(modal, 'name').value = 'No Handler';

      submit(modal);

      expect(modal.isVisible()).toBe(false);
    });
  });

  describe('onOk async return - pending state', () => {
    it('should disable submit/cancel while pending, then close on success', async () => {
      let resolveFn: () => void;
      const onOk = vi.fn(() => new Promise<void>((resolve) => { resolveFn = resolve; }));
      const modal = new CrudFormModal(rootEl, { fields, onOk, visible: true });

      getInput(modal, 'name').value = 'Async User';
      submit(modal);

      expect(modal.isPending()).toBe(true);
      expect(getOkButton(modal).disabled).toBe(true);
      expect(getCancelButton(modal).disabled).toBe(true);
      expect(modal.getElement().classList.contains('ag-modal--pending')).toBe(true);
      expect(modal.isVisible()).toBe(true); // still open while pending

      resolveFn!();
      await flush();

      expect(modal.isPending()).toBe(false);
      expect(modal.isVisible()).toBe(false);
      expect(getOkButton(modal).disabled).toBe(false);
    });

    it('should ignore a second submit click while a submission is already pending', () => {
      const onOk = vi.fn(() => new Promise<void>(() => {}));
      const modal = new CrudFormModal(rootEl, { fields, onOk, visible: true });

      getInput(modal, 'name').value = 'Double Click';
      submit(modal);
      submit(modal);

      expect(onOk).toHaveBeenCalledTimes(1);
    });
  });

  describe('onOk async return - rejection', () => {
    it('should keep the modal open, show the error message, and clear pending on rejection', async () => {
      const onOk = vi.fn().mockRejectedValue(new Error('server exploded'));
      const modal = new CrudFormModal(rootEl, { fields, onOk, visible: true });

      getInput(modal, 'name').value = 'Failing User';
      submit(modal);

      expect(modal.isPending()).toBe(true);

      await flush();

      expect(modal.isPending()).toBe(false);
      expect(modal.isVisible()).toBe(true);
      const errorEl = modal.getElement().querySelector('.ag-crud-form-error') as HTMLElement;
      expect(errorEl.textContent).toBe('server exploded');
      expect(errorEl.style.display).toBe('block');
      expect(getOkButton(modal).disabled).toBe(false);
    });

    it('should show the thrown error message when onOk throws synchronously', () => {
      const onOk = vi.fn(() => {
        throw new Error('sync boom');
      });
      const modal = new CrudFormModal(rootEl, { fields, onOk, visible: true });

      getInput(modal, 'name').value = 'Sync Fail';
      submit(modal);

      expect(modal.isVisible()).toBe(true);
      const errorEl = modal.getElement().querySelector('.ag-crud-form-error') as HTMLElement;
      expect(errorEl.textContent).toBe('sync boom');
      expect(errorEl.style.display).toBe('block');
    });

    it('should clear a previous submit error on the next successful submit', async () => {
      const onOk = vi.fn()
        .mockRejectedValueOnce(new Error('first failure'))
        .mockResolvedValueOnce(undefined);
      const modal = new CrudFormModal(rootEl, { fields, onOk, visible: true });

      getInput(modal, 'name').value = 'Retry User';
      submit(modal);
      await flush();

      const errorEl = modal.getElement().querySelector('.ag-crud-form-error') as HTMLElement;
      expect(errorEl.textContent).toBe('first failure');

      submit(modal);
      await flush();

      expect(errorEl.textContent).toBe('');
      expect(errorEl.style.display).toBe('none');
      expect(modal.isVisible()).toBe(false);
    });
  });

  describe('cancel', () => {
    it('should call onCancel and close the modal when the cancel button is clicked', () => {
      const onCancel = vi.fn();
      const modal = new CrudFormModal(rootEl, { fields, onCancel, visible: true });

      expect(modal.isVisible()).toBe(true);
      getCancelButton(modal).click();

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(modal.isVisible()).toBe(false);
    });

    it('should close the modal even without an onCancel handler configured', () => {
      const modal = new CrudFormModal(rootEl, { fields, visible: true });
      expect(() => getCancelButton(modal).click()).not.toThrow();
      expect(modal.isVisible()).toBe(false);
    });
  });

  describe('getValues / setValues', () => {
    it('should round-trip values through setValues and getValues', () => {
      const modal = new CrudFormModal(rootEl, { fields });
      modal.setValues({ name: 'Round Trip', email: 'rt@example.com' });
      expect(modal.getValues()).toEqual({ name: 'Round Trip', email: 'rt@example.com' });
    });
  });

  describe('show/close', () => {
    it('should toggle visible state, display style, and the visible class', () => {
      const modal = new CrudFormModal(rootEl, { fields });
      expect(modal.isVisible()).toBe(false);
      expect(modal.getElement().style.display).not.toBe('block');

      modal.show();
      expect(modal.isVisible()).toBe(true);
      expect(modal.getElement().style.display).toBe('block');
      expect(modal.getElement().classList.contains('ag-modal--visible')).toBe(true);

      modal.close();
      expect(modal.isVisible()).toBe(false);
      expect(modal.getElement().style.display).toBe('none');
      expect(modal.getElement().classList.contains('ag-modal--visible')).toBe(false);
    });
  });

  describe('destroy', () => {
    it('should remove listeners so Cancel/submit no longer trigger callbacks', () => {
      const onCancel = vi.fn();
      const onOk = vi.fn();
      const modal = new CrudFormModal(rootEl, { fields, onOk, onCancel, visible: true });

      modal.destroy();

      getInput(modal, 'name').value = 'After Destroy';
      getCancelButton(modal).click();
      submit(modal);

      expect(onCancel).not.toHaveBeenCalled();
      expect(onOk).not.toHaveBeenCalled();
    });
  });

  describe('createCrudFormModal', () => {
    it('should create a modal from scratch that validates and submits correctly', () => {
      const onOk = vi.fn();
      const modal = createCrudFormModal({ fields, onOk, visible: true });

      expect(modal.getElement().className).toContain('ag-crud-form-modal');

      document.body.appendChild(modal.getElement());
      submit(modal);
      expect(onOk).not.toHaveBeenCalled();

      getInput(modal, 'name').value = 'Scratch User';
      submit(modal);
      expect(onOk).toHaveBeenCalledWith(expect.objectContaining({ name: 'Scratch User' }));

      modal.getElement().remove();
    });
  });
});
