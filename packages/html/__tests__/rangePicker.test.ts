import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  RangePicker,
  createRangePicker,
  DateRangePicker,
  createDateRangePicker,
} from '../src/components/datepicker';

describe('RangePicker Component', () => {
  let container: HTMLDivElement;
  let startDateInput: HTMLInputElement;
  let endDateInput: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.id = 'range-start';
    container.appendChild(startDateInput);

    endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.id = 'range-end';
    container.appendChild(endDateInput);
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
  });

  describe('constructor', () => {
    it('should accept two HTMLInputElement', () => {
      const picker = new RangePicker(startDateInput, endDateInput);
      expect(picker).toBeDefined();
    });

    it('should accept selector strings', () => {
      const picker = new RangePicker('#range-start', '#range-end');
      expect(picker).toBeDefined();
    });

    it('should throw when a selector does not resolve', () => {
      expect(() => new RangePicker('#missing-start', '#range-end')).toThrow();
    });

    it('should apply initial start/end values', () => {
      const picker = new RangePicker(startDateInput, endDateInput, {
        startValue: '2024-01-01',
        endValue: '2024-12-31',
      });
      expect(picker.getValues()).toEqual(['2024-01-01', '2024-12-31']);
    });
  });

  describe('getValues / setValues', () => {
    it('should read current start/end values', () => {
      startDateInput.value = '2024-02-01';
      endDateInput.value = '2024-02-28';
      const picker = new RangePicker(startDateInput, endDateInput);
      expect(picker.getValues()).toEqual(['2024-02-01', '2024-02-28']);
    });

    it('should update both inputs via setValues', () => {
      const picker = new RangePicker(startDateInput, endDateInput);
      picker.setValues('2024-06-01', '2024-06-30');
      expect(startDateInput.value).toBe('2024-06-01');
      expect(endDateInput.value).toBe('2024-06-30');
    });
  });

  describe('onChange', () => {
    it('should fire when the start input changes', () => {
      const onChange = vi.fn();
      new RangePicker(startDateInput, endDateInput, { onChange });

      startDateInput.value = '2024-06-01';
      startDateInput.dispatchEvent(new Event('change'));

      expect(onChange).toHaveBeenCalledWith(
        ['2024-06-01', ''],
        expect.any(Event)
      );
    });

    it('should fire when the end input changes', () => {
      const onChange = vi.fn();
      new RangePicker(startDateInput, endDateInput, { onChange });

      endDateInput.value = '2024-06-30';
      endDateInput.dispatchEvent(new Event('change'));

      expect(onChange).toHaveBeenCalledWith(
        ['', '2024-06-30'],
        expect.any(Event)
      );
    });

    it('should not fire after destroy', () => {
      const onChange = vi.fn();
      const picker = new RangePicker(startDateInput, endDateInput, { onChange });
      picker.destroy();

      startDateInput.value = '2024-06-01';
      startDateInput.dispatchEvent(new Event('change'));

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('getElements', () => {
    it('should return both native inputs', () => {
      const picker = new RangePicker(startDateInput, endDateInput);
      const [start, end] = picker.getElements();
      expect(start).toBe(startDateInput);
      expect(end).toBe(endDateInput);
    });
  });

  describe('createRangePicker', () => {
    it('should create a RangePicker with two generated inputs', () => {
      const picker = createRangePicker({ startValue: '2024-01-01', endValue: '2024-12-31' });
      expect(picker).toBeInstanceOf(RangePicker);
      expect(picker.getValues()).toEqual(['2024-01-01', '2024-12-31']);
      picker.destroy();
    });
  });

  describe('DateRangePicker compatibility alias', () => {
    it('should be the same class as RangePicker', () => {
      expect(DateRangePicker).toBe(RangePicker);
    });

    it('should be the same factory as createRangePicker', () => {
      expect(createDateRangePicker).toBe(createRangePicker);
    });
  });
});
