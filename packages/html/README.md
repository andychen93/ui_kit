# @argon-kit/html

Pure HTML/CSS/JavaScript implementation of Argon UI Kit components. Zero framework dependencies.

Shares the same design system (`@argon-kit/styles`, `ag-*` classes + CSS variables) as the
`@argon-kit/react` / `@argon-kit/vue` / `@argon-kit/svelte` packages. All four implementations
are held to the same public API surface — see [Cross-implementation parity contract](#cross-implementation-parity-contract) below.

## Features

- 🎨 Shares the same design system as React/Vue/Svelte versions
- 📦 Zero dependencies (except `@argon-kit/styles`)
- 🚀 Vanilla JavaScript/TypeScript — works in any environment
- 📝 Full TypeScript support (strict mode, no `any`/`@ts-ignore`/non-null-assertion workarounds)
- ✨ Class-based API (`new Xxx(element, options)`) with an equivalent `createXxx(options)` factory for every component
- ✅ Every component in this package has a dedicated behavior test suite under `packages/html/__tests__`

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

## API conventions

Every component follows the same shape:

- **Constructor**: `new ComponentName(elementOrSelector, options)` mounts onto an existing DOM
  node (or CSS selector string).
- **Factory**: `createComponentName(options)` builds the container element from scratch and
  returns the instance — use this when you don't already have a mount point in the DOM.
- **`getElement()`**: returns the component's root `HTMLElement`.
- **`destroy()`**: components that attach event listeners, subscriptions, or timers (debounced
  requests, popover positioning, form-field registration, etc.) expose `destroy()` to remove all
  of them. Call it when you unmount a component to avoid leaks — this matters most for
  long-lived pages that mount/unmount components dynamically (see `apps/playground-html` for the
  pattern: every demo module returns `{ destroy }` handles that are invoked on HMR/unload).

## Form / FormItem contract

`Form` and `FormItem` are the two components most other form controls compose with.

**`Form`** (`packages/html/src/components/form.ts`) wraps a native `<form>` element and adds a
small validation engine:

- `getValue(): Record<string, any>` — reads all form values, with correct handling of radio
  groups (single value per `name`) and checkbox groups (array of checked values).
- `setValue(data)` — writes values back onto the native inputs (checked/selected/text) using the
  same radio/checkbox-group-aware logic as `getValue`.
- `registerField(config)` / `unregisterField(name)` — declare (or remove) a field's validation
  rules (`required`, `minLength`, `maxLength`, `pattern`, custom `validate`). `FormItem` calls
  these automatically when bound to a form — see below.
- `validate(): boolean` — validates every registered field, updates internal error state, and
  notifies any subscriber for each field (see `onFieldError`).
- `onFieldError(name, listener): () => void` — subscribe to error changes for one field; returns
  an unsubscribe function. This is how `FormItem` reflects `Form`-level validation without
  polling.
- `getError(name)` / `getErrors()` / `setError(name, error)` / `clearErrors()` — read/write error
  state directly (useful for server-side/async validation results).
- `submit()` — validates and, if valid, invokes `onSubmit(getValue())` programmatically (in
  addition to the native `submit` event listener already wired up).
- `destroy()` — removes all listeners and clears field/error state.

**`FormItem`** (`packages/html/src/components/form-item.ts`) is a label/control/error wrapper
that optionally binds to a `Form`:

- `label`, `required`, `error` (static), `help`/`description` render a `<label>`, a required
  marker (`ag-form-item--required`), an error message (`ag-form-item.is-error` /
  `ag-form-item--error` + `.ag-form-item__error`), and a hint (`.ag-form-item__hint`) shown only
  when there is no active error.
- Pass `form` (a `Form` instance) and `name` to bind: the item calls `form.registerField(...)`
  for you (merging `required` and any `fieldConfig`) and subscribes via `form.onFieldError(name,
  ...)`, so calling `form.validate()` automatically updates the item's error display — no manual
  wiring required.
- `appendControl(control: HTMLElement)` — insert your actual input/select/etc. into the item's
  control slot (`getControlElement()`), ahead of the hint/error message node.
- `setLabel`, `setRequired`, `setError`, `setHelp`, `getError()` — imperative updates after
  construction. `setRequired` also re-registers the field on the bound form, if any.
- `destroy()` — unsubscribes from the bound form and calls `form.unregisterField(name)`, so the
  form stops validating/tracking a field whose `FormItem` has been removed.

```ts
import { createForm, createFormItem } from '@argon-kit/html';

const form = createForm({ onSubmit: (data) => console.log(data) });
document.body.appendChild(form.getElement());

const nameItem = createFormItem({
  label: 'Name',
  name: 'name',
  required: true,
  form,
});
form.getElement().appendChild(nameItem.getElement());
// nameItem.appendControl(myInputElement);
```

## DatePicker / RangePicker

`RangePicker` (and its factory `createRangePicker`) is the canonical range-selection component —
two native `<input type="date">` elements sharing a single `onChange` handler, matching the
`RangePicker` naming used by the React/Vue/Svelte packages.

`DateRangePicker` / `createDateRangePicker` are kept as **compatibility aliases** (`export const
DateRangePicker = RangePicker`) for existing call sites. They are `@deprecated` — new code should
use `RangePicker` / `createRangePicker` directly. Both names refer to the exact same class, so
there is no behavioral difference between them.

## Cross-implementation parity contract

`@argon-kit/html` is held to the same public export surface as `@argon-kit/react`,
`@argon-kit/vue`, and `@argon-kit/svelte`. This is enforced by
`tests/contract/src/html-exports-parity.test.ts`, which runs on every `pnpm test`:

1. It computes the **runtime intersection** of React/Vue/Svelte's actual exports — this is the
   source of truth, not a hand-maintained list.
2. It asserts `@argon-kit/html` exports every name in that intersection (`missing` must be `[]`,
   coverage must be `100%`).
3. It asserts `tests/contract/component-manifest.ts` (a human-readable mirror of the same list,
   used by the Playground's coverage panel) matches the dynamically computed intersection
   exactly — if a framework adds a new shared component and HTML doesn't follow, this test fails
   with a diff instead of silently drifting.

Run it directly with:

```bash
pnpm --filter @argon-kit/contract-tests exec vitest run
```

## Security contract: `innerHTML` usage

A handful of APIs in this package accept either an `HTMLElement` or a plain `string` for
rendered content (table cell renderers, modal/drawer body/footer, custom icons, row-action
icons, and the underlying `dom.createElement({ innerHTML })` helper). When a `string` is passed,
**it is written directly via the DOM `innerHTML` setter and is not sanitized in any way**.

字符串 HTML 不会自动净化，只能传入可信内容。外部或用户输入必须由调用方先行净化。

In practice:

- Prefer returning/passing an `HTMLElement` built with `textContent` whenever the content
  includes anything derived from user input or an external source — this is always safe.
- If you must pass a `string`, only pass trusted, developer-authored markup (e.g. a fixed SVG
  icon string you wrote yourself).
- If a string must include user-provided or externally-sourced text, sanitize it yourself first
  (e.g. with [DOMPurify](https://github.com/cure53/DOMPurify)) before passing it in. None of the
  APIs below perform sanitization on your behalf.

Affected APIs (each documents this in its own JSDoc as well):

| API | Location |
|---|---|
| `Column.render` returning a `string` | `components/table.ts` |
| `TableColumn.render` returning a `string` | `components/pro-table.ts` |
| `ModalOptions.content` / `.footer`, `DrawerOptions.content` (string form) | `components/overlay.ts` |
| `ResultOptions.customIcon`, `Result.setCustomIcon(html)` | `components/result.ts` |
| `RowAction.icon` | `components/row-actions.ts` |
| `dom.createElement(tag, { innerHTML })` | `utils/dom.ts` |
| `RichText.setHTML(html)` | `packages/html-editor/src/index.ts` |

## Components

All components below are implemented, tested (see `packages/html/__tests__/`), and exported from
`@argon-kit/html`. Each also has a live, interactive demo in `apps/playground-html`
(`pnpm dev:html`).

**Form**: Button, Input, Password, Textarea, InputNumber, Select, Checkbox, Radio / RadioGroup,
Switch, Upload, DatePicker, RangePicker (+ `DateRangePicker` alias), Slider, Form, FormItem

**Overlay / feedback**: Tooltip, Popover, Popconfirm, Dropdown, Modal, Drawer, Message,
Notification, SweetAlert, Spin, Empty

**Data display**: Table, Pagination, Alert, Badge, Tag, Avatar, AvatarGroup, Card, Progress,
Timeline, Collapse, CollapsePanel, Steps, Descriptions, List

**Navigation / layout**: AppShell, Menu, Breadcrumb, Tabs, Login, StatCard, Result, Transfer,
TreeSelect, Tree

**Pro / business components**: PageSelect, QueryForm, ProTable, RowActions, StatusSwitch,
CrudFormModal

Plugin packages (separate installs, same `new Xxx(element, options)` shape): `@argon-kit/html-charts`,
`@argon-kit/html-calendar`, `@argon-kit/html-editor`.

## Development

```bash
# Install dependencies
pnpm install

# Development (interactive Playground with a live demo for every component)
pnpm dev:html

# Build
pnpm --filter @argon-kit/html build

# Tests
pnpm --filter @argon-kit/html exec vitest run
pnpm --filter @argon-kit/html exec vitest        # watch mode

# Type checking (strict, zero any/@ts-ignore/non-null-assertion workarounds)
pnpm --filter @argon-kit/html typecheck
```

## License

MIT
