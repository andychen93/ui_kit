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
 * Merge multiple class strings
 */
export function mergeClasses(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
