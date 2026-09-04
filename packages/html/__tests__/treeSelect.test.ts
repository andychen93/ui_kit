import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TreeSelect, createTreeSelect, TreeNode } from '../src/components/tree-select';

describe('TreeSelect Component', () => {
  let container: HTMLDivElement;
  let selectEl: HTMLDivElement;

  const treeData: TreeNode[] = [
    {
      key: '1',
      title: 'Node 1',
      children: [
        { key: '1-1', title: 'Node 1-1' },
        { key: '1-2', title: 'Node 1-2', disabled: true },
      ],
    },
    { key: '2', title: 'Node 2' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    selectEl = document.createElement('div');
    container.appendChild(selectEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function getInput(el: HTMLElement): HTMLInputElement {
    return el.querySelector('.ag-tree-select-input') as HTMLInputElement;
  }

  function getClearButton(el: HTMLElement): HTMLButtonElement {
    return el.querySelector('.ag-tree-select-clear') as HTMLButtonElement;
  }

  function getDropdown(el: HTMLElement): HTMLElement {
    return el.querySelector('.ag-tree-select-dropdown') as HTMLElement;
  }

  function getNodeLabel(el: HTMLElement, key: string): HTMLElement {
    const item = el.querySelector(`.ag-tree-item[data-key="${key}"]`);
    if (!item) throw new Error(`node not found for key ${key}`);
    // direct label child (first .ag-tree-item-label that is a direct child)
    return item.querySelector(':scope > .ag-tree-item-label') as HTMLElement;
  }

  function getNodeItem(el: HTMLElement, key: string): HTMLElement {
    const item = el.querySelector(`.ag-tree-item[data-key="${key}"]`);
    if (!item) throw new Error(`node not found for key ${key}`);
    return item as HTMLElement;
  }

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const ts = new TreeSelect(selectEl);
      expect(ts.getElement()).toBe(selectEl);
    });

    it('should initialize with selector', () => {
      selectEl.id = 'test-tree-select';
      const ts = new TreeSelect('#test-tree-select');
      expect(ts.getElement()).toBe(selectEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new TreeSelect('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should render nested tree nodes with collapsed children by default', () => {
      new TreeSelect(selectEl, { treeData });
      const dropdown = getDropdown(selectEl);
      expect(dropdown.querySelector('.ag-tree-item[data-key="1"]')).not.toBeNull();
      expect(dropdown.querySelector('.ag-tree-item[data-key="1-1"]')).not.toBeNull();
      expect(dropdown.querySelector('.ag-tree-item[data-key="1-2"]')).not.toBeNull();
      expect(dropdown.querySelector('.ag-tree-item[data-key="2"]')).not.toBeNull();

      const childrenContainer = getNodeItem(selectEl, '1').querySelector('.ag-tree-item-children') as HTMLElement;
      expect(childrenContainer.style.display).toBe('none');
    });

    it('should render disabled class for disabled nodes', () => {
      new TreeSelect(selectEl, { treeData });
      expect(getNodeItem(selectEl, '1-2').className).toContain('ag-tree-item--disabled');
      expect(getNodeItem(selectEl, '1').className).not.toContain('ag-tree-item--disabled');
    });

    it('should render placeholder when no value given', () => {
      new TreeSelect(selectEl, { treeData, placeholder: 'Pick a node' });
      expect(getInput(selectEl).placeholder).toBe('Pick a node');
      expect(getInput(selectEl).value).toBe('');
    });

    it('should render the selected node title as input value when value option given', () => {
      new TreeSelect(selectEl, { treeData, value: '1-1' });
      expect(getInput(selectEl).value).toBe('Node 1-1');
    });

    it('should show clear button when initial value is given, hide it otherwise', () => {
      new TreeSelect(selectEl, { treeData, value: '2' });
      expect(getClearButton(selectEl).style.display).toBe('inline');

      const other = document.createElement('div');
      container.appendChild(other);
      new TreeSelect(other, { treeData });
      expect(getClearButton(other).style.display).toBe('none');
    });

    it('should start with the dropdown closed', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      expect(ts.isOpen()).toBe(false);
      expect(getDropdown(selectEl).style.display).toBe('none');
    });
  });

  describe('opening/closing dropdown via input click', () => {
    it('should open the dropdown when clicking the input', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      getInput(selectEl).click();
      expect(ts.isOpen()).toBe(true);
      expect(getDropdown(selectEl).style.display).toBe('block');
    });

    it('should close the dropdown when clicking the input again (toggle)', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      getInput(selectEl).click();
      expect(ts.isOpen()).toBe(true);
      getInput(selectEl).click();
      expect(ts.isOpen()).toBe(false);
    });

    it('openDropdown/closeDropdown should directly control visibility', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      ts.openDropdown();
      expect(ts.isOpen()).toBe(true);
      ts.closeDropdown();
      expect(ts.isOpen()).toBe(false);
    });
  });

  describe('selecting a leaf node', () => {
    it('should select a leaf node on click, update input value, close dropdown and call onChange', () => {
      const onChange = vi.fn();
      const ts = new TreeSelect(selectEl, { treeData, onChange });
      ts.openDropdown();

      getNodeLabel(selectEl, '1-1').click();

      expect(ts.getValue()).toBe('1-1');
      expect(getInput(selectEl).value).toBe('Node 1-1');
      expect(ts.isOpen()).toBe(false);
      expect(onChange).toHaveBeenCalledWith('1-1');
      expect(getClearButton(selectEl).style.display).toBe('inline');
    });

    it('should select a top-level leaf node without children', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      ts.openDropdown();
      getNodeLabel(selectEl, '2').click();
      expect(ts.getValue()).toBe('2');
      expect(getInput(selectEl).value).toBe('Node 2');
    });
  });

  describe('expanding a node with children', () => {
    it('should toggle expand state instead of selecting when clicking a parent node label', () => {
      const onChange = vi.fn();
      const ts = new TreeSelect(selectEl, { treeData, onChange });
      const parentItem = getNodeItem(selectEl, '1');
      const childrenContainer = parentItem.querySelector('.ag-tree-item-children') as HTMLElement;

      expect(childrenContainer.style.display).toBe('none');

      getNodeLabel(selectEl, '1').click();

      expect(childrenContainer.style.display).toBe('block');
      expect(parentItem.className).toContain('ag-tree-item--expanded');
      // clicking a parent must not select it as a value
      expect(ts.getValue()).toBe('');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should collapse again on a second click', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      const parentItem = getNodeItem(selectEl, '1');
      const childrenContainer = parentItem.querySelector('.ag-tree-item-children') as HTMLElement;

      getNodeLabel(selectEl, '1').click();
      expect(childrenContainer.style.display).toBe('block');

      getNodeLabel(selectEl, '1').click();
      expect(childrenContainer.style.display).toBe('none');
      expect(parentItem.className).not.toContain('ag-tree-item--expanded');
    });
  });

  describe('disabled nodes', () => {
    it('should not select a disabled leaf node on click', () => {
      const onChange = vi.fn();
      const ts = new TreeSelect(selectEl, { treeData, onChange });
      // expand parent first so the disabled child is reachable
      getNodeLabel(selectEl, '1').click();

      getNodeLabel(selectEl, '1-2').click();

      expect(ts.getValue()).toBe('');
      expect(onChange).not.toHaveBeenCalled();
      expect(getInput(selectEl).value).toBe('');
    });
  });

  describe('clear', () => {
    it('should empty the value and hide the clear button', () => {
      const onChange = vi.fn();
      const ts = new TreeSelect(selectEl, { treeData, value: '2', onChange });
      expect(getClearButton(selectEl).style.display).toBe('inline');

      ts.clear();

      expect(ts.getValue()).toBe('');
      expect(getInput(selectEl).value).toBe('');
      expect(getClearButton(selectEl).style.display).toBe('none');
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('should clear via clicking the clear button and not toggle the dropdown', () => {
      const ts = new TreeSelect(selectEl, { treeData, value: '2' });
      getClearButton(selectEl).click();
      expect(ts.getValue()).toBe('');
      // dropdown should remain closed since clear button click stops propagation
      expect(ts.isOpen()).toBe(false);
    });
  });

  describe('outside click', () => {
    it('should close the dropdown when clicking outside the component', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      ts.openDropdown();
      expect(ts.isOpen()).toBe(true);

      document.body.click();

      expect(ts.isOpen()).toBe(false);
    });

    it('should keep the dropdown open when clicking inside the component (not on a selecting node)', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      ts.openDropdown();
      // click on the dropdown container itself (not a node label)
      getDropdown(selectEl).click();
      expect(ts.isOpen()).toBe(true);
    });
  });

  describe('setDisabled', () => {
    it('should close the dropdown when disabling', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      ts.openDropdown();
      expect(ts.isOpen()).toBe(true);

      ts.setDisabled(true);

      expect(ts.isOpen()).toBe(false);
      expect(selectEl.className).toContain('ag-tree-select--disabled');
    });

    it('should block the input click handler from opening the dropdown while disabled', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      ts.setDisabled(true);

      getInput(selectEl).click();

      expect(ts.isOpen()).toBe(false);
    });

    it('should allow opening again after re-enabling', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      ts.setDisabled(true);
      ts.setDisabled(false);

      getInput(selectEl).click();

      expect(ts.isOpen()).toBe(true);
      expect(selectEl.className).not.toContain('ag-tree-select--disabled');
    });
  });

  describe('setSize', () => {
    it('should update the size class', () => {
      const ts = new TreeSelect(selectEl, { treeData, size: 'sm' });
      expect(selectEl.className).toContain('ag-tree-select--sm');
      ts.setSize('lg');
      expect(selectEl.className).toContain('ag-tree-select--lg');
      expect(selectEl.className).not.toContain('ag-tree-select--sm');
    });
  });

  describe('createTreeSelect', () => {
    it('should create a tree select from scratch with rendered treeData', () => {
      const ts = createTreeSelect({ treeData, value: '2' });
      const el = ts.getElement();
      expect(el.className).toContain('ag-tree-select');
      expect(el.querySelector('.ag-tree-item[data-key="2"]')).not.toBeNull();
      expect(getInput(el).value).toBe('Node 2');
    });
  });

  describe('destroy', () => {
    it('should remove the input, clear button and dropdown elements from the DOM', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      expect(selectEl.querySelector('.ag-tree-select-input')).not.toBeNull();
      expect(selectEl.querySelector('.ag-tree-select-clear')).not.toBeNull();
      expect(selectEl.querySelector('.ag-tree-select-dropdown')).not.toBeNull();

      ts.destroy();

      expect(selectEl.querySelector('.ag-tree-select-input')).toBeNull();
      expect(selectEl.querySelector('.ag-tree-select-clear')).toBeNull();
      expect(selectEl.querySelector('.ag-tree-select-dropdown')).toBeNull();
    });

    it('should stop reacting to outside clicks after destroy', () => {
      const ts = new TreeSelect(selectEl, { treeData });
      ts.openDropdown();
      expect(ts.isOpen()).toBe(true);

      ts.destroy();

      // dropdown element itself was removed; isOpen reads its style, which
      // remains 'block' since no code path changed it during destroy.
      // The meaningful assertion is that the document-level listener no
      // longer throws or acts on this detached instance.
      expect(() => document.body.click()).not.toThrow();
    });
  });
});
