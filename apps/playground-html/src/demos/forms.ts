import {
  createPassword,
  createTextarea,
  createInputNumber,
  createRangePicker,
  Form,
  createFormItem,
} from '@argon-kit/html';

interface Destroyable {
  destroy?: () => void;
}

/**
 * Mounts a set of form-component demos into `container`.
 *
 * All DOM for this section is built programmatically (no pre-existing
 * markup is relied upon). Each demo writes to a visible readout so a
 * human tester can confirm interactivity without opening devtools.
 *
 * Returns every created component instance that exposes a `destroy`
 * method, so the caller can clean everything up (e.g. on HMR).
 */
export function mountFormsDemos(container: HTMLElement): Array<{ destroy?: () => void }> {
  const destroyables: Destroyable[] = [];

  function createSection(title: string, description: string): HTMLElement {
    const section = document.createElement('section');
    section.style.marginBottom = '24px';

    const heading = document.createElement('h3');
    heading.textContent = title;
    section.appendChild(heading);

    const desc = document.createElement('p');
    desc.textContent = description;
    desc.style.color = '#666';
    desc.style.marginTop = '0';
    section.appendChild(desc);

    const content = document.createElement('div');
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.gap = '8px';
    content.style.alignItems = 'flex-start';
    section.appendChild(content);

    container.appendChild(section);
    return content;
  }

  function createReadout(): HTMLParagraphElement {
    const readout = document.createElement('p');
    readout.style.fontWeight = 'bold';
    readout.style.padding = '6px 10px';
    readout.style.background = '#f5f5f5';
    readout.style.border = '1px solid #ddd';
    readout.style.borderRadius = '4px';
    readout.style.margin = '0';
    return readout;
  }

  // --- Password ---
  const passwordContent = createSection(
    'Password',
    'Type a value and use the toggle button to reveal/hide it. The readout below shows the current value.'
  );
  const passwordReadout = createReadout();
  passwordReadout.textContent = 'Value: (empty)';
  const password = createPassword({
    placeholder: 'Enter password',
    toggleVisible: true,
    onChange: (value) => {
      passwordReadout.textContent = `Value: ${value || '(empty)'}`;
    },
  });
  passwordContent.appendChild(password.getElement());
  passwordContent.appendChild(passwordReadout);
  destroyables.push(password);

  // --- Textarea ---
  const textareaContent = createSection(
    'Textarea',
    'Type in the textarea below. The readout reflects the current value and character count on every change.'
  );
  const textareaReadout = createReadout();
  textareaReadout.textContent = 'Value: (empty) — 0 characters';
  const textarea = createTextarea({
    placeholder: 'Type a longer message...',
    rows: 4,
    onChange: (value) => {
      textareaReadout.textContent = `Value: ${value || '(empty)'} — ${value.length} characters`;
    },
  });
  textareaContent.appendChild(textarea.getElement());
  textareaContent.appendChild(textareaReadout);
  destroyables.push(textarea);

  // --- InputNumber ---
  const inputNumberContent = createSection(
    'InputNumber',
    'Use the increment/decrement buttons or type directly. The readout shows the current numeric value.'
  );
  const inputNumberReadout = createReadout();
  inputNumberReadout.textContent = 'Value: 0';
  const inputNumber = createInputNumber({
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    onChange: (value) => {
      inputNumberReadout.textContent = `Value: ${value}`;
    },
  });
  inputNumberContent.appendChild(inputNumber.getElement());
  inputNumberContent.appendChild(inputNumberReadout);
  destroyables.push(inputNumber);

  // --- RangePicker ---
  const rangePickerContent = createSection(
    'RangePicker',
    'Pick a start and end date. The readout shows the currently selected range.'
  );
  const rangePickerReadout = createReadout();
  rangePickerReadout.textContent = 'Range: (none) to (none)';
  const rangePicker = createRangePicker({
    onChange: ([start, end]) => {
      rangePickerReadout.textContent = `Range: ${start || '(none)'} to ${end || '(none)'}`;
    },
  });
  const rangePickerRow = document.createElement('div');
  rangePickerRow.style.display = 'flex';
  rangePickerRow.style.gap = '8px';
  rangePickerRow.style.alignItems = 'center';
  const [startEl, endEl] = rangePicker.getElements();
  rangePickerRow.appendChild(startEl);
  const toLabel = document.createElement('span');
  toLabel.textContent = 'to';
  rangePickerRow.appendChild(toLabel);
  rangePickerRow.appendChild(endEl);
  rangePickerContent.appendChild(rangePickerRow);
  rangePickerContent.appendChild(rangePickerReadout);
  destroyables.push(rangePicker);

  // --- Form + FormItem ---
  const formContent = createSection(
    'Form & FormItem',
    'A real form with two FormItem-bound fields (username is required, min length 3; email is required and must match a basic email pattern). ' +
      'Type and submit to see validation errors appear/disappear live.'
  );

  const formEl = document.createElement('form');
  formEl.style.display = 'flex';
  formEl.style.flexDirection = 'column';
  formEl.style.gap = '4px';
  formEl.style.width = '320px';
  formContent.appendChild(formEl);

  const form = new Form(formEl, {
    fields: [
      { name: 'username', required: true, minLength: 3 },
      { name: 'email', required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
    ],
    onSubmit: (data) => {
      submittedReadout.textContent = `Submitted values: ${JSON.stringify(data)}`;
    },
  });
  destroyables.push(form);

  const usernameItem = createFormItem({
    label: 'Username',
    name: 'username',
    required: true,
    help: 'At least 3 characters.',
    form,
  });
  formEl.appendChild(usernameItem.getElement());
  destroyables.push(usernameItem);

  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.name = 'username';
  usernameInput.className = 'ag-input';
  usernameInput.placeholder = 'Username (min 3 chars)';
  usernameItem.appendControl(usernameInput);

  const emailItem = createFormItem({
    label: 'Email',
    name: 'email',
    required: true,
    help: 'e.g. name@example.com',
    form,
  });
  formEl.appendChild(emailItem.getElement());
  destroyables.push(emailItem);

  const emailInput = document.createElement('input');
  emailInput.type = 'text';
  emailInput.name = 'email';
  emailInput.className = 'ag-input';
  emailInput.placeholder = 'Email address';
  emailItem.appendControl(emailInput);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit';
  submitButton.style.marginTop = '8px';
  submitButton.style.alignSelf = 'flex-start';
  formEl.appendChild(submitButton);

  const submittedReadout = createReadout();
  submittedReadout.textContent = 'Submitted values: (none yet)';
  formContent.appendChild(submittedReadout);

  return destroyables;
}
