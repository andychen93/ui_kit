import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { QueryForm, createQueryForm } from '../src/components/query-form';

describe('QueryForm Component', () => {
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

  const items = [
    { name: 'keyword', label: 'Keyword', type: 'input' as const },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'All', value: '' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ];

  function getInput(qf: QueryForm, name: string): HTMLInputElement {
    return qf.getElement().querySelector(`[name="${name}"]`) as HTMLInputElement;
  }

  function getSelect(qf: QueryForm, name: string): HTMLSelectElement {
    return qf.getElement().querySelector(`[name="${name}"]`) as HTMLSelectElement;
  }

  function getButton(qf: QueryForm, text: string): HTMLButtonElement {
    return Array.from(qf.getElement().querySelectorAll('button')).find(
      (b) => b.textContent === text
    ) as HTMLButtonElement;
  }

  // The component listens for the form's native 'submit' event (bound in
  // bindEvents()). Dispatching that event is the same trigger a real Enter
  // keypress produces. See the dedicated bug-report test below for why
  // clicking the rendered Search button does NOT reach this path.
  function submitForm(qf: QueryForm): void {
    const form = qf.getElement().querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const qf = new QueryForm(rootEl, { items });
      expect(qf.getElement()).toBe(rootEl);
    });

    it('should initialize with a selector string', () => {
      rootEl.id = 'test-query-form';
      const qf = new QueryForm('#test-query-form', { items });
      expect(qf.getElement()).toBe(rootEl);
    });

    it('should throw for a selector that does not exist', () => {
      expect(() => new QueryForm('#missing-query-form', { items })).toThrow(
        'Element not found for selector: #missing-query-form'
      );
    });
  });

  describe('rendering fields', () => {
    it('should render one input field per input-type item', () => {
      const qf = new QueryForm(rootEl, { items });
      const input = getInput(qf, 'keyword');
      expect(input).not.toBeNull();
      expect(input.tagName).toBe('INPUT');
      expect(input.type).toBe('text');
    });

    it('should render a select field with options for select-type items', () => {
      const qf = new QueryForm(rootEl, { items });
      const select = getSelect(qf, 'status');
      expect(select).not.toBeNull();
      expect(select.tagName).toBe('SELECT');
      expect(select.querySelectorAll('option').length).toBe(3);
      expect(select.querySelectorAll('option')[1].textContent).toBe('Active');
    });

    it('should render a label element for each item that has a label', () => {
      const qf = new QueryForm(rootEl, { items });
      const labels = qf.getElement().querySelectorAll('.ag-query-form-label');
      expect(labels.length).toBe(2);
      expect(labels[0].textContent).toBe('Keyword');
    });
  });

  describe('onSearch', () => {
    it('should fire onSearch with current field values on native form submission (Enter key)', () => {
      const onSearch = vi.fn();
      const qf = new QueryForm(rootEl, { items, onSearch });

      getInput(qf, 'keyword').value = 'hello';
      getSelect(qf, 'status').value = 'active';
      submitForm(qf);

      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith({ keyword: 'hello', status: 'active' });
    });

    it('should fire onSearch when the rendered Search button is clicked, even though it lives outside the <form> element', () => {
      const onSearch = vi.fn();
      const qf = new QueryForm(rootEl, { items, onSearch });
      const form = qf.getElement().querySelector('form') as HTMLFormElement;
      const searchBtn = getButton(qf, 'Search');

      // The button is a sibling of the form, not a descendant - it relies
      // on the `form="<id>"` attribute to associate back to it.
      expect(form.contains(searchBtn)).toBe(false);
      expect(searchBtn.getAttribute('form')).toBe(form.id);

      getInput(qf, 'keyword').value = 'hello';
      searchBtn.click();

      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith({ keyword: 'hello', status: '' });
    });
  });

  describe('reset', () => {
    it('should restore fields to initialValues (not just native empty reset) and call onReset with those values', () => {
      const onReset = vi.fn();
      const qf = new QueryForm(rootEl, {
        items,
        initialValues: { keyword: 'default', status: 'inactive' },
        onReset,
      });

      // Change the values away from the initial ones.
      getInput(qf, 'keyword').value = 'changed';
      getSelect(qf, 'status').value = 'active';

      getButton(qf, 'Reset').click();

      expect(getInput(qf, 'keyword').value).toBe('default');
      expect(getSelect(qf, 'status').value).toBe('inactive');
      expect(onReset).toHaveBeenCalledWith({ keyword: 'default', status: 'inactive' });
    });

    it('should pick up new initial values set via setInitialValues before the next reset', () => {
      const onReset = vi.fn();
      const qf = new QueryForm(rootEl, {
        items,
        initialValues: { keyword: 'old-default' },
        onReset,
      });

      qf.setInitialValues({ keyword: 'new-default', status: 'active' });
      getInput(qf, 'keyword').value = 'user typed';
      qf.reset();

      expect(getInput(qf, 'keyword').value).toBe('new-default');
      expect(getSelect(qf, 'status').value).toBe('active');
      expect(onReset).toHaveBeenCalledWith(
        expect.objectContaining({ keyword: 'new-default', status: 'active' })
      );
    });

    it('should pre-fill fields from initialValues at construction time', () => {
      const qf = new QueryForm(rootEl, {
        items,
        initialValues: { keyword: 'preset', status: 'active' },
      });

      expect(getInput(qf, 'keyword').value).toBe('preset');
      expect(getSelect(qf, 'status').value).toBe('active');
    });
  });

  describe('setDisabled', () => {
    it('should disable all fields and the search/reset buttons when set to true', () => {
      const qf = new QueryForm(rootEl, { items });

      qf.setDisabled(true);

      expect(getInput(qf, 'keyword').disabled).toBe(true);
      expect(getSelect(qf, 'status').disabled).toBe(true);
      expect(getButton(qf, 'Search').disabled).toBe(true);
      expect(getButton(qf, 'Reset').disabled).toBe(true);
      expect(qf.isDisabled()).toBe(true);
      expect(qf.getElement().className).toContain('ag-query-form--disabled');
    });

    it('should re-enable all fields and buttons when set back to false', () => {
      const qf = new QueryForm(rootEl, { items, disabled: true });
      expect(getInput(qf, 'keyword').disabled).toBe(true);

      qf.setDisabled(false);

      expect(getInput(qf, 'keyword').disabled).toBe(false);
      expect(getButton(qf, 'Search').disabled).toBe(false);
      expect(qf.getElement().className).not.toContain('ag-query-form--disabled');
    });
  });

  describe('expand/collapse', () => {
    it('should start expanded by default, showing the form body', () => {
      const qf = new QueryForm(rootEl, { items });
      const form = qf.getElement().querySelector('form') as HTMLFormElement;
      expect(form.style.display).toBe('');
      expect(getButton(qf, 'Collapse')).not.toBeUndefined();
    });

    it('should start collapsed when collapsed: true is passed, hiding the body', () => {
      const qf = new QueryForm(rootEl, { items, collapsed: true });
      const form = qf.getElement().querySelector('form') as HTMLFormElement;
      expect(form.style.display).toBe('none');
      expect(getButton(qf, 'Expand')).not.toBeUndefined();
    });

    it('should toggle visibility and its own label text when clicked', () => {
      const qf = new QueryForm(rootEl, { items });
      const form = qf.getElement().querySelector('form') as HTMLFormElement;
      const toggleBtn = getButton(qf, 'Collapse');

      toggleBtn.click();
      expect(form.style.display).toBe('none');
      expect(toggleBtn.textContent).toBe('Expand');

      toggleBtn.click();
      expect(form.style.display).toBe('');
      expect(toggleBtn.textContent).toBe('Collapse');
    });

    it('should not render an expand/collapse toggle when there are no items', () => {
      const qf = new QueryForm(rootEl, { items: [] });
      const buttons = Array.from(qf.getElement().querySelectorAll('button')).map(
        (b) => b.textContent
      );
      expect(buttons).not.toContain('Expand');
      expect(buttons).not.toContain('Collapse');
    });
  });

  describe('getValues / setValues', () => {
    it('should round-trip values through setValues and getValues', () => {
      const qf = new QueryForm(rootEl, { items });
      qf.setValues({ keyword: 'round-trip', status: 'inactive' });
      expect(qf.getValues()).toEqual({ keyword: 'round-trip', status: 'inactive' });
    });
  });

  describe('destroy', () => {
    it('should remove listeners so submit/Reset no longer trigger callbacks', () => {
      const onSearch = vi.fn();
      const onReset = vi.fn();
      const qf = new QueryForm(rootEl, { items, onSearch, onReset });

      qf.destroy();

      submitForm(qf);
      getButton(qf, 'Reset').click();

      expect(onSearch).not.toHaveBeenCalled();
      expect(onReset).not.toHaveBeenCalled();
    });
  });

  describe('createQueryForm', () => {
    it('should create a query-form from scratch with a working search-on-submit flow', () => {
      const onSearch = vi.fn();
      const qf = createQueryForm({ items, onSearch });

      expect(qf.getElement().className).toContain('ag-query-form');

      document.body.appendChild(qf.getElement());
      (qf.getElement().querySelector('[name="keyword"]') as HTMLInputElement).value = 'x';
      submitForm(qf);

      expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ keyword: 'x' }));
      qf.getElement().remove();
    });
  });
});
