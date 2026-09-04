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

export { FormItem, createFormItem } from './components/form-item';
export type { FormItemOptions } from './components/form-item';

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

export {
  DatePicker,
  RangePicker,
  DateRangePicker,
  createDatePicker,
  createRangePicker,
  createDateRangePicker,
} from './components/datepicker';
export type { DatePickerOptions, RangePickerOptions, DateRangePickerOptions } from './components/datepicker';

export { Dropdown, Tree, createTree } from './components/dropdown';
export type { MenuItem, DropdownOptions, TreeNode, TreeOptions } from './components/dropdown';

// Phase 4 - Form Components
export { Password, createPassword } from './components/password';
export type { PasswordOptions } from './components/password';

export { Textarea, createTextarea } from './components/textarea';
export type { TextareaOptions } from './components/textarea';

export { InputNumber, createInputNumber } from './components/input-number';
export type { InputNumberOptions } from './components/input-number';

export { Switch, createSwitch } from './components/switch';
export type { SwitchOptions } from './components/switch';

// Phase 5 - Overlay Components
export { Tooltip, createTooltip } from './components/tooltip';
export type { TooltipOptions } from './components/tooltip';

export { Popover, createPopover } from './components/popover';
export type { PopoverOptions } from './components/popover';

export { Popconfirm, createPopconfirm } from './components/popconfirm';
export type { PopconfirmOptions } from './components/popconfirm';

// Phase 6 - Layout Components
export { AppShell, createAppShell } from './components/app-shell';
export type { AppShellOptions } from './components/app-shell';

export { Menu, createMenu } from './components/menu';
export type { MenuOptions, MenuItemOptions } from './components/menu';

export { Breadcrumb, createBreadcrumb } from './components/breadcrumb';
export type { BreadcrumbOptions, BreadcrumbItem } from './components/breadcrumb';

export { Tabs, createTabs } from './components/tabs';
export type { TabsOptions, TabItem } from './components/tabs';

export { Login, createLogin } from './components/login';
export type { LoginOptions } from './components/login';

export { StatCard, createStatCard } from './components/stat-card';
export type { StatCardOptions } from './components/stat-card';

export { Result, createResult } from './components/result';
export type { ResultOptions } from './components/result';

export { Transfer, createTransfer } from './components/transfer';
export type { TransferOptions, TransferItem } from './components/transfer';

// Phase 7 - Data Display Components
export { Alert, createAlert } from './components/alert';
export type { AlertOptions } from './components/alert';

export { Badge, createBadge } from './components/badge';
export type { BadgeOptions } from './components/badge';

export { Tag, createTag } from './components/tag';
export type { TagOptions } from './components/tag';

export { Avatar, createAvatar } from './components/avatar';
export type { AvatarOptions } from './components/avatar';

export { AvatarGroup, createAvatarGroup } from './components/avatar-group';
export type { AvatarGroupOptions } from './components/avatar-group';

export { Card, createCard } from './components/card';
export type { CardOptions } from './components/card';

export { Progress, createProgress } from './components/progress';
export type { ProgressOptions } from './components/progress';

export { Timeline, createTimeline } from './components/timeline';
export type { TimelineOptions } from './components/timeline';

export { Collapse, createCollapse } from './components/collapse';
export type { CollapseOptions } from './components/collapse';

export { CollapsePanel, createCollapsePanel } from './components/collapse-panel';
export type { CollapsePanelOptions } from './components/collapse-panel';

export { Steps, createSteps } from './components/steps';
export type { StepsOptions, StepItemOptions } from './components/steps';

export { Slider, createSlider } from './components/slider';
export type { SliderOptions } from './components/slider';

export { Spin, createSpin } from './components/spin';
export type { SpinOptions } from './components/spin';

export { Descriptions, createDescriptions } from './components/descriptions';
export type { DescriptionsOptions, DescriptionItemOptions } from './components/descriptions';

export { List, createList } from './components/list';
export type { ListOptions, ListItemOptions } from './components/list';

export { Empty, createEmpty } from './components/empty';
export type { EmptyOptions } from './components/empty';

export { SweetAlert, createSweetAlert } from './components/sweet-alert';
export type { SweetAlertOptions } from './components/sweet-alert';

// Phase 8 - Pro Components
export { PageSelect, createPageSelect } from './components/page-select';
export type { PageSelectOptions } from './components/page-select';

export { QueryForm, createQueryForm } from './components/query-form';
export type { QueryFormOptions, QueryFormItem } from './components/query-form';

export { ProTable, createProTable } from './components/pro-table';
export type { ProTableOptions, TableColumn } from './components/pro-table';

export { RowActions, createRowActions } from './components/row-actions';
export type { RowActionsOptions, RowAction } from './components/row-actions';

export { StatusSwitch, createStatusSwitch } from './components/status-switch';
export type { StatusSwitchOptions } from './components/status-switch';

export { TreeSelect, createTreeSelect } from './components/tree-select';
export type { TreeSelectOptions } from './components/tree-select';

export { CrudFormModal, createCrudFormModal } from './components/crud-form-modal';
export type { CrudFormOptions } from './components/crud-form-modal';

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
