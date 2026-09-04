/**
 * DOM utility functions for component operations
 */

/**
 * Get element from selector or element
 */
export function getElement<T extends HTMLElement = HTMLElement>(
  selector: string | T
): T {
  if (typeof selector === 'string') {
    const element = document.querySelector<T>(selector);
    if (!element) {
      throw new Error(`Element not found for selector: ${selector}`);
    }
    return element;
  }
  return selector;
}

/**
 * Get element or null if not found
 */
export function getElementOrNull<T extends HTMLElement = HTMLElement>(
  selector: string | T | null | undefined,
  parent: HTMLElement | Document = document
): T | null {
  if (!selector) return null;
  if (typeof selector === 'string') {
    return (parent instanceof HTMLElement ? parent : document).querySelector<T>(selector);
  }
  return selector;
}

/**
 * Get all elements matching selector
 */
export function getElements<T extends HTMLElement = HTMLElement>(
  selector: string
): T[] {
  return Array.from(document.querySelectorAll<T>(selector));
}

/**
 * Create element with attributes and content
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string | string[];
    attributes?: Record<string, string | undefined>;
    dataset?: Record<string, string>;
    innerHTML?: string;
    textContent?: string;
  }
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options?.className) {
    if (typeof options.className === 'string') {
      element.className = options.className;
    } else {
      element.classList.add(...options.className.filter(Boolean));
    }
  }

  if (options?.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        element.setAttribute(key, value);
      }
    });
  }

  if (options?.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      element.dataset[key] = value;
    });
  }

  if (options?.innerHTML) {
    element.innerHTML = options.innerHTML;
  }

  if (options?.textContent) {
    element.textContent = options.textContent;
  }

  return element;
}

/**
 * Check if element matches selector or has ancestor matching selector
 */
export function closest<T extends HTMLElement = HTMLElement>(
  element: HTMLElement,
  selector: string
): T | null {
  return element.closest<T>(selector);
}

/**
 * Check if element has specific class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Add classes to element
 */
export function addClass(
  element: HTMLElement,
  ...classNames: (string | undefined | null)[]
): void {
  const names = classNames.filter(Boolean) as string[];
  element.classList.add(...names);
}

/**
 * Remove classes from element
 */
export function removeClass(
  element: HTMLElement,
  ...classNames: (string | undefined | null)[]
): void {
  const names = classNames.filter(Boolean) as string[];
  element.classList.remove(...names);
}

/**
 * Toggle class on element
 */
export function toggleClass(
  element: HTMLElement,
  className: string,
  force?: boolean
): boolean {
  return element.classList.toggle(className, force);
}

/**
 * Set multiple attributes on element
 */
export function setAttributes(
  element: HTMLElement,
  attributes: Record<string, string | null | undefined>
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, value);
    }
  });
}

/**
 * Get element data attributes
 */
export function getDataset(element: HTMLElement): Record<string, string> {
  return element.dataset as Record<string, string>;
}

/**
 * Set element data attributes
 */
export function setDataset(
  element: HTMLElement,
  data: Record<string, string>
): void {
  Object.entries(data).forEach(([key, value]) => {
    element.dataset[key] = value;
  });
}

/**
 * Remove element from DOM
 */
export function removeElement(element: HTMLElement): void {
  element.remove();
}

/**
 * Insert element after reference element
 */
export function insertAfter(
  element: HTMLElement,
  referenceElement: HTMLElement
): void {
  referenceElement.parentNode?.insertBefore(element, referenceElement.nextSibling);
}

/**
 * Insert element before reference element
 */
export function insertBefore(
  element: HTMLElement,
  referenceElement: HTMLElement
): void {
  referenceElement.parentNode?.insertBefore(element, referenceElement);
}

/**
 * Prepend element to parent
 */
export function prepend(parent: HTMLElement, element: HTMLElement): void {
  parent.insertBefore(element, parent.firstChild);
}

/**
 * Append element to parent
 */
export function append(parent: HTMLElement, element: HTMLElement): void {
  parent.appendChild(element);
}

/**
 * Get computed style value
 */
export function getComputedStyleValue(
  element: HTMLElement,
  property: string
): string {
  return getComputedStyle(element).getPropertyValue(property);
}

/**
 * Show element (remove display: none)
 */
export function show(element: HTMLElement): void {
  element.style.display = '';
}

/**
 * Hide element (set display: none)
 */
export function hide(element: HTMLElement): void {
  element.style.display = 'none';
}

/**
 * Check if element is visible in viewport
 */
export function isVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Get element position relative to viewport
 */
export function getPosition(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Scroll element into view
 */
export function scrollIntoView(element: HTMLElement): void {
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Focus element
 */
export function focus(element: HTMLElement): void {
  if (element instanceof HTMLInputElement) {
    element.focus();
  }
}

/**
 * Blur element
 */
export function blur(element: HTMLElement): void {
  if (element instanceof HTMLInputElement) {
    element.blur();
  }
}

/**
 * Check if element is form input
 */
export function isFormInput(element: HTMLElement): element is HTMLInputElement {
  return element instanceof HTMLInputElement;
}

/**
 * Check if element is textarea
 */
export function isTextarea(element: HTMLElement): element is HTMLTextAreaElement {
  return element instanceof HTMLTextAreaElement;
}

/**
 * Check if element is select
 */
export function isSelect(element: HTMLElement): element is HTMLSelectElement {
  return element instanceof HTMLSelectElement;
}

/**
 * Get form input value
 */
export function getValue(element: HTMLElement): string | string[] | null {
  // Check checkbox first (before general isFormInput)
  if (element instanceof HTMLInputElement && element.type === 'checkbox') {
    return element.checked ? (element.value || 'on') : null;
  }
  // Check radio first (before general isFormInput)
  if (element instanceof HTMLInputElement && element.type === 'radio') {
    return element.checked ? (element.value || 'on') : null;
  }
  // Now check general form inputs
  if (isFormInput(element) || isTextarea(element)) {
    return element.value;
  }
  if (isSelect(element)) {
    if (element.multiple) {
      return Array.from(element.selectedOptions).map(o => o.value);
    }
    return element.value;
  }
  return null;
}

/**
 * Set form input value
 */
export function setValue(element: HTMLElement, value: string | number | boolean): void {
  // Check checkbox first (before general isFormInput)
  if (element instanceof HTMLInputElement && element.type === 'checkbox') {
    element.checked = Boolean(value);
    return;
  }
  // Check radio first (before general isFormInput)
  if (element instanceof HTMLInputElement && element.type === 'radio') {
    element.checked = Boolean(value);
    return;
  }
  // Now check general form inputs
  if (isFormInput(element) || isTextarea(element)) {
    element.value = String(value);
    return;
  }
  if (isSelect(element)) {
    element.value = String(value);
    return;
  }
}

/**
 * Disable element
 */
export function disable(element: HTMLElement): void {
  if (element instanceof HTMLButtonElement ||
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement) {
    element.disabled = true;
  }
  addClass(element, 'ag-disabled');
}

/**
 * Enable element
 */
export function enable(element: HTMLElement): void {
  if (element instanceof HTMLButtonElement ||
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement) {
    element.disabled = false;
  }
  removeClass(element, 'ag-disabled');
}
