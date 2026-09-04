import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Transfer, createTransfer, TransferItem } from '../src/components/transfer';

describe('Transfer Component', () => {
  let container: HTMLDivElement;
  let transferEl: HTMLDivElement;

  const sampleData: TransferItem[] = [
    { key: 'a', title: 'Item A' },
    { key: 'b', title: 'Item B' },
    { key: 'c', title: 'Item C', disabled: true },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    transferEl = document.createElement('div');
    container.appendChild(transferEl);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function getRow(el: HTMLElement, list: HTMLElement, key: string): HTMLElement {
    const row = list.querySelector(`.ag-transfer-item[data-key="${key}"]`);
    if (!row) throw new Error(`row not found for key ${key}`);
    return row as HTMLElement;
  }

  function getSourceList(t: Transfer): HTMLElement {
    return t.getElement().querySelector('.ag-transfer-list--source') as HTMLElement;
  }

  function getTargetList(t: Transfer): HTMLElement {
    return t.getElement().querySelector('.ag-transfer-list--target') as HTMLElement;
  }

  function getMoveRightButton(t: Transfer): HTMLButtonElement {
    const buttons = t.getElement().querySelectorAll('.ag-transfer-buttons button');
    return buttons[0] as HTMLButtonElement;
  }

  function getMoveLeftButton(t: Transfer): HTMLButtonElement {
    const buttons = t.getElement().querySelectorAll('.ag-transfer-buttons button');
    return buttons[1] as HTMLButtonElement;
  }

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const transfer = new Transfer(transferEl);
      expect(transfer.getElement()).toBe(transferEl);
    });

    it('should initialize with selector', () => {
      transferEl.id = 'test-transfer';
      const transfer = new Transfer('#test-transfer');
      expect(transfer.getElement()).toBe(transferEl);
    });

    it('should throw error if selector not found', () => {
      expect(() => new Transfer('#non-existent')).toThrow(
        'Element not found for selector: #non-existent'
      );
    });
  });

  describe('initial render', () => {
    it('should render header titles and two empty lists when no dataSource given', () => {
      const transfer = new Transfer(transferEl);
      const titles = transferEl.querySelectorAll('.ag-transfer-title');
      expect(titles[0].textContent).toBe('Available');
      expect(titles[1].textContent).toBe('Selected');
      expect(getSourceList(transfer).children.length).toBe(0);
      expect(getTargetList(transfer).children.length).toBe(0);
    });

    it('should render move-left and move-right buttons', () => {
      const transfer = new Transfer(transferEl);
      expect(getMoveRightButton(transfer).textContent).toBe('\u2192');
      expect(getMoveLeftButton(transfer).textContent).toBe('\u2190');
    });
  });

  describe('setDataSource', () => {
    it('should populate source list with all items when no targetKeys given', () => {
      const transfer = new Transfer(transferEl);
      transfer.setDataSource(sampleData);
      expect(transfer.getSourceKeys()).toEqual(['a', 'b', 'c']);
      expect(transfer.getTargetKeys()).toEqual([]);
      expect(getSourceList(transfer).children.length).toBe(3);
      expect(getTargetList(transfer).children.length).toBe(0);
    });

    it('should distribute items between source and target according to targetKeys', () => {
      const transfer = new Transfer(transferEl);
      transfer.setDataSource(sampleData, ['b']);
      expect(transfer.getSourceKeys()).toEqual(['a', 'c']);
      expect(transfer.getTargetKeys()).toEqual(['b']);
      expect(getSourceList(transfer).children.length).toBe(2);
      expect(getTargetList(transfer).children.length).toBe(1);
      expect(getRow(transfer.getElement(), getTargetList(transfer), 'b').querySelector('.ag-transfer-label')?.textContent).toBe('Item B');
    });

    it('should mark disabled items with the disabled class and disabled checkbox', () => {
      const transfer = new Transfer(transferEl);
      transfer.setDataSource(sampleData);
      const rowC = getRow(transfer.getElement(), getSourceList(transfer), 'c');
      expect(rowC.className).toContain('ag-transfer-item--disabled');
      const checkboxC = rowC.querySelector('.ag-transfer-checkbox') as HTMLInputElement;
      expect(checkboxC.disabled).toBe(true);
    });

    it('should clear previous rows when called again', () => {
      const transfer = new Transfer(transferEl);
      transfer.setDataSource(sampleData, ['b']);
      transfer.setDataSource([{ key: 'x', title: 'Only X' }]);
      expect(transfer.getSourceKeys()).toEqual(['x']);
      expect(transfer.getTargetKeys()).toEqual([]);
      expect(getSourceList(transfer).children.length).toBe(1);
      expect(getTargetList(transfer).children.length).toBe(0);
    });
  });

  describe('checking items and moving via checkbox click', () => {
    it('should check a source item by clicking its checkbox, then move it right and fire onChange', () => {
      const onChange = vi.fn();
      const transfer = new Transfer(transferEl, { dataSource: sampleData, onChange });

      const rowA = getRow(transfer.getElement(), getSourceList(transfer), 'a');
      const checkboxA = rowA.querySelector('.ag-transfer-checkbox') as HTMLInputElement;

      checkboxA.click();
      expect(checkboxA.checked).toBe(true);
      expect(rowA.className).toContain('ag-transfer-item--checked');

      getMoveRightButton(transfer).click();

      expect(transfer.getTargetKeys()).toEqual(['a']);
      expect(transfer.getSourceKeys()).toEqual(['b', 'c']);
      expect(onChange).toHaveBeenCalledWith(['a']);
      expect(getTargetList(transfer).contains(rowA)).toBe(true);
      expect(getSourceList(transfer).contains(rowA)).toBe(false);
      // checkbox unchecked after moving
      expect(checkboxA.checked).toBe(false);
      expect(rowA.className).not.toContain('ag-transfer-item--checked');
    });
  });

  describe('checking items and moving via row click', () => {
    it('should check a source item by clicking its label (not the checkbox), then move it right', () => {
      const onChange = vi.fn();
      const transfer = new Transfer(transferEl, { dataSource: sampleData, onChange });

      const rowB = getRow(transfer.getElement(), getSourceList(transfer), 'b');
      const label = rowB.querySelector('.ag-transfer-label') as HTMLElement;
      const checkboxB = rowB.querySelector('.ag-transfer-checkbox') as HTMLInputElement;

      label.click();
      expect(checkboxB.checked).toBe(true);
      expect(rowB.className).toContain('ag-transfer-item--checked');

      getMoveRightButton(transfer).click();

      expect(transfer.getTargetKeys()).toEqual(['b']);
      expect(onChange).toHaveBeenCalledWith(['b']);
    });

    it('should not fire onChange when clicking move-right with nothing checked', () => {
      const onChange = vi.fn();
      const transfer = new Transfer(transferEl, { dataSource: sampleData, onChange });
      getMoveRightButton(transfer).click();
      expect(onChange).not.toHaveBeenCalled();
      expect(transfer.getTargetKeys()).toEqual([]);
    });
  });

  describe('moving back from target to source', () => {
    it('should check a target item and move it back to source via move-left button', () => {
      const onChange = vi.fn();
      const transfer = new Transfer(transferEl, { dataSource: sampleData, targetKeys: ['a'], onChange });

      const rowA = getRow(transfer.getElement(), getTargetList(transfer), 'a');
      const checkboxA = rowA.querySelector('.ag-transfer-checkbox') as HTMLInputElement;

      checkboxA.click();
      expect(checkboxA.checked).toBe(true);

      getMoveLeftButton(transfer).click();

      expect(transfer.getSourceKeys()).toContain('a');
      expect(transfer.getTargetKeys()).toEqual([]);
      expect(onChange).toHaveBeenCalledWith([]);
      expect(getSourceList(transfer).contains(rowA)).toBe(true);
      expect(getTargetList(transfer).contains(rowA)).toBe(false);
    });
  });

  describe('disabled items', () => {
    it('should not toggle a disabled row when its label is clicked', () => {
      const transfer = new Transfer(transferEl, { dataSource: sampleData });
      const rowC = getRow(transfer.getElement(), getSourceList(transfer), 'c');
      const label = rowC.querySelector('.ag-transfer-label') as HTMLElement;
      const checkboxC = rowC.querySelector('.ag-transfer-checkbox') as HTMLInputElement;

      label.click();

      expect(checkboxC.checked).toBe(false);
      expect(rowC.className).not.toContain('ag-transfer-item--checked');
    });

    it('should not move an item that becomes disabled after being checked', () => {
      const onChange = vi.fn();
      const transfer = new Transfer(transferEl, { dataSource: sampleData, onChange });

      const rowA = getRow(transfer.getElement(), getSourceList(transfer), 'a');
      const checkboxA = rowA.querySelector('.ag-transfer-checkbox') as HTMLInputElement;
      checkboxA.click();
      expect(checkboxA.checked).toBe(true);

      transfer.setItemDisabled('a', true);

      getMoveRightButton(transfer).click();

      // moveChecked filters out disabled items even if checked, so nothing moves
      expect(transfer.getSourceKeys()).toContain('a');
      expect(transfer.getTargetKeys()).toEqual([]);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('setItemDisabled', () => {
    it('should mark an item disabled: add class and disable its checkbox', () => {
      const transfer = new Transfer(transferEl, { dataSource: sampleData });
      const rowA = getRow(transfer.getElement(), getSourceList(transfer), 'a');
      const checkboxA = rowA.querySelector('.ag-transfer-checkbox') as HTMLInputElement;

      expect(checkboxA.disabled).toBe(false);
      transfer.setItemDisabled('a', true);
      expect(rowA.className).toContain('ag-transfer-item--disabled');
      expect(checkboxA.disabled).toBe(true);
    });

    it('should re-enable a disabled item', () => {
      const transfer = new Transfer(transferEl, { dataSource: sampleData });
      const rowC = getRow(transfer.getElement(), getSourceList(transfer), 'c');
      const checkboxC = rowC.querySelector('.ag-transfer-checkbox') as HTMLInputElement;

      transfer.setItemDisabled('c', false);
      expect(rowC.className).not.toContain('ag-transfer-item--disabled');
      expect(checkboxC.disabled).toBe(false);

      // now that it's enabled, clicking its label should be able to check it
      const label = rowC.querySelector('.ag-transfer-label') as HTMLElement;
      label.click();
      expect(checkboxC.checked).toBe(true);
    });

    it('should do nothing when key does not exist', () => {
      const transfer = new Transfer(transferEl, { dataSource: sampleData });
      expect(() => transfer.setItemDisabled('does-not-exist', true)).not.toThrow();
    });
  });

  describe('getTargetKeys / getSourceKeys', () => {
    it('should reflect current membership accurately', () => {
      const transfer = new Transfer(transferEl, { dataSource: sampleData, targetKeys: ['b', 'c'] });
      expect(transfer.getTargetKeys().sort()).toEqual(['b', 'c']);
      expect(transfer.getSourceKeys()).toEqual(['a']);
    });
  });

  describe('createTransfer', () => {
    it('should create a transfer component from scratch with rendered data', () => {
      const transfer = createTransfer({ dataSource: sampleData, targetKeys: ['a'] });
      const el = transfer.getElement();
      expect(el.className).toContain('ag-transfer');
      expect(transfer.getTargetKeys()).toEqual(['a']);
      expect(transfer.getSourceKeys()).toEqual(['b', 'c']);
    });
  });

  describe('destroy', () => {
    it('should remove all item rows from both lists', () => {
      const transfer = new Transfer(transferEl, { dataSource: sampleData, targetKeys: ['a'] });
      expect(getSourceList(transfer).children.length).toBeGreaterThan(0);
      expect(getTargetList(transfer).children.length).toBeGreaterThan(0);

      transfer.destroy();

      expect(getSourceList(transfer).children.length).toBe(0);
      expect(getTargetList(transfer).children.length).toBe(0);
      expect(transfer.getSourceKeys()).toEqual([]);
      expect(transfer.getTargetKeys()).toEqual([]);
    });

    it('should stop firing onChange after destroy since listeners are removed', () => {
      const onChange = vi.fn();
      const transfer = new Transfer(transferEl, { dataSource: sampleData, onChange });
      const rowA = getRow(transfer.getElement(), getSourceList(transfer), 'a');
      const checkboxA = rowA.querySelector('.ag-transfer-checkbox') as HTMLInputElement;

      transfer.destroy();

      // Row elements were removed by destroy, but the button is untouched;
      // clicking it post-destroy must not throw and must not call onChange
      // since the button's click listener was removed via eventManager.
      expect(() => getMoveRightButton(transfer).click()).not.toThrow();
      expect(onChange).not.toHaveBeenCalled();

      // The checkbox click listener on the (now empty) source list container
      // should also be gone; clicking the detached row must not throw.
      expect(() => checkboxA.click()).not.toThrow();
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
