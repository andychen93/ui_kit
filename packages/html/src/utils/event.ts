/**
 * Event management utilities
 */

import type { EventHandler } from '../types/index';

/**
 * Event listener storage for cleanup
 */
interface StoredListener {
  element: HTMLElement | Window | Document;
  event: string;
  handler: EventListener;
}

/**
 * Event manager for tracking and cleaning up listeners
 */
export class EventManager {
  private listeners: StoredListener[] = [];

  /**
   * Add event listener and track it for cleanup
   */
  on<E extends Event = Event>(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventHandler<E>,
    options?: AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler as EventListener, options);
    this.listeners.push({ element, event, handler: handler as EventListener });
  }

  /**
   * Remove specific event listener
   */
  off<E extends Event = Event>(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventHandler<E>,
    options?: EventListenerOptions
  ): void {
    element.removeEventListener(event, handler as EventListener, options);
    this.listeners = this.listeners.filter(
      listener => !(listener.element === element && listener.event === event && listener.handler === handler)
    );
  }

  /**
   * Remove all tracked listeners
   */
  removeAll(): void {
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];
  }

  /**
   * Get count of tracked listeners
   */
  count(): number {
    return this.listeners.length;
  }
}

/**
 * Create instance for global event tracking
 */
export const globalEventManager = new EventManager();

/**
 * Add delegated event listener to parent element
 */
export function addDelegatedListener<E extends Event = Event>(
  parent: HTMLElement,
  event: string,
  selector: string,
  handler: (target: HTMLElement, event: E) => void,
  options?: AddEventListenerOptions
): void {
  const listener = (e: Event) => {
    const target = (e.target as HTMLElement).closest(selector);
    if (target && parent.contains(target) && target instanceof HTMLElement) {
      handler(target, e as E);
    }
  };

  parent.addEventListener(event, listener as EventListener, options);
}

/**
 * Create a one-time event listener
 */
export function once<E extends Event = Event>(
  element: HTMLElement | Window | Document,
  event: string,
  handler: EventHandler<E>
): void {
  const listener = (e: Event) => {
    handler(e as E);
    element.removeEventListener(event, listener as EventListener);
  };

  element.addEventListener(event, listener as EventListener, { once: true });
}

/**
 * Create a throttled event handler
 */
export function throttle<Args extends any[]>(
  callback: (...args: Args) => void,
  limit: number
): (...args: Args) => void {
  let inThrottle = false;

  return (...args: Args) => {
    if (!inThrottle) {
      callback(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Create a debounced event handler
 */
export function debounce<Args extends any[]>(
  callback: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}

/**
 * Create a custom event
 */
export function createEvent<T = any>(
  eventName: string,
  detail?: T
): CustomEvent<T> {
  return new CustomEvent(eventName, { detail, bubbles: true, cancelable: true });
}

/**
 * Dispatch custom event on element
 */
export function dispatchEvent<T = any>(
  element: HTMLElement,
  eventName: string,
  detail?: T
): boolean {
  return element.dispatchEvent(createEvent<T>(eventName, detail));
}

/**
 * Check if event target matches selector
 */
export function eventTargetMatches(
  event: Event,
  selector: string
): boolean {
  const target = event.target as HTMLElement;
  return target.matches(selector);
}

/**
 * Get closest matching element from event target
 */
export function eventTargetClosest<T extends HTMLElement = HTMLElement>(
  event: Event,
  selector: string
): T | null {
  const target = event.target as HTMLElement;
  return target.closest<T>(selector);
}

/**
 * Stop event propagation
 */
export function stopPropagation(event: Event): void {
  event.stopPropagation();
}

/**
 * Prevent default event behavior
 */
export function preventDefault(event: Event): void {
  event.preventDefault();
}

/**
 * Stop propagation and prevent default
 */
export function stopImmediately(event: Event): void {
  event.stopPropagation();
  event.preventDefault();
  event.stopImmediatePropagation();
}

/**
 * Check if key matches code
 */
export function isKeyCode(event: KeyboardEvent, code: string): boolean {
  return event.code === code || event.key === code;
}

/**
 * Check if Enter key was pressed
 */
export function isEnterKey(event: KeyboardEvent): boolean {
  return isKeyCode(event, 'Enter');
}

/**
 * Check if Escape key was pressed
 */
export function isEscapeKey(event: KeyboardEvent): boolean {
  return isKeyCode(event, 'Escape');
}

/**
 * Check if mouse event is left click
 */
export function isLeftClick(event: MouseEvent): boolean {
  return event.button === 0;
}

/**
 * Check if mouse event is right click
 */
export function isRightClick(event: MouseEvent): boolean {
  return event.button === 2;
}
