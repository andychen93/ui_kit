/**
 * CSS class generation utilities
 */

import { ComponentSize, ComponentVariant } from '../types/index';

/**
 * Build CSS class string from object
 * @example
 * classNames('ag-btn', { 'ag-btn--primary': true, 'ag-btn--disabled': isDisabled })
 * => 'ag-btn ag-btn--primary ag-btn--disabled'
 */
export function classNames(
  base: string | (string | undefined)[] | undefined,
  conditions?: Record<string, boolean | undefined>
): string {
  const classes: string[] = [];

  // Add base classes
  if (base) {
    if (Array.isArray(base)) {
      classes.push(...base.filter((c): c is string => !!c));
    } else {
      classes.push(base);
    }
  }

  // Add conditional classes
  if (conditions) {
    Object.entries(conditions).forEach(([className, condition]) => {
      if (condition) {
        classes.push(className);
      }
    });
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Export EventManager from event.ts instead
 */
export { EventManager } from './event';

/**
 * Build button classes
 */
export function buttonClasses(options: {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-btn', options.className].filter(Boolean),
    {
      [`ag-btn--${options.variant || 'primary'}`]: true,
      [`ag-btn--${options.size || 'md'}`]: true,
      'ag-btn--disabled': options.disabled,
      'ag-btn--loading': options.loading,
    }
  );
}

/**
 * Build input classes
 */
export function inputClasses(options: {
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-input', options.className].filter(Boolean),
    {
      [`ag-input--${options.size || 'md'}`]: true,
      'ag-input--disabled': options.disabled,
      'ag-input--error': !!options.error,
    }
  );
}

/**
 * Build checkbox classes
 */
export function checkboxClasses(options: {
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-checkbox', options.className].filter(Boolean),
    {
      'ag-checkbox--disabled': options.disabled,
      'ag-checkbox--error': !!options.error,
    }
  );
}

/**
 * Build radio classes
 */
export function radioClasses(options: {
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-radio', options.className].filter(Boolean),
    {
      'ag-radio--disabled': options.disabled,
      'ag-radio--error': !!options.error,
    }
  );
}

/**
 * Build select classes
 */
export function selectClasses(options: {
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-select', options.className].filter(Boolean),
    {
      [`ag-select--${options.size || 'md'}`]: true,
      'ag-select--disabled': options.disabled,
      'ag-select--error': !!options.error,
    }
  );
}

/**
 * Build form item classes
 */
export function formItemClasses(options: {
  required?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-form-item', options.className].filter(Boolean),
    {
      'ag-form-item--required': options.required,
      'ag-form-item--error': !!options.error,
    }
  );
}

/**
 * Build alert classes
 */
export function alertClasses(options: {
  variant?: ComponentVariant;
  closeable?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-alert', options.className].filter(Boolean),
    {
      [`ag-alert--${options.variant || 'info'}`]: true,
      'ag-alert--closeable': options.closeable,
    }
  );
}

/**
 * Build badge classes
 */
export function badgeClasses(options: {
  variant?: ComponentVariant;
  size?: ComponentSize;
  className?: string;
}): string {
  return classNames(
    ['ag-badge', options.className].filter(Boolean),
    {
      [`ag-badge--${options.variant || 'primary'}`]: true,
      [`ag-badge--${options.size || 'md'}`]: true,
    }
  );
}

/**
 * Build modal classes
 */
export function modalClasses(options: {
  centered?: boolean;
  fullscreen?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-modal', options.className].filter(Boolean),
    {
      'ag-modal--centered': options.centered,
      'ag-modal--fullscreen': options.fullscreen,
    }
  );
}

/**
 * Build spinner classes
 */
export function spinnerClasses(options: {
  size?: ComponentSize;
  variant?: ComponentVariant;
  className?: string;
}): string {
  return classNames(
    ['ag-spin', options.className].filter(Boolean),
    {
      [`ag-spin--${options.size || 'md'}`]: true,
      [`ag-spin--${options.variant || 'primary'}`]: true,
    }
  );
}


/**
 * Build password classes
 */
export function passwordClasses(options: {
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-input', options.className].filter(Boolean),
    {
      [`ag-input--${options.size || 'md'}`]: true,
      'ag-input--disabled': options.disabled,
      'ag-input--error': !!options.error,
    }
  );
}

/**
 * Build textarea classes
 */
export function textareaClasses(options: {
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-textarea', options.className].filter(Boolean),
    {
      [`ag-textarea--${options.size || 'md'}`]: true,
      'ag-textarea--disabled': options.disabled,
      'ag-textarea--error': !!options.error,
    }
  );
}

/**
 * Build input-number classes
 */
export function inputNumberClasses(options: {
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-input-number', options.className].filter(Boolean),
    {
      [`ag-input-number--${options.size || 'md'}`]: true,
      'ag-input-number--disabled': options.disabled,
      'ag-input-number--error': !!options.error,
    }
  );
}

/**
 * Build switch classes
 */
export function switchClasses(options: {
  size?: ComponentSize;
  disabled?: boolean;
  checked?: boolean;
  loading?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-switch', options.className].filter(Boolean),
    {
      [`ag-switch--${options.size || 'md'}`]: true,
      'ag-switch--disabled': options.disabled,
      'ag-switch--checked': options.checked,
      'ag-switch--loading': options.loading,
    }
  );
}

/**
 * Build tooltip classes
 */
export function tooltipClasses(options: {
  variant?: ComponentVariant;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}): string {
  return classNames(
    ['ag-tooltip', options.className].filter(Boolean),
    {
      [`ag-tooltip--${options.variant || 'info'}`]: true,
      [`ag-tooltip--${options.position || 'top'}`]: true,
    }
  );
}

/**
 * Build popover classes
 */
export function popoverClasses(options: {
  variant?: ComponentVariant;
  title?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-popover', options.className].filter(Boolean),
    {
      [`ag-popover--${options.variant || 'light'}`]: true,
      'ag-popover--title': options.title,
    }
  );
}

/**
 * Build popconfirm classes
 */
export function popconfirmClasses(options: {
  variant?: ComponentVariant;
  title?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-popconfirm', options.className].filter(Boolean),
    {
      [`ag-popconfirm--${options.variant || 'warning'}`]: true,
      'ag-popconfirm--title': options.title,
    }
  );
}

/**
 * Build avatar classes
 */
export function avatarClasses(options: {
  size?: ComponentSize;
  shape?: 'circle' | 'square';
  src?: string;
  icon?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-avatar', options.className].filter(Boolean),
    {
      [`ag-avatar--${options.size || 'md'}`]: true,
      'ag-avatar--circle': options.shape === 'circle',
      'ag-avatar--square': options.shape === 'square',
      'ag-avatar--icon': options.icon,
    }
  );
}

/**
 * Build avatar-group classes
 */
export function avatarGroupClasses(options: {
  size?: ComponentSize;
  max?: number;
  overlap?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-avatar-group', options.className].filter(Boolean),
    {
      [`ag-avatar-group--${options.size || 'md'}`]: true,
      'ag-avatar-group--overlap': options.overlap,
    }
  );
}

/**
 * Build card classes
 */
export function cardClasses(options: {
  title?: boolean;
  bordered?: boolean;
  loading?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-card', options.className].filter(Boolean),
    {
      'ag-card--bordered': options.bordered,
      'ag-card--loading': options.loading,
    }
  );
}

/**
 * Build progress classes
 */
export function progressClasses(options: {
  size?: ComponentSize;
  variant?: ComponentVariant;
  type?: 'line' | 'circle' | 'dashboard';
  status?: 'normal' | 'active' | 'success' | 'exception';
  className?: string;
}): string {
  return classNames(
    ['ag-progress', options.className].filter(Boolean),
    {
      [`ag-progress--${options.size || 'md'}`]: true,
      [`ag-progress--${options.type || 'line'}`]: true,
      [`ag-progress--${options.status || 'normal'}`]: true,
      [`ag-progress--${options.variant || 'primary'}`]: true,
    }
  );
}

/**
 * Build timeline classes
 */
export function timelineClasses(options: {
  pending?: boolean;
  pendingText?: string;
  mode?: 'left' | 'right' | 'alternate';
  className?: string;
}): string {
  return classNames(
    ['ag-timeline', options.className].filter(Boolean),
    {
      'ag-timeline--pending': options.pending,
      'ag-timeline--left': options.mode === 'left',
      'ag-timeline--right': options.mode === 'right',
      'ag-timeline--alternate': options.mode === 'alternate',
    }
  );
}

/**
 * Build collapse classes
 */
export function collapseClasses(options: {
  accordion?: boolean;
  bordered?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-collapse', options.className].filter(Boolean),
    {
      'ag-collapse--accordion': options.accordion,
      'ag-collapse--bordered': options.bordered,
    }
  );
}

/**
 * Build collapse-panel classes
 */
export function collapsePanelClasses(options: {
  title?: string;
  disabled?: boolean;
  extra?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-collapse-panel', options.className].filter(Boolean),
    {
      'ag-collapse-panel--disabled': options.disabled,
      'ag-collapse-panel--extra': options.extra,
    }
  );
}

/**
 * Build steps classes
 */
export function stepsClasses(options: {
  current?: number;
  size?: ComponentSize;
  direction?: 'horizontal' | 'vertical';
  status?: 'wait' | 'process' | 'finish' | 'error';
  className?: string;
}): string {
  return classNames(
    ['ag-steps', options.className].filter(Boolean),
    {
      [`ag-steps--${options.size || 'md'}`]: true,
      'ag-steps--vertical': options.direction === 'vertical',
      'ag-steps--horizontal': options.direction === 'horizontal',
    }
  );
}

/**
 * Build step-item classes
 */
export function stepItemClasses(options: {
  current?: number;
  status?: 'wait' | 'process' | 'finish' | 'error';
  index: number;
  className?: string;
}): string {
  const isCurrent = options.index === options.current;
  const isFinished = options.index < options.current;
  const status = isFinished ? 'finish' : isCurrent ? 'process' : 'wait';
  
  return classNames(
    ['ag-step-item', options.className].filter(Boolean),
    {
      [`ag-step-item--${status}`]: true,
    }
  );
}

/**
 * Build slider classes
 */
export function sliderClasses(options: {
  disabled?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-slider', options.className].filter(Boolean),
    {
      'ag-slider--disabled': options.disabled,
    }
  );
}

/**
 * Build descriptions classes
 */
export function descriptionsClasses(options: {
  title?: boolean;
  bordered?: boolean;
  size?: ComponentSize;
  column?: number;
  className?: string;
}): string {
  return classNames(
    ['ag-descriptions', options.className].filter(Boolean),
    {
      'ag-descriptions--bordered': options.bordered,
      [`ag-descriptions--${options.size || 'md'}`]: true,
    }
  );
}

/**
 * Build descriptions-item classes
 */
export function descriptionsItemClasses(options: {
  label?: string;
  span?: number;
  className?: string;
}): string {
  return classNames(
    ['ag-descriptions-item', options.className].filter(Boolean),
    {}
  );
}

/**
 * Build list classes
 */
export function listClasses(options: {
  size?: ComponentSize;
  bordered?: boolean;
  split?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-list', options.className].filter(Boolean),
    {
      [`ag-list--${options.size || 'md'}`]: true,
      'ag-list--bordered': options.bordered,
      'ag-list--split': options.split,
    }
  );
}

/**
 * Build list-item classes
 */
export function listItemClasses(options: {
  action?: boolean;
  extra?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-list-item', options.className].filter(Boolean),
    {
      'ag-list-item--action': options.action,
      'ag-list-item--extra': options.extra,
    }
  );
}

/**
 * Build empty classes
 */
export function emptyClasses(options: {
  image?: 'empty' | 'error' | 'network' | 'noData';
  description?: string;
  className?: string;
}): string {
  return classNames(
    ['ag-empty', options.className].filter(Boolean),
    {
      'ag-empty--error': options.image === 'error',
      'ag-empty--network': options.image === 'network',
      'ag-empty--noData': options.image === 'noData',
    }
  );
}

/**
 * Build sweet-alert classes
 */
export function sweetAlertClasses(options: {
  variant?: ComponentVariant;
  title?: boolean;
  type?: 'success' | 'error' | 'warning' | 'info' | 'question';
  className?: string;
}): string {
  return classNames(
    ['ag-sweet-alert', options.className].filter(Boolean),
    {
      [`ag-sweet-alert--${options.variant || 'info'}`]: true,
      'ag-sweet-alert--title': options.title,
    }
  );
}

/**
 * Build page-select classes
 */
export function pageSelectClasses(options: {
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-page-select', options.className].filter(Boolean),
    {
      [`ag-page-select--${options.size || 'md'}`]: true,
      'ag-page-select--disabled': options.disabled,
      'ag-page-select--error': !!options.error,
    }
  );
}

/**
 * Build tree-select classes
 */
export function treeSelectClasses(options: {
  size?: ComponentSize;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}): string {
  return classNames(
    ['ag-tree-select', options.className].filter(Boolean),
    {
      [`ag-tree-select--${options.size || 'md'}`]: true,
      'ag-tree-select--disabled': options.disabled,
      'ag-tree-select--error': !!options.error,
    }
  );
}

/**
 * Build status-switch classes
 */
export function statusSwitchClasses(options: {
  size?: ComponentSize;
  disabled?: boolean;
  checked?: boolean;
  loading?: boolean;
  className?: string;
}): string {
  return classNames(
    ['ag-status-switch', options.className].filter(Boolean),
    {
      [`ag-status-switch--${options.size || 'md'}`]: true,
      'ag-status-switch--disabled': options.disabled,
      'ag-status-switch--checked': options.checked,
      'ag-status-switch--loading': options.loading,
    }
  );
}

/**
 * Merge multiple class strings
 */
export function mergeClasses(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
