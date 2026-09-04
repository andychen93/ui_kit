/**
 * Argon UI Kit - HTML Version
 * Pure HTML/CSS/JavaScript components with zero framework dependencies
 */

// Export types
export type { ComponentSize, ComponentVariant, ComponentState, ComponentOptions } from './types/index';
export type { EventHandler, ChangeHandler } from './types/index';

// Phase 1 - Core Components
export { Button, createButton } from './components/button';
export type { ButtonOptions } from './components/button';

export { Input, createInput } from './components/input';
export type { InputOptions } from './components/input';

export { Checkbox, createCheckbox } from './components/checkbox';
export type { CheckboxOptions } from './components/checkbox';

export { Radio, RadioGroup, createRadio, createRadioGroup } from './components/radio';
export type { RadioOptions, RadioGroupOptions } from './components/radio';

export { Select, createSelect } from './components/select';
export type { SelectOptions, SelectOption } from './components/select';

// Phase 2 - Common Components
export { Form, createForm } from './components/form';
export type { FormFieldConfig, FormOptions } from './components/form';

export { Message, showMessage, message } from './components/message';
export type { MessageOptions } from './components/message';

export { Notification, showNotification, notification } from './components/notification';
export type { NotificationOptions } from './components/notification';

export { Modal, Drawer, showModal, showDrawer } from './components/overlay';
export type { ModalOptions, DrawerOptions } from './components/overlay';

export { Table, Pagination, createTable, createPagination } from './components/table';
export type { Column, TableOptions, PaginationOptions } from './components/table';

// Phase 3 - Advanced Components
export { Upload, createUpload } from './components/upload';
export type { UploadOptions } from './components/upload';

export { DatePicker, DateRangePicker, createDatePicker, createDateRangePicker } from './components/datepicker';
export type { DatePickerOptions, DateRangePickerOptions } from './components/datepicker';

export { Dropdown, Tree, createTree } from './components/dropdown';
export type { MenuItem, DropdownOptions, TreeNode, TreeOptions } from './components/dropdown';

// Export utilities
export * from './utils/dom';
export { EventManager } from './utils/event';
export { classNames } from './utils/css-classes';
export {
  throttle,
  debounce,
  createEvent,
  dispatchEvent,
  stopPropagation,
  preventDefault,
  stopImmediately,
  isKeyCode,
  isEnterKey,
  isEscapeKey,
  isLeftClick,
  isRightClick,
} from './utils/event';
