import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as dom from '../src/utils/dom';

describe('DOM Utilities', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('getValue and setValue', () => {
    describe('Checkbox', () => {
      it('should return null for unchecked checkbox', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = 'test-value';
        container.appendChild(checkbox);

        expect(dom.getValue(checkbox)).toBeNull();
      });

      it('should return value for checked checkbox', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = 'test-value';
        checkbox.checked = true;
        container.appendChild(checkbox);

        expect(dom.getValue(checkbox)).toBe('test-value');
      });

      it('should return "on" for checked checkbox without value', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        container.appendChild(checkbox);

        expect(dom.getValue(checkbox)).toBe('on');
      });

      it('should set checkbox checked state with setValue', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        container.appendChild(checkbox);

        dom.setValue(checkbox, true);
        expect(checkbox.checked).toBe(true);
        expect(dom.getValue(checkbox)).toBe('on');

        dom.setValue(checkbox, false);
        expect(checkbox.checked).toBe(false);
        expect(dom.getValue(checkbox)).toBeNull();
      });
    });

    describe('Radio', () => {
      it('should return null for unchecked radio', () => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.value = 'red';
        container.appendChild(radio);

        expect(dom.getValue(radio)).toBeNull();
      });

      it('should return value for checked radio', () => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.value = 'red';
        radio.checked = true;
        container.appendChild(radio);

        expect(dom.getValue(radio)).toBe('red');
      });

      it('should return "on" for checked radio without value', () => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.checked = true;
        container.appendChild(radio);

        expect(dom.getValue(radio)).toBe('on');
      });

      it('should set radio checked state with setValue', () => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.value = 'blue';
        container.appendChild(radio);

        // setValue for radio compares value string with input.value
        dom.setValue(radio, 'blue');
        expect(radio.checked).toBe(true);
        expect(dom.getValue(radio)).toBe('blue');

        dom.setValue(radio, 'red');
        expect(radio.checked).toBe(false);
        expect(dom.getValue(radio)).toBeNull();
      });
    });

    describe('Text Input', () => {
      it('should get and set text input value', () => {
        const input = document.createElement('input');
        input.type = 'text';
        container.appendChild(input);

        dom.setValue(input, 'hello');
        expect(dom.getValue(input)).toBe('hello');
      });
    });

    describe('Textarea', () => {
      it('should get and set textarea value', () => {
        const textarea = document.createElement('textarea');
        container.appendChild(textarea);

        dom.setValue(textarea, 'some text');
        expect(dom.getValue(textarea)).toBe('some text');
      });
    });

    describe('Select', () => {
      it('should get and set select value', () => {
        const select = document.createElement('select');
        const option1 = document.createElement('option');
        option1.value = 'opt1';
        const option2 = document.createElement('option');
        option2.value = 'opt2';
        select.appendChild(option1);
        select.appendChild(option2);
        container.appendChild(select);

        dom.setValue(select, 'opt2');
        expect(dom.getValue(select)).toBe('opt2');
      });

      it('should get multiple selected values', () => {
        const select = document.createElement('select');
        select.multiple = true;
        const option1 = document.createElement('option');
        option1.value = 'opt1';
        option1.selected = true;
        const option2 = document.createElement('option');
        option2.value = 'opt2';
        option2.selected = true;
        select.appendChild(option1);
        select.appendChild(option2);
        container.appendChild(select);

        const result = dom.getValue(select);
        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual(['opt1', 'opt2']);
      });
    });
  });

  describe('Element manipulation', () => {
    it('should show and hide elements', () => {
      const el = document.createElement('div');
      el.style.display = 'none';
      container.appendChild(el);

      dom.show(el);
      expect(el.style.display).toBe('');

      dom.hide(el);
      expect(el.style.display).toBe('none');
    });

    it('should add and remove classes', () => {
      const el = document.createElement('div');
      container.appendChild(el);

      dom.addClass(el, 'class1', 'class2');
      expect(el.classList.contains('class1')).toBe(true);
      expect(el.classList.contains('class2')).toBe(true);

      dom.removeClass(el, 'class1');
      expect(el.classList.contains('class1')).toBe(false);
      expect(el.classList.contains('class2')).toBe(true);
    });

    it('should toggle classes', () => {
      const el = document.createElement('div');
      container.appendChild(el);

      dom.toggleClass(el, 'active');
      expect(el.classList.contains('active')).toBe(true);

      dom.toggleClass(el, 'active');
      expect(el.classList.contains('active')).toBe(false);
    });
  });

  describe('getElement', () => {
    it('should throw error if selector not found', () => {
      expect(() => dom.getElement('#non-existent')).toThrow('Element not found for selector: #non-existent');
    });

    it('should return element from selector', () => {
      const el = document.createElement('div');
      el.id = 'test-element';
      container.appendChild(el);

      expect(dom.getElement('#test-element')).toBe(el);
    });

    it('should return element directly if passed as parameter', () => {
      const el = document.createElement('div');
      expect(dom.getElement(el)).toBe(el);
    });
  });
});
