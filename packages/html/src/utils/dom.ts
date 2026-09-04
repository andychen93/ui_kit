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
 * Create element with attributes and content.
 *
 * Security note: `options.innerHTML`, when provided, is written directly
 * via the DOM `innerHTML` setter and is **not sanitized**. This helper is
 * used internally by nearly every component in this package (icons, close
 * buttons, etc.) with fixed, developer-authored markup — that usage is
 * safe. If you call `createElement` yourself with `innerHTML` built from
 * user input or an external source, you are responsible for sanitizing it
 * first (e.g. with DOMPurify). Prefer `textContent` for any text that
 * isn't meant to contain markup.
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string | string[];
    attributes?: Record<string, string | undefined>;
    dataset?: Record<string, string>;
    /**
     * Written via `innerHTML` — NOT sanitized. See the function-level
     * security note above.
     */
    innerHTML?: string;
    textContent?: string;
    type?: string;
    href?: string;
    src?: string;
    alt?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    checked?: boolean;
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

  if (options?.type) {
    element.setAttribute('type', options.type);
  }

  if (options?.href) {
    element.setAttribute('href', options.href);
  }

  if (options?.src) {
    element.setAttribute('src', options.src);
  }

  if (options?.alt) {
    element.setAttribute('alt', options.alt);
  }

  if (options?.name) {
    element.setAttribute('name', options.name);
  }

  if (options?.value !== undefined) {
    element.setAttribute('value', options.value);
  }

  if (options?.placeholder) {
    element.setAttribute('placeholder', options.placeholder);
  }

  if (options?.disabled) {
    element.setAttribute('disabled', 'disabled');
  }

  if (options?.checked) {
    element.setAttribute('checked', 'checked');
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
    element.checked = String(value) === element.value;
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
 * Get all form values with proper radio/checkbox group handling
 * @param formElement - The form element to get values from
 * @returns Record of field names to values
 */
export function getFormValues(formElement: HTMLFormElement): Record<string, any> {
  const data: Record<string, any> = {};

  // Group elements by name to handle radio and checkbox groups
  const elementsByName: Record<string, HTMLElement[]> = {};
  Array.from(formElement.elements).forEach((element) => {
    // Skip disabled elements and elements without name (native FormData behavior)
    // Use element.name directly - all form controls have this property
    const el = element as HTMLElement & { name?: string; disabled?: boolean };
    if (el.disabled || !el.name) {
      return;
    }
    const name = el.name;
    if (!elementsByName[name]) {
      elementsByName[name] = [];
    }
    elementsByName[name].push(el);
  });

  // Process each group
  Object.entries(elementsByName).forEach(([name, elements]) => {
    // Check if all elements are radio buttons (same name, type=radio)
    const allRadio = elements.every(el =>
      el instanceof HTMLInputElement && el.type === 'radio'
    );

    // Check if any element is a checkbox
    const hasCheckbox = elements.some(el =>
      el instanceof HTMLInputElement && el.type === 'checkbox'
    );

    if (allRadio) {
      // Radio group: return only checked value
      const checked = elements.find(el =>
        el instanceof HTMLInputElement && el.checked
      );
      if (checked) {
        data[name] = (checked as HTMLInputElement).value;
      }
    } else if (hasCheckbox) {
      // Checkbox group: return array of checked values
      const checkedValues = elements
        .filter(el => el instanceof HTMLInputElement && el.checked)
        .map(el => (el as HTMLInputElement).value);
      data[name] = checkedValues.length > 0 ? checkedValues : null;
    } else {
      // Single input: get value directly
      const el = elements[0];
      if (el instanceof HTMLSelectElement && el.multiple) {
        data[name] = Array.from(el.selectedOptions).map(o => o.value);
      } else {
        data[name] = getValue(el);
      }
    }
  });

  return data;
}

/**
 * Set form values with proper radio/checkbox group handling
 * @param formElement - The form element to set values on
 * @param data - Record of field names to values
 */
export function setFormValues(formElement: HTMLFormElement, data: Record<string, any>): void {
  Object.entries(data).forEach(([name, value]) => {
    const elements = Array.from(formElement.elements).filter(
      el => (el as any).name === name
    ) as HTMLElement[];

    if (elements.length === 0) return;

    // Check if all elements are radio buttons
    const allRadio = elements.every(el =>
      el instanceof HTMLInputElement && el.type === 'radio'
    );

    // Check if any element is a checkbox
    const hasCheckbox = elements.some(el =>
      el instanceof HTMLInputElement && el.type === 'checkbox'
    );

    if (allRadio) {
      // Radio group: check only the one with matching value
      elements.forEach(el => {
        if (el instanceof HTMLInputElement) {
          el.checked = String(value) === el.value;
        }
      });
    } else if (hasCheckbox) {
      // Checkbox group: check elements whose value is in the array
      // If value is boolean, treat it as single checkbox checked state
      if (typeof value === 'boolean') {
        // Single checkbox: set checked state directly
        elements.forEach(el => {
          if (el instanceof HTMLInputElement) {
            el.checked = value;
          }
        });
      } else {
        // Multiple checkboxes with array of values
        const valuesArray = Array.isArray(value) ? value : [value];
        elements.forEach(el => {
          if (el instanceof HTMLInputElement) {
            el.checked = valuesArray.includes(el.value);
          }
        });
      }
    } else {
      // Handle select multiple separately
      const el = elements[0];
      if (el instanceof HTMLSelectElement && el.multiple) {
        // Clear all selections first
        Array.from(el.options).forEach(opt => opt.selected = false);
        // Set selected based on value array
        const valuesArray = Array.isArray(value) ? value : [value];
        Array.from(el.options).forEach(opt => {
          opt.selected = valuesArray.includes(opt.value);
        });
      } else {
        // Single input: set value directly
        elements.forEach(el => {
          setValue(el, value);
        });
      }
    }
  });
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
