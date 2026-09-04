/**
 * Common component size variants
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Common component color variants
 */
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark';

/**
 * Component state
 */
export interface ComponentState {
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

/**
 * Event handler types
 */
export type EventHandler<T = Event> = (event: T) => void;
export type ChangeHandler<T = any> = (value: T, event: Event) => void;

/**
 * Component base options
 */
export interface ComponentOptions extends ComponentState {
  className?: string;
  dataset?: Record<string, string>;
}
