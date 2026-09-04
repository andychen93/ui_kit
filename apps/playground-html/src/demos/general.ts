import {
  createButton,
  createInput,
  createCheckbox,
  createRadio,
  createRadioGroup,
  createSelect,
  createSwitch,
  createUpload,
} from '@argon-kit/html';

interface Destroyable {
  destroy?: () => void;
}

/**
 * Mounts a set of general-purpose component demos into `container`.
 *
 * All DOM for this section is built programmatically (no pre-existing
 * markup is relied upon). Every interactive demo writes to a shared
 * "last action" status line so a human tester can see interactivity
 * worked without opening devtools.
 *
 * Returns every created component instance that exposes a `destroy`
 * method, so the caller can clean everything up (e.g. on HMR).
 */
export function mountGeneralDemos(container: HTMLElement): Array<{ destroy?: () => void }> {
  const destroyables: Destroyable[] = [];

  // --- Shared "last action" status line ---
  const statusEl = document.createElement('p');
  statusEl.style.fontWeight = 'bold';
  statusEl.style.padding = '8px 12px';
  statusEl.style.background = '#f5f5f5';
  statusEl.style.border = '1px solid #ddd';
  statusEl.style.borderRadius = '4px';
  statusEl.textContent = 'Last action: (none yet)';
  container.appendChild(statusEl);

  function setStatus(message: string): void {
    console.log(message);
    statusEl.textContent = `Last action: ${message}`;
  }

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
    content.style.flexWrap = 'wrap';
    content.style.gap = '12px';
    content.style.alignItems = 'center';
    section.appendChild(content);

    container.appendChild(section);
    return content;
  }

  // --- Button (multiple variants) ---
  const buttonContent = createSection(
    'Button',
    'Multiple variants. Click any button to log to the console and update the status line above.'
  );
  const buttonVariants: Array<{ variant: 'primary' | 'secondary' | 'success' | 'danger'; label: string }> = [
    { variant: 'primary', label: 'Primary' },
    { variant: 'secondary', label: 'Secondary' },
    { variant: 'success', label: 'Success' },
    { variant: 'danger', label: 'Danger' },
  ];
  buttonVariants.forEach(({ variant, label }) => {
    const button = createButton({
      text: label,
      variant,
      onClick: () => setStatus(`Clicked "${label}" button`),
    });
    buttonContent.appendChild(button.getElement());
    destroyables.push(button);
  });

  // --- Input ---
  const inputContent = createSection(
    'Input',
    'Type in the field below. The status line updates on every change.'
  );
  const input = createInput({
    placeholder: 'Type something...',
    onChange: (value) => setStatus(`Input changed to "${value}"`),
  });
  inputContent.appendChild(input.getElement());
  destroyables.push(input);

  // --- Checkbox ---
  const checkboxContent = createSection(
    'Checkbox',
    'Toggle the checkbox to see the status line update.'
  );
  const checkbox = createCheckbox({
    label: 'Subscribe to newsletter',
    onChange: (checked) => setStatus(`Checkbox is now ${checked ? 'checked' : 'unchecked'}`),
  });
  checkboxContent.appendChild(checkbox.createWithLabel());
  destroyables.push(checkbox);

  // --- Radio + RadioGroup ---
  const radioContent = createSection(
    'Radio & RadioGroup',
    'A standalone Radio plus a full RadioGroup. Selecting an option updates the status line.'
  );

  const standaloneRadio = createRadio({
    name: 'standalone-radio-demo',
    value: 'standalone',
    label: 'Standalone radio (own group)',
    checked: true,
    onChange: (value) => setStatus(`Standalone radio selected: "${value}"`),
  });
  radioContent.appendChild(standaloneRadio.createWithLabel());
  destroyables.push(standaloneRadio);

  const radioGroup = createRadioGroup({
    name: 'radio-group-demo',
    value: 'red',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' },
    ],
    onChange: (value) => setStatus(`RadioGroup selected: "${value}"`),
  });
  radioContent.appendChild(radioGroup.getElement());
  destroyables.push(radioGroup);

  // --- Select ---
  const selectContent = createSection(
    'Select',
    'Choose an option from the dropdown to update the status line.'
  );
  const select = createSelect({
    placeholder: 'Choose a fruit',
    value: '',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' },
    ],
    onChange: (value) => setStatus(`Select changed to "${value}"`),
  });
  selectContent.appendChild(select.getElement());
  destroyables.push(select);

  // --- Switch ---
  const switchContent = createSection(
    'Switch',
    'Flip the switch to see the status line update.'
  );
  const switchInstance = createSwitch({
    checked: false,
    onChange: (checked) => setStatus(`Switch is now ${checked ? 'on' : 'off'}`),
  });
  switchContent.appendChild(switchInstance.getElement());
  destroyables.push(switchInstance);

  // --- Upload ---
  const uploadContent = createSection(
    'Upload',
    'Click or drag files onto the drop zone below. Selected file names appear in the list.'
  );
  const uploadFilesList = document.createElement('ul');
  uploadFilesList.style.margin = '8px 0 0';
  const upload = createUpload({
    multiple: true,
    onUpload: (files) => {
      uploadFilesList.innerHTML = '';
      files.forEach((file) => {
        const item = document.createElement('li');
        item.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        uploadFilesList.appendChild(item);
      });
      setStatus(`Uploaded ${files.length} file(s)`);
    },
  });
  const uploadWrapper = document.createElement('div');
  uploadWrapper.style.width = '100%';
  uploadWrapper.appendChild(upload.getElement());
  uploadWrapper.appendChild(uploadFilesList);
  uploadContent.appendChild(uploadWrapper);
  destroyables.push(upload);

  return destroyables;
}
