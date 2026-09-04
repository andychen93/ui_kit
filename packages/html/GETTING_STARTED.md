# Getting Started with @argon-kit/html

## Installation

```bash
npm install @argon-kit/html @argon-kit/styles
```

## Basic Usage

### Button Component

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@argon-kit/styles/dist/index.css">
</head>
<body>
  <button id="my-button">Click Me</button>

  <script type="module">
    import { Button } from '@argon-kit/html';

    const btn = new Button('#my-button', {
      variant: 'primary',
      size: 'md',
      onClick: (event) => {
        console.log('Button clicked!');
      }
    });

    // Update text
    btn.setText('New Text');

    // Check/set disabled state
    btn.setDisabled(false);

    // Set loading state
    btn.setLoading(true);
  </script>
</body>
</html>
```

### Input Component

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@argon-kit/styles/dist/index.css">
</head>
<body>
  <input id="my-input" type="text" placeholder="Enter something...">

  <script type="module">
    import { Input } from '@argon-kit/html';

    const input = new Input('#my-input', {
      size: 'md',
      onChange: (value) => {
        console.log('Input changed:', value);
      }
    });

    // Get value
    console.log(input.getValue());

    // Set value
    input.setValue('Hello');

    // Set error
    input.setError('This field is required');

    // Clear error
    input.setError(null);
  </script>
</body>
</html>
```

### Form with Validation

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@argon-kit/styles/dist/index.css">
</head>
<body>
  <form>
    <input id="email" type="email" placeholder="Email" required>
    <input id="password" type="password" placeholder="Password" required>
    <button id="submit" type="button">Submit</button>
  </form>

  <script type="module">
    import { Input, Button } from '@argon-kit/html';

    const email = new Input('#email', {
      type: 'email',
      required: true
    });

    const password = new Input('#password', {
      type: 'password',
      required: true
    });

    const submit = new Button('#submit', {
      text: 'Submit',
      onClick: () => {
        // Validate
        if (!email.validate()) {
          email.setError('Invalid email');
          return;
        }

        if (!password.validate()) {
          password.setError('Required');
          return;
        }

        // Submit form
        console.log({
          email: email.getValue(),
          password: password.getValue()
        });
      }
    });
  </script>
</body>
</html>
```

### Checkbox Component

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@argon-kit/styles/dist/index.css">
</head>
<body>
  <input id="agree" type="checkbox">

  <script type="module">
    import { Checkbox } from '@argon-kit/html';

    const checkbox = new Checkbox('#agree', {
      label: 'I agree to terms',
      onChange: (checked) => {
        console.log('Checked:', checked);
      }
    });

    // Create with label
    const wrapper = checkbox.createWithLabel();
    document.body.appendChild(wrapper);

    // Check status
    console.log(checkbox.isChecked());

    // Set checked
    checkbox.setChecked(true);

    // Toggle
    checkbox.toggle();
  </script>
</body>
</html>
```

### Radio Component

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@argon-kit/styles/dist/index.css">
</head>
<body>
  <div id="options"></div>

  <script type="module">
    import { createRadioGroup } from '@argon-kit/html';

    const radioGroup = createRadioGroup({
      name: 'color',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Blue', value: 'blue' }
      ],
      value: 'red',
      onChange: (value) => {
        console.log('Selected:', value);
      }
    });

    document.getElementById('options').appendChild(radioGroup.getElement());

    // Get value
    console.log(radioGroup.getValue());

    // Set value
    radioGroup.setValue('green');
  </script>
</body>
</html>
```

### Select Component

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@argon-kit/styles/dist/index.css">
</head>
<body>
  <select id="my-select"></select>

  <script type="module">
    import { Select } from '@argon-kit/html';

    const select = new Select('#my-select', {
      size: 'md',
      placeholder: 'Choose an option',
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' }
      ],
      onChange: (value) => {
        console.log('Selected:', value);
      }
    });

    // Get value
    console.log(select.getValue());

    // Set value
    select.setValue('2');

    // Add option
    select.addOption({ label: 'Option 4', value: '4' });

    // Remove option
    select.removeOption('4');
  </script>
</body>
</html>
```

## Creating Components from Scratch

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@argon-kit/styles/dist/index.css">
</head>
<body>
  <div id="app"></div>

  <script type="module">
    import { createButton, createInput, createCheckbox } from '@argon-kit/html';

    // Create button from scratch
    const button = createButton({
      text: 'Click Me',
      variant: 'primary',
      size: 'md',
      onClick: () => alert('Clicked!')
    });

    // Create input from scratch
    const input = createInput({
      type: 'text',
      placeholder: 'Enter text',
      size: 'md'
    });

    // Create checkbox from scratch
    const checkbox = createCheckbox({
      label: 'I agree'
    });

    // Append to DOM
    document.getElementById('app').append(
      button.getElement(),
      input.getElement(),
      checkbox.createWithLabel()
    );
  </script>
</body>
</html>
```

## Utilities

### DOM Utilities

```javascript
import {
  getElement,
  createElement,
  addClass,
  removeClass,
  hasClass,
  show,
  hide,
  focus,
  blur
} from '@argon-kit/html';

// Get element
const el = getElement('#my-element');

// Create element
const div = createElement('div', {
  className: 'my-class',
  attributes: { 'data-id': '123' },
  textContent: 'Hello'
});

// Manage classes
addClass(el, 'active');
removeClass(el, 'disabled');
hasClass(el, 'visible');

// Show/hide
show(el);
hide(el);

// Focus/blur
focus(el);
blur(el);
```

### Event Utilities

```javascript
import {
  throttle,
  debounce,
  isEnterKey,
  isEscapeKey,
  preventDefault,
  stopPropagation
} from '@argon-kit/html';

// Throttle function
const handleScroll = throttle(() => {
  console.log('Scrolled');
}, 100);

// Debounce function
const handleSearch = debounce((query) => {
  console.log('Search:', query);
}, 300);

// Check key codes
document.addEventListener('keydown', (e) => {
  if (isEnterKey(e)) {
    console.log('Enter pressed');
  }
  if (isEscapeKey(e)) {
    console.log('Escape pressed');
  }
});

// Prevent default
document.addEventListener('click', (e) => {
  preventDefault(e);
  stopPropagation(e);
});
```

## API Reference

### Button Options

```typescript
interface ButtonOptions {
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  onClick?: (event: MouseEvent) => void;
  className?: string;
}
```

### Input Options

```typescript
interface InputOptions {
  type?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: string;
  value?: string;
  readonly?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  onChange?: (value: string, event: Event) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  className?: string;
}
```

### Component Methods

All components implement these common methods:

```typescript
// Get native element
getElement(): HTMLElement

// Destroy and cleanup
destroy(): void
```

## TypeScript Support

Full TypeScript support with complete type definitions:

```typescript
import { Button, Input, Checkbox, Radio, Select } from '@argon-kit/html';
import type { ButtonOptions, InputOptions } from '@argon-kit/html';

const btn: Button = new Button('#btn', {
  variant: 'primary',
  onClick: (event: MouseEvent) => {
    console.log('Clicked');
  }
});
```

## Testing

Run tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

## Next Steps

- Explore other components in Phase 2 (Form, Modal, Table, etc.)
- Check the component source code in `src/components/`
- Review the tests in `__tests__/` for more examples
- Visit the docs site for live demos
