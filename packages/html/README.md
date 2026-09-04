# @argon-kit/html

Pure HTML/CSS/JavaScript implementation of Argon UI Kit components. Zero framework dependencies.

## Features

- 🎨 Shares the same design system as React/Vue/Svelte versions
- 📦 Zero dependencies (except @argon-kit/styles)
- 🚀 Vanilla JavaScript - works in any environment
- 📝 Full TypeScript support
- ✨ Class-based API, easy to integrate

## Installation

```bash
npm install @argon-kit/html @argon-kit/styles
```

## Quick Start

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
      onClick: () => alert('Clicked!')
    });
  </script>
</body>
</html>
```

## Components

### Phase 1 (Core)
- [x] Button
- [x] Input
- [x] Checkbox
- [x] Radio / RadioGroup
- [x] Select

### Phase 2 (Common)
- [ ] Form
- [ ] Message
- [ ] Notification
- [ ] Modal
- [ ] Drawer
- [ ] Table
- [ ] Pagination

### Phase 3 (Advanced)
- [ ] Upload
- [ ] DatePicker
- [ ] Dropdown
- [ ] Menu
- [ ] Tree
- [ ] TreeSelect

## Development

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Tests
pnpm test
pnpm test:watch

# Type checking
pnpm typecheck
```

## License

MIT
