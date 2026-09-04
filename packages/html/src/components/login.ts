/**
 * Login component
 */

import * as dom from '../utils/dom';
import { EventManager } from '../utils/event';

export interface LoginOptions {
  title?: string;
  subtitle?: string;
  submitText?: string;
  rememberText?: string;
  forgotText?: string;
  registerText?: string;
  className?: string;
}

export class Login {
  private element: HTMLDivElement;
  private options: LoginOptions;
  private eventManager = new EventManager();

  constructor(
    element: HTMLDivElement | string,
    options: LoginOptions = {}
  ) {
    this.element = dom.getElement<HTMLDivElement>(element);
    this.options = {
      submitText: 'Login',
      rememberText: 'Remember me',
      forgotText: 'Forgot password?',
      registerText: 'Register now',
      ...options,
    };
    this.init();
  }

  private init(): void {
    this.createHeader();
    this.createForm();
    this.createFooter();
  }

  private createHeader(): void {
    const header = dom.createElement('div', {
      className: 'ag-login-header',
    });

    if (this.options.title) {
      const title = dom.createElement('div', {
        className: 'ag-login-title',
        textContent: this.options.title,
      });
      header.appendChild(title);
    }

    if (this.options.subtitle) {
      const subtitle = dom.createElement('div', {
        className: 'ag-login-subtitle',
        textContent: this.options.subtitle,
      });
      header.appendChild(subtitle);
    }

    this.element.appendChild(header);
  }

  private createForm(): void {
    const form = dom.createElement('form', {
      className: 'ag-login-form',
    });

    // Username input
    const usernameItem = this.createFormItem('username', 'text', 'Username');
    form.appendChild(usernameItem);

    // Password input
    const passwordItem = this.createFormItem('password', 'password', 'Password');
    form.appendChild(passwordItem);

    // Remember me and Forgot password
    const actions = dom.createElement('div', {
      className: 'ag-login-form-actions',
    });

    const remember = dom.createElement('div', {
      className: 'ag-login-form-remember',
    });

    const rememberInput = dom.createElement('input', {
      type: 'checkbox',
      className: 'ag-checkbox-input',
    });
    remember.appendChild(rememberInput);

    const rememberLabel = dom.createElement('label', {
      className: 'ag-checkbox-label',
      textContent: this.options.rememberText,
    });
    rememberLabel.appendChild(rememberInput);
    remember.appendChild(rememberLabel);

    actions.appendChild(remember);

    if (this.options.forgotText) {
      const forgot = dom.createElement('a', {
        className: 'ag-login-form-forgot',
        href: '#',
        textContent: this.options.forgotText,
      });
      actions.appendChild(forgot);
    }

    form.appendChild(actions);

    // Submit button
    const submitBtn = dom.createElement('button', {
      type: 'submit',
      className: 'ag-btn ag-btn--primary ag-btn--block',
      textContent: this.options.submitText,
    });
    form.appendChild(submitBtn);

    this.element.appendChild(form);
  }

  private createFormItem(name: string, type: string, placeholder: string): HTMLDivElement {
    const item = dom.createElement('div', {
      className: 'ag-login-form-item',
    });

    const label = dom.createElement('label', {
      className: 'ag-login-form-label',
      textContent: placeholder,
    });
    item.appendChild(label);

    const input = dom.createElement('input', {
      type: type,
      name: name,
      className: 'ag-input',
      placeholder: placeholder,
    });
    item.appendChild(input);

    return item;
  }

  private createFooter(): void {
    const footer = dom.createElement('div', {
      className: 'ag-login-footer',
    });

    if (this.options.registerText) {
      const register = dom.createElement('a', {
        className: 'ag-login-register',
        href: '#',
        textContent: this.options.registerText,
      });
      footer.appendChild(register);
    }

    this.element.appendChild(footer);
  }

  /**
   * Set title
   */
  setTitle(title: string): void {
    this.options.title = title;
    const titleEl = this.element.querySelector('.ag-login-title');
    if (titleEl) {
      titleEl.textContent = title;
    }
  }

  /**
   * Set subtitle
   */
  setSubtitle(subtitle: string): void {
    this.options.subtitle = subtitle;
    const subtitleEl = this.element.querySelector('.ag-login-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = subtitle;
    }
  }

  /**
   * Get form element
   */
  getForm(): HTMLFormElement {
    return this.element.querySelector('.ag-login-form') as HTMLFormElement;
  }

  /**
   * Get native element
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Destroy component
   */
  destroy(): void {
    this.eventManager.removeAll();
    const form = this.element.querySelector('.ag-login-form');
    if (form) {
      form.remove();
    }
  }
}

/**
 * Create login from scratch
 */
export function createLogin(options: LoginOptions = {}): Login {
  const container = dom.createElement('div', {
    className: 'ag-login',
  });

  const instance = new Login(container, options);
  return instance;
}
