import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Tree, createTree } from '../src/components/dropdown';

describe('Tree Component', () => {
  let container: HTMLDivElement;
  let ulElement: HTMLUListElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    ulElement = document.createElement('ul');
    container.appendChild(ulElement);
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
  });

  describe('constructor', () => {
    it('should accept HTMLUListElement', () => {
      const tree = new Tree(ulElement, { data: [] });
      expect(tree).toBeDefined();
    });

    it('should accept selector string', () => {
      ulElement.id = 'tree-test';
      const tree = new Tree('#tree-test', { data: [] });
      expect(tree).toBeDefined();
    });

    it('should apply ag-tree class', () => {
      const tree = new Tree(ulElement, { data: [] });
      expect(tree.getElement().className).toContain('ag-tree');
    });
  });

  describe('renderTree', () => {
    it('should render root nodes', () => {
      const tree = new Tree(ulElement, {
        data: [
          { label: 'Node 1', value: 'node1' },
          { label: 'Node 2', value: 'node2' }
        ]
      });

      const nodes = tree.getElement().querySelectorAll('.ag-tree__node');
      expect(nodes.length).toBe(2);
    });

    it('should render nodes with label and value', () => {
      const tree = new Tree(ulElement, {
        data: [{ label: 'My Node', value: 'my-node' }]
      });

      const label = tree.getElement().querySelector('.ag-tree__label');
      expect(label?.textContent).toBe('My Node');
    });

    it('should show toggle for nodes with children', () => {
      const tree = new Tree(ulElement, {
        data: [
          {
            label: 'Parent',
            children: [{ label: 'Child', value: 'child' }]
          }
        ]
      });

      const toggle = tree.getElement().querySelector('.ag-tree__toggle');
      expect(toggle).toBeDefined();
    });

    it('should not show toggle for leaf nodes', () => {
      const tree = new Tree(ulElement, {
        data: [{ label: 'Leaf', value: 'leaf' }]
      });

      const toggle = tree.getElement().querySelector('.ag-tree__toggle');
      expect(toggle).toBeNull();
    });
  });

  describe('disabled nodes', () => {
    it('should render disabled nodes', () => {
      const tree = new Tree(ulElement, {
        data: [
          { label: 'Node 1', value: 'node1' },
          { label: 'Node 2 (Disabled)', value: 'node2', disabled: true }
        ]
      });

      const allLabels = tree.getElement().querySelectorAll('.ag-tree__label');
      expect(allLabels.length).toBe(2);
      
      let foundDisabled = false;
      allLabels.forEach(label => {
        if (label.textContent?.includes('Node 2 (Disabled)')) {
          foundDisabled = true;
        }
      });
      expect(foundDisabled).toBe(true);
    });
  });

  describe('onChange callback', () => {
    it('should call onChange with node value', () => {
      const onChange = vi.fn();
      const tree = new Tree(ulElement, {
        data: [{ label: 'Node', value: 'node' }],
        onChange
      });

      const label = tree.getElement().querySelector('.ag-tree__label') as HTMLElement;
      label.click();

      expect(onChange).toHaveBeenCalledWith('node', expect.any(Event));
    });
  });

  describe('destroy', () => {
    it('should clean up event listeners', () => {
      const tree = new Tree(ulElement, {
        data: [{ label: 'Node', value: 'node' }]
      });

      tree.destroy();
      // Should not throw
    });
  });

  describe('createTree factory', () => {
    it('should create tree with ul element', () => {
      const tree = createTree({ data: [] });
      expect(tree).toBeInstanceOf(Tree);
      expect(tree.getElement().tagName).toBe('UL');

      tree.destroy();
    });
  });
});
