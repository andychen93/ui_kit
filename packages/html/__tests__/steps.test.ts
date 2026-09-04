import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Steps, createSteps } from '../src/components/steps';

function makeStepItem(): HTMLDivElement {
  const item = document.createElement('div');
  item.className = 'ag-step-item';
  const icon = document.createElement('div');
  icon.className = 'ag-step-icon';
  item.appendChild(icon);
  const content = document.createElement('div');
  content.className = 'ag-step-content';
  item.appendChild(content);
  return item;
}

describe('Steps Component', () => {
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

  describe('constructor', () => {
    it('should initialize with element reference', () => {
      const steps = new Steps(rootEl);
      expect(steps.getElement()).toBe(rootEl);
    });

    it('should initialize with selector string', () => {
      rootEl.id = 'test-steps';
      const steps = new Steps('#test-steps');
      expect(steps.getElement()).toBe(rootEl);
    });

    it('should throw for a selector that does not exist', () => {
      expect(() => new Steps('#missing-steps')).toThrow(
        'Element not found for selector: #missing-steps'
      );
    });
  });

  describe('initial render', () => {
    it('should apply base/size/direction classes from options', () => {
      const steps = new Steps(rootEl, { size: 'lg', direction: 'vertical' });
      expect(rootEl.className).toContain('ag-steps');
      expect(rootEl.className).toContain('ag-steps--lg');
      expect(rootEl.className).toContain('ag-steps--vertical');
      expect(rootEl.className).not.toContain('ag-steps--horizontal');
    });

    it('should default to horizontal direction', () => {
      const steps = new Steps(rootEl);
      expect(rootEl.className).toContain('ag-steps--horizontal');
    });

    it('should classify pre-existing step items by current index on construction', () => {
      const item0 = makeStepItem();
      const item1 = makeStepItem();
      const item2 = makeStepItem();
      rootEl.appendChild(item0);
      rootEl.appendChild(item1);
      rootEl.appendChild(item2);

      const steps = new Steps(rootEl, { current: 1 });

      expect(item0.classList.contains('ag-step-item--finish')).toBe(true);
      expect(item1.classList.contains('ag-step-item--process')).toBe(true);
      expect(item2.classList.contains('ag-step-item--wait')).toBe(true);

      // finish renders a checkmark icon (svg), process/wait render the number
      const icon0 = item0.querySelector('.ag-step-icon') as HTMLElement;
      const icon1 = item1.querySelector('.ag-step-icon') as HTMLElement;
      const icon2 = item2.querySelector('.ag-step-icon') as HTMLElement;
      expect(icon0.innerHTML).toContain('<svg');
      expect(icon1.textContent).toBe('2');
      expect(icon2.textContent).toBe('3');
    });

    it('should respect an explicit status override for the current item', () => {
      const item0 = makeStepItem();
      const item1 = makeStepItem();
      rootEl.appendChild(item0);
      rootEl.appendChild(item1);

      const steps = new Steps(rootEl, { current: 1, status: 'error' });

      expect(item1.classList.contains('ag-step-item--error')).toBe(true);
      const icon1 = item1.querySelector('.ag-step-icon') as HTMLElement;
      expect(icon1.innerHTML).toContain('<svg');
    });
  });

  describe('addItem', () => {
    it('should append a step item with title and description', () => {
      const steps = new Steps(rootEl);
      const item = steps.addItem({ title: 'Step One', description: 'First step' });

      expect(rootEl.contains(item)).toBe(true);
      expect(item.querySelector('.ag-step-title')?.textContent).toBe('Step One');
      expect(item.querySelector('.ag-step-description')?.textContent).toBe('First step');
      expect(steps.getItems()).toContain(item);
    });

    it('should number the icon according to insertion order', () => {
      const steps = new Steps(rootEl);
      const first = steps.addItem({ title: 'A' });
      const second = steps.addItem({ title: 'B' });

      expect(first.querySelector('.ag-step-icon')?.textContent).toBe('1');
      expect(second.querySelector('.ag-step-icon')?.textContent).toBe('2');
    });

    it('should omit title/description elements when not provided', () => {
      const steps = new Steps(rootEl);
      const item = steps.addItem({});
      expect(item.querySelector('.ag-step-title')).toBeNull();
      expect(item.querySelector('.ag-step-description')).toBeNull();
    });
  });

  describe('setCurrent', () => {
    it('should mark earlier items finish, the current item process, and later items wait', () => {
      const steps = new Steps(rootEl);
      steps.addItem({ title: 'A' });
      steps.addItem({ title: 'B' });
      steps.addItem({ title: 'C' });

      steps.setCurrent(1);

      const items = steps.getItems();
      expect(items[0].classList.contains('ag-step-item--finish')).toBe(true);
      expect(items[1].classList.contains('ag-step-item--process')).toBe(true);
      expect(items[2].classList.contains('ag-step-item--wait')).toBe(true);
    });

    it('should treat index 0 as the first boundary (nothing finished yet)', () => {
      const steps = new Steps(rootEl);
      steps.addItem({ title: 'A' });
      steps.addItem({ title: 'B' });

      steps.setCurrent(0);

      const items = steps.getItems();
      expect(items[0].classList.contains('ag-step-item--process')).toBe(true);
      expect(items[1].classList.contains('ag-step-item--wait')).toBe(true);
    });

    it('should finish every item when current is beyond the last index', () => {
      const steps = new Steps(rootEl);
      steps.addItem({ title: 'A' });
      steps.addItem({ title: 'B' });

      steps.setCurrent(5);

      const items = steps.getItems();
      expect(items[0].classList.contains('ag-step-item--finish')).toBe(true);
      expect(items[1].classList.contains('ag-step-item--finish')).toBe(true);
    });

    it('should update the icon svg/number when the current step changes', () => {
      const steps = new Steps(rootEl);
      const item = steps.addItem({ title: 'A' });
      const icon = item.querySelector('.ag-step-icon') as HTMLElement;
      expect(icon.textContent).toBe('1');

      steps.setCurrent(1); // item at index 0 becomes "finish"
      expect(icon.innerHTML).toContain('<svg');
    });
  });

  describe('setDirection', () => {
    it('should switch direction classes', () => {
      const steps = new Steps(rootEl, { direction: 'horizontal' });
      steps.setDirection('vertical');
      expect(rootEl.className).toContain('ag-steps--vertical');
      expect(rootEl.className).not.toContain('ag-steps--horizontal');
    });
  });

  describe('setStatus', () => {
    it('should apply the status to the current step item', () => {
      const steps = new Steps(rootEl);
      steps.addItem({ title: 'A' });
      steps.addItem({ title: 'B' });
      steps.setCurrent(1);

      steps.setStatus('error');

      const items = steps.getItems();
      expect(items[1].classList.contains('ag-step-item--error')).toBe(true);
    });
  });

  describe('destroy', () => {
    it('should remove all step item elements from the DOM', () => {
      const steps = new Steps(rootEl);
      const item = steps.addItem({ title: 'A' });
      expect(rootEl.contains(item)).toBe(true);

      steps.destroy();

      expect(rootEl.contains(item)).toBe(false);
      expect(steps.getItems()).toEqual([]);
    });
  });

  describe('createSteps', () => {
    it('should create a steps element from scratch', () => {
      const steps = createSteps({ current: 0 });
      expect(steps.getElement().className).toContain('ag-steps');
      expect(steps.getElement().tagName).toBe('DIV');
    });

    it('should support adding items to a freshly created steps instance', () => {
      const steps = createSteps();
      const item = steps.addItem({ title: 'Only step' });
      expect(steps.getElement().contains(item)).toBe(true);
    });
  });
});
