import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DatePicker, createDatePicker, DateRangePicker, createDateRangePicker } from '../src/components/datepicker';

describe('DatePicker Component', () => {
  let container: HTMLDivElement;
  let dateInput: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    dateInput = document.createElement('input');
    dateInput.type = 'date';
    container.appendChild(dateInput);
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
  });

  describe('constructor', () => {
    it('should accept HTMLInputElement', () => {
      const datePicker = new DatePicker(dateInput);
      expect(datePicker).toBeDefined();
    });

    it('should accept selector string', () => {
      dateInput.id = 'date-test';
      const datePicker = new DatePicker('#date-test');
      expect(datePicker).toBeDefined();
    });

    it('should accept options', () => {
      const datePicker = new DatePicker(dateInput, {
        value: '2024-01-01',
        min: '2024-01-01',
        max: '2024-12-31',
        onChange: () => {}
      });
      expect(datePicker).toBeDefined();
    });
  });

  describe('API', () => {
    it('should get value', () => {
      dateInput.value = '2024-01-01';
      const datePicker = new DatePicker(dateInput);
      const value = datePicker.getValue();
      expect(value).toBe('2024-01-01');
    });

    it('should set value', () => {
      const datePicker = new DatePicker(dateInput);
      datePicker.setValue('2024-06-15');
      expect(dateInput.value).toBe('2024-06-15');
    });

    it('should get element', () => {
      const datePicker = new DatePicker(dateInput);
      const input = datePicker.getElement();
      expect(input).toBe(dateInput);
    });

    it('should destroy component', () => {
      const datePicker = new DatePicker(dateInput);
      datePicker.destroy();
      // Should not throw
    });
  });

  describe('min/max validation', () => {
    it('should set min date', () => {
      const datePicker = new DatePicker(dateInput, { min: '2024-01-01' });
      expect(datePicker).toBeDefined();
    });

    it('should set max date', () => {
      const datePicker = new DatePicker(dateInput, { max: '2024-12-31' });
      expect(datePicker).toBeDefined();
    });
  });

  describe('onChange callback', () => {
    it('should call onChange when value changes', () => {
      const onChange = vi.fn();
      const datePicker = new DatePicker(dateInput, { onChange });

      dateInput.value = '2024-06-15';
      dateInput.dispatchEvent(new Event('change'));

      expect(onChange).toHaveBeenCalled();
    });
  });
});

describe('DateRangePicker Component', () => {
  let container: HTMLDivElement;
  let startDateInput: HTMLInputElement;
  let endDateInput: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.id = 'start-date';
    container.appendChild(startDateInput);

    endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.id = 'end-date';
    container.appendChild(endDateInput);
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
  });

  describe('constructor', () => {
    it('should accept two HTMLInputElement', () => {
      const dateRangePicker = new DateRangePicker(startDateInput, endDateInput);
      expect(dateRangePicker).toBeDefined();
    });

    it('should accept selector strings', () => {
      const dateRangePicker = new DateRangePicker('#start-date', '#end-date');
      expect(dateRangePicker).toBeDefined();
    });

    it('should accept options', () => {
      const dateRangePicker = new DateRangePicker(startDateInput, endDateInput, {
        startValue: '2024-01-01',
        endValue: '2024-12-31',
        onChange: () => {}
      });
      expect(dateRangePicker).toBeDefined();
    });
  });

  describe('API', () => {
    it('should get start and end values', () => {
      startDateInput.value = '2024-01-01';
      endDateInput.value = '2024-12-31';
      const dateRangePicker = new DateRangePicker(startDateInput, endDateInput);
      const values = dateRangePicker.getValues();
      expect(values[0]).toBe('2024-01-01');
      expect(values[1]).toBe('2024-12-31');
    });

    it('should set values', () => {
      const dateRangePicker = new DateRangePicker(startDateInput, endDateInput);
      dateRangePicker.setValues('2024-06-01', '2024-06-30');
      expect(startDateInput.value).toBe('2024-06-01');
      expect(endDateInput.value).toBe('2024-06-30');
    });

    it('should destroy component', () => {
      const dateRangePicker = new DateRangePicker(startDateInput, endDateInput);
      dateRangePicker.destroy();
      // Should not throw
    });
  });

  describe('onChange callback', () => {
    it('should call onChange with start and end values', () => {
      const onChange = vi.fn();
      const dateRangePicker = new DateRangePicker(startDateInput, endDateInput, { onChange });

      startDateInput.value = '2024-06-01';
      startDateInput.dispatchEvent(new Event('change'));

      expect(onChange).toHaveBeenCalled();
    });
  });
});

describe('Date Picker Factory Functions', () => {
  let container: HTMLDivElement;
  let dateInput: HTMLInputElement;
  let startDateInput: HTMLInputElement;
  let endDateInput: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    dateInput = document.createElement('input');
    dateInput.type = 'date';
    container.appendChild(dateInput);

    startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    container.appendChild(startDateInput);

    endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    container.appendChild(endDateInput);
  });

  afterEach(() => {
    if (container.parentElement) {
      document.body.removeChild(container);
    }
  });

  it('should create DatePicker with createDatePicker', () => {
    const datePicker = createDatePicker(dateInput);
    expect(datePicker).toBeInstanceOf(DatePicker);
    datePicker.destroy();
  });

  it('should create DateRangePicker with createDateRangePicker', () => {
    const dateRangePicker = createDateRangePicker({
      startValue: '2024-01-01',
      endValue: '2024-12-31'
    });
    expect(dateRangePicker).toBeInstanceOf(DateRangePicker);
    dateRangePicker.destroy();
  });
});
