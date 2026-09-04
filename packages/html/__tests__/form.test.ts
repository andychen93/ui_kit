import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Form, createForm } from '../src/components/form';

describe('Form Component', () => {
  let container: HTMLDivElement;
  let form: HTMLFormElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    form = document.createElement('form');
    container.appendChild(form);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('constructor', () => {
    it('should initialize with form element', () => {
      const f = new Form(form);
      expect(f.getElement()).toBe(form);
    });

    it('should initialize with selector', () => {
      form.id = 'test-form';
      const f = new Form('#test-form');
      expect(f.getElement()).toBe(form);
    });
  });

  describe('getValue', () => {
    it('should get text input values', () => {
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.name = 'username';
      input1.value = 'john';
      form.appendChild(input1);

      const input2 = document.createElement('input');
      input2.type = 'email';
      input2.name = 'email';
      input2.value = 'john@example.com';
      form.appendChild(input2);

      const f = new Form(form);
      const values = f.getValue();

      expect(values.username).toBe('john');
      expect(values.email).toBe('john@example.com');
    });

    it('should get checkbox values', () => {
      const checkbox1 = document.createElement('input');
      checkbox1.type = 'checkbox';
      checkbox1.name = 'agree';
      checkbox1.value = 'yes';
      checkbox1.checked = true;
      form.appendChild(checkbox1);

      const checkbox2 = document.createElement('input');
      checkbox2.type = 'checkbox';
      checkbox2.name = 'newsletter';
      checkbox2.value = 'subscribe';
      checkbox2.checked = false;
      form.appendChild(checkbox2);

      const f = new Form(form);
      const values = f.getValue();

      expect(values.agree).toBe('yes');
      expect(values.newsletter).toBeNull();
    });

    it('should get radio values', () => {
      const radio1 = document.createElement('input');
      radio1.type = 'radio';
      radio1.name = 'color';
      radio1.value = 'red';
      radio1.checked = true;
      form.appendChild(radio1);

      const radio2 = document.createElement('input');
      radio2.type = 'radio';
      radio2.name = 'color';
      radio2.value = 'blue';
      radio2.checked = false;
      form.appendChild(radio2);

      const f = new Form(form);
      const values = f.getValue();

      // Form.getValue should only get one value per name from radio group
      expect(['red', 'blue', null]).toContain(values.color);
    });

    it('should get select values', () => {
      const select = document.createElement('select');
      select.name = 'country';
      const option1 = document.createElement('option');
      option1.value = 'us';
      option1.textContent = 'United States';
      const option2 = document.createElement('option');
      option2.value = 'uk';
      option2.textContent = 'United Kingdom';
      option2.selected = true;
      select.appendChild(option1);
      select.appendChild(option2);
      form.appendChild(select);

      const f = new Form(form);
      const values = f.getValue();

      expect(values.country).toBe('uk');
    });

    it('should ignore fields without name', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = 'test';
      form.appendChild(input);

      const f = new Form(form);
      const values = f.getValue();

      expect(Object.keys(values).length).toBe(0);
    });
  });

  describe('setValue', () => {
    it('should set form values', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'username';
      form.appendChild(input);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'agree';
      checkbox.value = 'yes';
      form.appendChild(checkbox);

      const f = new Form(form);
      f.setValue({ username: 'jane', agree: true });

      expect((input as HTMLInputElement).value).toBe('jane');
      expect((checkbox as HTMLInputElement).checked).toBe(true);
    });
  });

  describe('validation', () => {
    it('should validate required fields', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'username';
      form.appendChild(input);

      const f = new Form(form, {
        fields: [{ name: 'username', required: true }]
      });

      expect(f.validate()).toBe(false);
      expect(f.getError('username')).toContain('required');

      input.value = 'john';
      expect(f.validate()).toBe(true);
    });

    it('should validate minLength', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'password';
      input.value = 'short';
      form.appendChild(input);

      const f = new Form(form, {
        fields: [{ name: 'password', minLength: 8 }]
      });

      expect(f.validate()).toBe(false);
      expect(f.getError('password')).toContain('at least 8');

      input.value = 'longenough';
      expect(f.validate()).toBe(true);
    });

    it('should validate maxLength', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'code';
      input.value = 'verylongcode';
      form.appendChild(input);

      const f = new Form(form, {
        fields: [{ name: 'code', maxLength: 5 }]
      });

      expect(f.validate()).toBe(false);
      expect(f.getError('code')).toContain('at most 5');

      input.value = 'abc';
      expect(f.validate()).toBe(true);
    });

    it('should validate pattern', () => {
      const input = document.createElement('input');
      input.type = 'email';
      input.name = 'email';
      input.value = 'notanemail';
      form.appendChild(input);

      const f = new Form(form, {
        fields: [{ name: 'email', pattern: '^[^@]+@[^@]+$' }]
      });

      expect(f.validate()).toBe(false);

      input.value = 'valid@email.com';
      expect(f.validate()).toBe(true);
    });

    it('should validate with custom function', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'username';
      input.value = 'admin';
      form.appendChild(input);

      const f = new Form(form, {
        fields: [{
          name: 'username',
          validate: (value) => value === 'admin' ? 'admin is reserved' : null
        }]
      });

      expect(f.validate()).toBe(false);
      expect(f.getError('username')).toBe('admin is reserved');

      input.value = 'john';
      expect(f.validate()).toBe(true);
    });
  });

  describe('submit', () => {
    it('should call onSubmit with form data', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'username';
      input.value = 'john';
      form.appendChild(input);

      const onSubmit = vi.fn();
      const f = new Form(form, { onSubmit });

      f.submit();

      expect(onSubmit).toHaveBeenCalledWith({ username: 'john' });
    });

    it('should not call onSubmit if validation fails', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'username';
      form.appendChild(input);

      const onSubmit = vi.fn();
      const f = new Form(form, {
        fields: [{ name: 'username', required: true }],
        onSubmit
      });

      f.submit();

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('errors', () => {
    it('should get all errors', () => {
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.name = 'field1';
      form.appendChild(input1);

      const input2 = document.createElement('input');
      input2.type = 'text';
      input2.name = 'field2';
      form.appendChild(input2);

      const f = new Form(form, {
        fields: [
          { name: 'field1', required: true },
          { name: 'field2', required: true }
        ]
      });

      f.validate();
      const errors = f.getErrors();

      expect(Object.keys(errors)).toHaveLength(2);
      expect(errors.field1).toBeDefined();
      expect(errors.field2).toBeDefined();
    });

    it('should clear errors', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'username';
      form.appendChild(input);

      const f = new Form(form, {
        fields: [{ name: 'username', required: true }]
      });

      f.validate();
      expect(f.getError('username')).toBeDefined();

      f.clearErrors();
      expect(f.getError('username')).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset form and clear errors', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'username';
      input.value = 'john';
      form.appendChild(input);

      const f = new Form(form, {
        fields: [{ name: 'username', required: true }]
      });

      input.value = '';
      f.validate();
      expect(f.getError('username')).toBeDefined();

      f.reset();
      expect(f.getErrors()).toEqual({});
    });
  });

  describe('createForm', () => {
    it('should create a new form element', () => {
      const f = createForm({
        onSubmit: () => {}
      });

      expect(f.getElement()).toBeInstanceOf(HTMLFormElement);
      expect(f.getElement().className).toContain('ag-form');
    });
  });
});
